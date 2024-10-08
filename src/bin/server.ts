#!/usr/bin/env node

//@ts-check
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { PORT } from "../constants";
import { postToSoilAi } from "./soilai-request";
import {
  findFileWithSoilId,
  getSoilPageTemplate,
  writeToFile,
} from "./find-file";
import { v4 as uuidv4 } from "uuid";
import { InitialMessage, SoilAiPayload } from "../types";
import { config } from "dotenv";
import net from "net";

config({ path: `.env.development` });

const soilAiDebug = process.env.DEBUG?.includes("soilai")
  ? (message: string, data?: unknown) => {
      if (data) console.log(message, data);
      else console.log(message);
    }
  : () => {};

interface RequestQueueItem {
  data: SoilAiPayload;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

function getResponseEnd(res: ServerResponse) {
  return function responseStatus(status = 200) {
    soilAiDebug(`Setting response status: ${status}`);
    if (!res.headersSent) res.writeHead(status);
    return function responseEnd(data?: unknown) {
      soilAiDebug(
        `Ending response with data: ${data ? JSON.stringify(data) : "No data"}`
      );
      res.end(data ? JSON.stringify(data) : undefined);
      return res;
    };
  };
}

const requestQueue: Map<string, RequestQueueItem[]> = new Map();
const processingFiles: Set<string> = new Set();

const processQueue = async (filePath: string, apiKey: string) => {
  if (processingFiles.has(filePath)) {
    soilAiDebug(`Already processing file: ${filePath}`);
    return;
  }
  const queue = requestQueue.get(filePath);
  if (!queue || queue.length === 0) {
    soilAiDebug(`No requests in queue for file: ${filePath}`);
    return;
  }

  soilAiDebug(`Processing queue for file: ${filePath}`);
  processingFiles.add(filePath);

  while (queue.length > 0) {
    const { data, resolve, reject } = queue.shift()!;
    try {
      soilAiDebug("Processing data with soilId:", data.soilId);
      const fileData = await findFileWithSoilId(data.soilId);
      if (!fileData) throw new Error("File with Soil ID not found");

      const { modifiedFileContents } = await postToSoilAi(
        {
          ...fileData,
          message: data.message,
        },
        apiKey
      );

      if (!modifiedFileContents.includes(`data-soil-id="${data.soilId}"`)) {
        throw new Error("Error: soilId not found in modified file contents");
      }

      soilAiDebug(`Writing modified contents to file: ${fileData.filePath}`);
      await writeToFile(fileData.filePath, modifiedFileContents);

      resolve({ success: true });
    } catch (error) {
      soilAiDebug(`Error processing queue for file: ${filePath}`, error);
      if (error instanceof Error) {
        reject({ success: false, error: error.message });
      }
    }
  }

  soilAiDebug(`Finished processing queue for file: ${filePath}`);
  processingFiles.delete(filePath);
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  soilAiDebug(`Soil server: ${req.method} ${req.url}`);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Content-Type", "application/json");

  const apiKey = process.env.SOILAI_API_KEY;
  if (!apiKey) {
    soilAiDebug("SOILAI_API_KEY is not defined in .env.development");
    throw Error("SOILAI_API_KEY is not defined in .env.development");
  }

  const responseStatus = getResponseEnd(res);

  if (req.method === "GET" && req.url === "/") {
    soilAiDebug("Received GET request at root endpoint");
    return responseStatus()();
  }

  if (req.method === "OPTIONS") {
    soilAiDebug("Received OPTIONS request");
    return responseStatus(204)();
  }

  if (req.method !== "POST" || req.url !== "/") {
    soilAiDebug(`Invalid request: ${req.method} ${req.url}`);
    return responseStatus(404)({ success: false, error: "Not found" });
  }

  let body = "";

  req.on("data", (chunk) => {
    soilAiDebug("Received chunk of data");
    body += chunk.toString();
  });

  req.on("end", async () => {
    soilAiDebug("Request data fully received");
    try {
      const { message, soilId, pathname }: InitialMessage = JSON.parse(body);
      soilAiDebug("Parsed request body:", { message, soilId, pathname });

      if (typeof message !== "string") {
        soilAiDebug("Message is required and must be a string");
        throw Error("Message is required");
      }

      if (!soilId || (typeof soilId !== "string" && pathname)) {
        soilAiDebug("Creating new Soil ID and file");
        const newSoilId = uuidv4();

        const newFileContents = await getSoilPageTemplate(newSoilId);

        const newFilePath = `./app${pathname}/page.tsx`;

        soilAiDebug(`Posting to SoilAI for new file: ${newFilePath}`);
        const { modifiedFileContents: modifiedNewFileContents } =
          await postToSoilAi(
            {
              message,
              fileContents: newFileContents,
              filePath: newFilePath,
              fileExt: "tsx",
              soilId: newSoilId,
            },
            apiKey
          );
        if (!modifiedNewFileContents.includes(newSoilId)) {
          soilAiDebug("Error: soilId not found in modified file contents");
          throw new Error("Error: soilId not found in modified file contents");
        }

        soilAiDebug(`Writing new file to path: ${newFilePath}`);
        await writeToFile(newFilePath, modifiedNewFileContents);
      } else {
        soilAiDebug(`Adding request to queue for Soil ID: ${soilId}`);
        const fileData = await findFileWithSoilId(soilId);
        if (!fileData) {
          soilAiDebug("File with Soil ID not found");
          throw Error("File with Soil ID not found");
        }

        const { filePath } = fileData;

        // Create a new promise to handle the response
        const queuePromise = new Promise((resolve, reject) => {
          // Add request to the queue
          if (!requestQueue.has(filePath)) {
            requestQueue.set(filePath, []);
          }
          requestQueue
            .get(filePath)!
            .push({ data: { ...fileData, message }, resolve, reject });

          // Start processing the queue
          processQueue(filePath, apiKey);
        });

        // Send the response when the queue promise resolves or rejects
        queuePromise.then(responseStatus()).catch((error) => {
          soilAiDebug("Error resolving queue promise:", error);
          responseStatus(400)(error);
        });
      }
    } catch (error) {
      soilAiDebug("Error in request handling:", error);
      if (error instanceof Error)
        return responseStatus(400)({ success: false, error: error.message });
    }
  });
});

function checkPortAvailability(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net
      .createServer()
      .once("error", () => resolve(false))
      .once("listening", () => {
        server.close();
        resolve(true);
      })
      .listen(port);
  });
}

async function findAvailablePort(startPort: number): Promise<number> {
  let port = startPort;
  while (true) {
    const isAvailable = await checkPortAvailability(port);
    if (isAvailable) {
      return port;
    }
    port++;
  }
}

findAvailablePort(PORT).then((availablePort) => {
  server.listen(availablePort, () => {
    console.log(`Soil dev server is listening on port ${availablePort}`);
  });
});
