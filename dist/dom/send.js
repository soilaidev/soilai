"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
const constants_1 = require("../constants");
const LOCAL_SOIL_SERVER = `http://localhost:${constants_1.PORT}/`;
function sendMessage(soilId, message) {
    return fetch(LOCAL_SOIL_SERVER, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ soilId, message }),
    })
        .then((response) => {
        if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
        }
        return response.json();
    })
        .catch((error) => {
        console.error("Error posting to server:", error);
        return null;
    });
}
