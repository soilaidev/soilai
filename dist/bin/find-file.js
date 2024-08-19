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
exports.findFileWithSoilId = findFileWithSoilId;
exports.writeToFile = writeToFile;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const util_1 = require("util");
const ignore_1 = __importDefault(require("ignore"));
const readFile = (0, util_1.promisify)(fs_1.default.readFile);
const readdir = (0, util_1.promisify)(fs_1.default.readdir);
const mkdir = (0, util_1.promisify)(fs_1.default.mkdir);
const writeFile = (0, util_1.promisify)(fs_1.default.writeFile);
function getGitIgnore(rootDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const gitIgnorePath = path_1.default.join(rootDir, ".gitignore");
        try {
            const gitIgnoreContent = yield readFile(gitIgnorePath, "utf8");
            const ignorePatterns = gitIgnoreContent
                .split("\n")
                .filter((line) => line.trim() !== "");
            return (0, ignore_1.default)().add(["./README.md", "./readme.md", ...ignorePatterns]);
        }
        catch (error) {
            console.error(error);
            console.warn("No .gitignore file found.");
            return null;
        }
    });
}
function findFileWithSoilIdRecursive(directory, soilId, ig) {
    return __awaiter(this, void 0, void 0, function* () {
        const files = yield readdir(directory);
        for (const file of files) {
            const filePath = path_1.default.join(directory, file);
            if (ig === null || ig === void 0 ? void 0 : ig.ignores(path_1.default.relative(directory, filePath)))
                continue;
            const fileStat = fs_1.default.statSync(filePath);
            if (fileStat.isFile()) {
                const fileContents = fs_1.default.readFileSync(filePath, "utf-8");
                if (fileContents.includes(`data-soil-id="${soilId}"`)) {
                    return { soilId, fileContents, filePath, fileExt: path_1.default.extname(file) };
                }
            }
            else if (fileStat.isDirectory()) {
                const result = yield findFileWithSoilIdRecursive(filePath, soilId, ig);
                if (result)
                    return result;
            }
        }
        return null;
    });
}
/** Example usage:
```ts
const fileContents = await findFileWithSoilId("unique-soil-id");
```
*/
function findFileWithSoilId(soilId) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentDirectory = process.cwd();
        const ig = yield getGitIgnore(currentDirectory);
        return findFileWithSoilIdRecursive(currentDirectory, soilId, ig);
    });
}
function writeToFile(filePath, contents) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dir = path_1.default.dirname(filePath);
            yield mkdir(dir, { recursive: true });
            yield writeFile(filePath, contents);
            console.log(`Successfully wrote contents to ${filePath}`);
        }
        catch (error) {
            console.error(`Error writing contents to ${filePath}:`, error);
        }
    });
}
