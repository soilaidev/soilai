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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const constants_1 = require("../constants");
const LOCAL_SOIL_SERVER = `http://localhost:${constants_1.PORT}/`;
function sendMessage(soilId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(LOCAL_SOIL_SERVER, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ soilId, message }),
            });
            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }
            return response.json();
        }
        catch (error) {
            console.error("Error posting to server:", error);
        }
        return null;
    });
}
