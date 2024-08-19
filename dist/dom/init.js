"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSoilAi = initializeSoilAi;
const constants_1 = require("../constants");
const add_1 = require("./add");
const api_1 = require("../api");
const toast_1 = require("./toast");
function initializeSoilAi(env = "js") {
    function eventListener(event) {
        if (document.getElementById(constants_1.CONTAINER_ID))
            return;
        const target = event.target;
        // Traverse up the DOM tree to find the closest element with data-soil-id
        const soilElement = target.closest("[data-soil-id]");
        if (soilElement) {
            const soilId = soilElement.getAttribute("data-soil-id");
            if (soilId)
                (0, add_1.addForm)(soilElement, soilId, env);
        }
    }
    (0, api_1.status)().then((isServerRunning) => {
        if (!isServerRunning)
            return (0, toast_1.toast)("Soil AI server is not running", true);
        document.addEventListener("click", eventListener);
    });
    function removeClickListener() {
        document.removeEventListener("click", eventListener);
    }
    return removeClickListener;
}
