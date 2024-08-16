#!/usr/bin/env node

import debug from "debug";
import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { PORT } from "../constants";
import { postToSoilAi } from "./soilai-request";
import { findFileWithSoilId, writeFile } from "./find-file";

const soilAiDebug = debug("soilai");

const requestQueue = [];

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(`Soil server: ${req.method} ${req.url}`);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

  if (req.method === "GET") {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST" || req.url !== "/") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Not found" }));
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);
      soilAiDebug("Received data:", data);
      if (typeof data.soilId !== "string" || typeof data.message !== "string") throw Error("Invalid data format");

      const fileData = await findFileWithSoilId(data.soilId);
      if (!fileData) throw Error("File with Soil ID not found");

      const { modifiedFileContents } = await postToSoilAi({ ...fileData, message: data.message });
      if (!modifiedFileContents.includes(`data-soil-id="${data.soilId}"`)) {
        throw Error("Error: soilId not found in modified file contents");
      }

      await writeFile(fileData.filePath, modifiedFileContents);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      if (error instanceof Error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Soil dev server is listening on port ${PORT}`);
});
