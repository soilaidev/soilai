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
        zIndex: "9999",
        color: "white",
        backgroundColor: "black",
        borderRadius: "5px",
        padding: "6px",
    }, { id: constants_1.TOGGLE_CONTAINER_ID });
    const checkbox = (0, create_element_1.createStyledElement)("input", {}, {
        type: "checkbox",
        id: "soilAiCheckbox",
        alt: "Soil AI",
        checked: settings.enabled,
    });
    checkbox.addEventListener("change", () => {
        var _a;
        settings.enabled = checkbox.checked;
        if (!checkbox.checked)
            (_a = settings.removeAll) === null || _a === void 0 ? void 0 : _a.call(settings);
    });
    const label = (0, create_element_1.createStyledElement)("label", { marginRight: "5px" }, { htmlFor: "soilAiCheckbox", textContent: "Soil AI" });
    container.appendChild(label);
    container.appendChild(checkbox);
    document.body.appendChild(container);
}
