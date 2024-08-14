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
exports.formatCodeWithPrettier = formatCodeWithPrettier;
const path_1 = __importDefault(require("path"));
const prettier_1 = __importDefault(require("prettier"));
// Map of file extensions to Prettier parsers
const parserMap = new Map([
    ["ts", "typescript"],
    ["tsx", "babel-ts"],
    ["js", "babel"],
    ["jsx", "babel"],
    ["html", "html"],
    ["css", "css"],
]);
function formatCodeWithPrettier(filePath, code) {
    return __awaiter(this, void 0, void 0, function* () {
        const configFile = yield prettier_1.default.resolveConfigFile(filePath);
        const options = (configFile && (yield prettier_1.default.resolveConfig(configFile))) || {};
        const extension = path_1.default.extname(filePath);
        const parser = parserMap.get(extension);
        return prettier_1.default.format(code, parser ? Object.assign(Object.assign({}, options), { parser }) : options);
    });
}
