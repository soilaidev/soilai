#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postToSoilAi = postToSoilAi;
const https = __importStar(require("https"));
const url_1 = require("url");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: `.env.development` });
const SOIL_SERVER = "https://soilai.dev/api/package";
function postToSoilAi(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.SOILAI_API_KEY;
        if (!apiKey)
            throw Error("SOILAI_API_KEY is not defined in .env.development");
        const url = new url_1.URL(`${SOIL_SERVER}?apiKey=${apiKey}`);
        const data = JSON.stringify(payload);
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Content-Length": Buffer.byteLength(data),
            },
        };
        return new Promise((resolve, reject) => {
            const req = https.request(url, options, (res) => {
                let responseData = "";
                res.on("data", (chunk) => {
                    responseData += chunk;
                });
                res.on("end", () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
                        console.log("Response from API:", responseData);
                        resolve(JSON.parse(responseData));
                    }
                    else {
                        reject(new Error(`Request failed with status code ${res.statusCode}: ${responseData}`));
                    }
                });
            });
            req.on("error", (error) => {
                reject(new Error(`Error making request: ${error.message}`));
            });
            // Write the request body
            req.write(data);
            req.end();
        });
    });
}
