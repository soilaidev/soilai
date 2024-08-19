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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//@ts-check
const debug_1 = __importDefault(require("debug"));
const http_1 = require("http");
const constants_1 = require("../constants");
const soilai_request_1 = require("./soilai-request");
const find_file_1 = require("./find-file");
const uuid_1 = require("uuid");
const new_page_1 = require("./new-page");
const soilAiDebug = (0, debug_1.default)("soilai");
const requestQueue = new Map();
const processingFiles = new Set();
function getResponseEnd(res) {
    return function responseStatus(status = 200) {
        res.writeHead(status, { "Content-Type": "application/json" });
        return function responseEnd(data) {
            res.end(data ? JSON.stringify(data) : undefined);
            return res;
        };
    };
}
const processQueue = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    if (processingFiles.has(filePath))
        return;
    const queue = requestQueue.get(filePath);
    if (!queue || queue.length === 0)
        return;
    processingFiles.add(filePath);
    while (queue.length > 0) {
        const { data, resolve, reject } = queue.shift();
        try {
            soilAiDebug("Processing data:", data);
            const fileData = yield (0, find_file_1.findFileWithSoilId)(data.soilId);
            if (!fileData)
                throw new Error("File with Soil ID not found");
            const { modifiedFileContents } = yield (0, soilai_request_1.postToSoilAi)(Object.assign(Object.assign({}, fileData), { message: data.message }));
            if (!modifiedFileContents.includes(`data-soil-id="${data.soilId}"`)) {
                throw new Error("Error: soilId not found in modified file contents");
            }
            yield (0, find_file_1.writeFile)(fileData.filePath, modifiedFileContents);
            resolve({ success: true });
        }
        catch (error) {
            if (error instanceof Error) {
                reject({ success: false, error: error.message });
            }
        }
    }
    processingFiles.delete(filePath);
});
const server = (0, http_1.createServer)((req, res) => {
    console.log(`Soil server: ${req.method} ${req.url}`);
    // Set CORS headers
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");
    const responseStatus = getResponseEnd(res);
    if (req.method === "GET")
        return responseStatus()();
    if (req.method === "OPTIONS")
        return responseStatus(204)();
    if (req.method !== "POST" || req.url !== "/")
        return responseStatus(404)({ success: false, error: "Not found" });
    let body = "";
    req.on("data", (chunk) => {
        body += chunk.toString();
    });
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { message, soilId, pathname } = JSON.parse(body);
            if (typeof message !== "string")
                throw Error("Message is required");
            if (!soilId || (typeof soilId !== "string" && pathname)) {
                const newSoilId = (0, uuid_1.v4)();
                const newFileContents = (0, new_page_1.getNewNextFile)(newSoilId);
                const newFilePath = `/app${pathname}/page.tsx`;
                const { modifiedFileContents: modifiedNewFileContents } = yield (0, soilai_request_1.postToSoilAi)({
                    message,
                    fileContents: newFileContents,
                    filePath: newFilePath,
                    fileExt: "tsx",
                    soilId: newSoilId,
                });
                if (!modifiedNewFileContents.includes(`data-soil-id="${newSoilId}"`)) {
                    throw new Error("Error: soilId not found in modified file contents");
                }
                yield (0, find_file_1.writeFile)(newFilePath, modifiedNewFileContents);
            }
            else {
                const fileData = yield (0, find_file_1.findFileWithSoilId)(soilId);
                if (!fileData)
                    throw Error("File with Soil ID not found");
                const filePath = fileData.filePath;
                // Create a new promise to handle the response
                const queuePromise = new Promise((resolve, reject) => {
                    // Add request to the queue
                    if (!requestQueue.has(filePath)) {
                        requestQueue.set(filePath, []);
                    }
                    requestQueue.get(filePath).push({ data: Object.assign(Object.assign({}, fileData), { message }), resolve, reject });
                    // Start processing the queue
                    processQueue(filePath);
                });
                // Send the response when the queue promise resolves or rejects
                queuePromise.then(responseStatus()).catch(responseStatus(400));
            }
        }
        catch (error) {
            if (error instanceof Error)
                return responseStatus(400)({ success: false, error: error.message });
        }
    }));
});
server.listen(constants_1.PORT, () => {
    console.log(`Soil dev server is listening on port ${constants_1.PORT}`);
});
