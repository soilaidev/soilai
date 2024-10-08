"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.status = status;
const constants_1 = require("../constants");
const LOCAL_SOIL_SERVER = `http://localhost:${constants_1.PORT}/`;
function sendMessage(payload) {
    return fetch(LOCAL_SOIL_SERVER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    })
        .then((response) => {
        if (!response.ok)
            throw Error(`Server responded with status ${response.status}`);
        return response.json();
    })
        .catch((error) => {
        console.error("Error posting to server:", error);
        return null;
    });
}
function status() {
    return fetch(LOCAL_SOIL_SERVER, { method: "GET" })
        .then((response) => {
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        return true;
    })
        .catch((error) => {
        console.error("Error posting to server:", error);
        return false;
    });
}
