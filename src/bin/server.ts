#!/usr/bin/env node

//@ts-check
import debug from "debug";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { PORT } from "../constants";
import { postToSoilAi } from "./soilai-request";
import { findFileWithSoilId, writeToFile } from "./find-file";
import { v4 as uuidv4 } from "uuid";
import { InitialMessage, SoilAiPayload } from "../types";
import { getNewNextFile } from "./new-page";

const soilAiDebug = debug("soilai");

interface RequestQueueItem {
  data: SoilAiPayload;
  resolve: (value: unknown) => void;
  reject: (reason?: any) => void;
}

const requestQueue: Map<string, RequestQueueItem[]> = new Map();
const processingFiles: Set<string> = new Set();

function getResponseEnd(res: ServerResponse) {
  return function responseStatus(status = 200) {
    res.writeHead(status, { "Content-Type": "application/json" });
    return function responseEnd(data?: unknown) {
      res.end(data ? JSON.stringify(data) : undefined);
      return res;
    };
  };
}

const processQueue = async (filePath: string, apiKey: string) => {
  if (processingFiles.has(filePath)) return;
  const queue = requestQueue.get(filePath);
  if (!queue || queue.length === 0) return;

  processingFiles.add(filePath);

  while (queue.length > 0) {
    const { data, resolve, reject } = queue.shift()!;
    try {
      soilAiDebug("Processing data:", data);
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

      await writeToFile(fileData.filePath, modifiedFileContents);

      resolve({ success: true });
    } catch (error) {
      if (error instanceof Error) {
        reject({ success: false, error: error.message });
      }
    }
  }

  processingFiles.delete(filePath);
};

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(`Soil server: ${req.method} ${req.url}`);

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

  const apiKey = process.env.SOILAI_API_KEY;
  if (!apiKey) throw Error("SOILAI_API_KEY is not defined in .env.development");

  const responseStatus = getResponseEnd(res);

  if (req.method === "GET" && req.url === "/") {
    return responseStatus()();
  }

  if (req.method === "OPTIONS") return responseStatus(204)();

  if (req.method !== "POST" || req.url !== "/")
    return responseStatus(404)({ success: false, error: "Not found" });

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const { message, soilId, pathname }: InitialMessage = JSON.parse(body);
      if (typeof message !== "string") throw Error("Message is required");

      if (!soilId || (typeof soilId !== "string" && pathname)) {
        const newSoilId = uuidv4();

        const newFileContents = getNewNextFile(newSoilId);

        const newFilePath = `./app${pathname}/page.tsx`;

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
        if (!modifiedNewFileContents.includes(`data-soil-id="${newSoilId}"`)) {
          throw new Error("Error: soilId not found in modified file contents");
        }

        await writeToFile(newFilePath, modifiedNewFileContents);
      } else {
        const fileData = await findFileWithSoilId(soilId);
        if (!fileData) throw Error("File with Soil ID not found");

        const filePath = fileData.filePath;

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
        queuePromise.then(responseStatus()).catch(responseStatus(400));
      }
    } catch (error) {
      if (error instanceof Error)
        return responseStatus(400)({ success: false, error: error.message });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Soil dev server is listening on port ${PORT}`);
});
