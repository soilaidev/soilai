"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStyledElement = createStyledElement;
function createStyledElement(elementType, styles, attributes = {}) {
    const element = document.createElement(elementType);
    // Apply styles
    Object.assign(element.style, styles);
    // Apply attributes
    Object.assign(element, attributes);
    return element;
}
