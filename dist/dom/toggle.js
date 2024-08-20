"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToggle = createToggle;
const constants_1 = require("../constants");
const create_element_1 = require("./create-element");
function createToggle(settings) {
    const container = (0, create_element_1.createStyledElement)("div", {
        position: "fixed",
        bottom: "15px",
        right: "15px",
    }, { id: constants_1.TOGGLE_CONTAINER_ID });
    const checkbox = (0, create_element_1.createStyledElement)("input", {}, { type: "checkbox", id: "soilAiCheckbox", alt: "Soil AI" });
    checkbox.addEventListener("change", () => {
        var _a, _b;
        settings.enabled = checkbox.checked;
        if (!checkbox.checked) {
            (_a = document.getElementById(constants_1.FORM_CONTAINER_ID)) === null || _a === void 0 ? void 0 : _a.remove();
            (_b = document.getElementById(constants_1.BACKGROUND_ID)) === null || _b === void 0 ? void 0 : _b.remove();
        }
    });
    const label = (0, create_element_1.createStyledElement)("label", { marginRight: "5px" }, { htmlFor: "soilAiCheckbox", textContent: "Soil AI" });
    container.appendChild(label);
    container.appendChild(checkbox);
    document.body.appendChild(container);
}
