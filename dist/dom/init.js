"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSoilAi = initializeSoilAi;
const add_1 = require("./add");
function initializeSoilAi() {
    function eventListener(event) {
        console.log("Click listener added.");
        const target = event.target;
        const soilId = target.getAttribute("data-soil-id");
        if (soilId)
            (0, add_1.addForm)(target, soilId);
    }
    document.addEventListener("click", eventListener);
    function removeClickListener() {
        document.removeEventListener("click", eventListener);
        console.log("Click listener removed.");
    }
    return removeClickListener;
}
