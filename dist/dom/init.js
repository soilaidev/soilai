"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSoilAi = initializeSoilAi;
const add_1 = require("./add");
function initializeSoilAi() {
    function eventListener(event) {
        console.log("Soil click event:", event);
        const target = event.target;
        // Traverse up the DOM tree to find the closest element with data-soil-id
        const soilElement = target.closest("[data-soil-id]");
        if (soilElement) {
            const soilId = soilElement.getAttribute("data-soil-id");
            if (soilId)
                (0, add_1.addForm)(soilElement, soilId);
        }
    }
    document.addEventListener("click", eventListener);
    function removeClickListener() {
        document.removeEventListener("click", eventListener);
        console.log("Click listener removed.");
    }
    return removeClickListener;
}
