#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const http_1 = require("http");
const constants_1 = require("../constants");
const soilai_request_1 = require("./soilai-request");
const find_file_1 = require("./find-file");
const uuid_1 = require("uuid");
const new_page_1 = require("./new-page");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.development` });
const soilAiDebug = ((_a = process.env.DEBUG) === null || _a === void 0 ? void 0 : _a.includes("soilai"))
    ? (message, data) => {
        console.log(message, data);
    }
    : () => { };
const requestQueue = new Map();
const processingFiles = new Set();
function getResponseEnd(res) {
    return function responseStatus(status = 200) {
        soilAiDebug(`Setting response status: ${status}`);
        res.writeHead(status);
        return function responseEnd(data) {
            soilAiDebug(`Ending response with data: ${data ? JSON.stringify(data) : "No data"}`);
            if (!res.headersSent)
                res.writeHead(status);
            res.end(data ? JSON.stringify(data) : undefined);
            return res;
        };
    };
}
const processQueue = (filePath, apiKey) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { data, resolve, reject } = queue.shift();
        try {
            soilAiDebug("Processing data:", data);
            const fileData = yield (0, find_file_1.findFileWithSoilId)(data.soilId);
            if (!fileData)
                throw new Error("File with Soil ID not found");
            soilAiDebug(`Posting to SoilAI with data: ${JSON.stringify(data)}`);
            const { modifiedFileContents } = yield (0, soilai_request_1.postToSoilAi)(Object.assign(Object.assign({}, fileData), { message: data.message }), apiKey);
            if (!modifiedFileContents.includes(`data-soil-id="${data.soilId}"`)) {
                throw new Error("Error: soilId not found in modified file contents");
            }
            soilAiDebug(`Writing modified contents to file: ${fileData.filePath}`);
            yield (0, find_file_1.writeToFile)(fileData.filePath, modifiedFileContents);
            return resolve({ success: true });
        }
        catch (error) {
            soilAiDebug(`Error processing queue for file: ${filePath}`, error);
            if (error instanceof Error) {
                return reject({ success: false, error: error.message });
            }
        }
    }
    soilAiDebug(`Finished processing queue for file: ${filePath}`);
    processingFiles.delete(filePath);
});
const server = (0, http_1.createServer)((req, res) => {
    soilAiDebug(`Soil server: ${req.method} ${req.url}`);
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
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
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        soilAiDebug("Request data fully received");
        try {
            const { message, soilId, pathname } = JSON.parse(body);
            soilAiDebug("Parsed request body:", { message, soilId, pathname });
            if (typeof message !== "string") {
                soilAiDebug("Message is required and must be a string");
                throw Error("Message is required");
            }
            if (!soilId || (typeof soilId !== "string" && pathname)) {
                soilAiDebug("Creating new Soil ID and file");
                const newSoilId = (0, uuid_1.v4)();
                const newFileContents = (0, new_page_1.getNewNextFile)(newSoilId);
                const newFilePath = `./app${pathname}/page.tsx`;
                soilAiDebug(`Posting to SoilAI for new file: ${newFilePath}`);
                const { modifiedFileContents: modifiedNewFileContents } = yield (0, soilai_request_1.postToSoilAi)({
                    message,
                    fileContents: newFileContents,
                    filePath: newFilePath,
                    fileExt: "tsx",
                    soilId: newSoilId,
                }, apiKey);
                if (!modifiedNewFileContents.includes(`data-soil-id="${newSoilId}"`)) {
                    soilAiDebug("Error: soilId not found in modified file contents");
                    throw new Error("Error: soilId not found in modified file contents");
                }
                soilAiDebug(`Writing new file to path: ${newFilePath}`);
                yield (0, find_file_1.writeToFile)(newFilePath, modifiedNewFileContents);
            }
            else {
                soilAiDebug(`Adding request to queue for Soil ID: ${soilId}`);
                const fileData = yield (0, find_file_1.findFileWithSoilId)(soilId);
                if (!fileData) {
                    soilAiDebug("File with Soil ID not found");
                    throw Error("File with Soil ID not found");
                }
                const filePath = fileData.filePath;
                // Create a new promise to handle the response
                const queuePromise = new Promise((resolve, reject) => {
                    // Add request to the queue
                    if (!requestQueue.has(filePath)) {
                        requestQueue.set(filePath, []);
                    }
                    requestQueue
                        .get(filePath)
                        .push({ data: Object.assign(Object.assign({}, fileData), { message }), resolve, reject });
                    // Start processing the queue
                    processQueue(filePath, apiKey);
                });
                // Send the response when the queue promise resolves or rejects
                queuePromise.then(responseStatus()).catch((error) => {
                    soilAiDebug("Error resolving queue promise:", error);
                    responseStatus(400)(error);
                });
            }
        }
        catch (error) {
            soilAiDebug("Error in request handling:", error);
            if (error instanceof Error)
                return responseStatus(400)({ success: false, error: error.message });
        }
    }));
});
server.listen(constants_1.PORT, () => {
    soilAiDebug(`Soil dev server is listening on port ${constants_1.PORT}`);
});
