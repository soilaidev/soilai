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
const debug_1 = __importDefault(require("debug"));
const http_1 = require("http");
const constants_1 = require("../constants");
const soilai_request_1 = require("./soilai-request");
const find_file_1 = require("./find-file");
const soilAiDebug = (0, debug_1.default)("soilai");
const server = (0, http_1.createServer)((req, res) => {
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
    req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = JSON.parse(body);
            soilAiDebug("Received data:", data);
            if (typeof data.soilId !== "string" || typeof data.message !== "string")
                throw Error("Invalid data format");
            const fileData = yield (0, find_file_1.findFileWithSoilId)(data.soilId);
            if (!fileData)
                throw Error("File with Soil ID not found");
            const { modifiedFileContents } = yield (0, soilai_request_1.postToSoilAi)(Object.assign(Object.assign({}, fileData), { message: data.message }));
            if (!modifiedFileContents.includes(`data-soil-id="${data.soilId}"`)) {
                throw Error("Error: soilId not found in modified file contents");
            }
            yield (0, find_file_1.writeFile)(fileData.filePath, modifiedFileContents);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true }));
        }
        catch (error) {
            if (error instanceof Error) {
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: false, error: error.message }));
            }
        }
    }));
});
server.listen(constants_1.PORT, () => {
    console.log(`Soil dev server is listening on port ${constants_1.PORT}`);
});
