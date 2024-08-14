"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addForm = addForm;
const send_1 = require("./send");
function addBorder(element) {
    // Save original styles
    const originalStyle = {
        border: element.style.border,
        boxShadow: element.style.boxShadow,
        transform: element.style.transform,
        transition: element.style.transition,
    };
    // Set new styles
    element.style.border = "2px dashed black";
    element.style.transition = "transform 0.2s ease, box-shadow 0.2s ease";
    element.style.transform = "translateY(-3px)";
    element.style.boxShadow = "0px 10px 10px rgba(0, 0, 0, 0.3)";
    // Remove the border after a short delay (e.g., 1 second)
    return function removeBorder() {
        element.style.border = originalStyle.border;
        element.style.boxShadow = originalStyle.boxShadow;
        element.style.transform = originalStyle.transform;
        element.style.transition = originalStyle.transition;
    };
}
function addForm(element, soilId) {
    const removeBorder = addBorder(element);
    // CONTAINER
    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.zIndex = "999";
    container.style.backgroundColor = "#fff";
    container.style.padding = "5px";
    container.style.borderRadius = "5px";
    container.style.margin = "5px";
    // INPUT
    const input = document.createElement("input");
    input.style.padding = "5px";
    input.style.border = "1px solid #ccc";
    input.style.borderRadius = "3px";
    input.style.marginRight = "3px";
    input.type = "text";
    input.autofocus = true;
    input.placeholder = "Enter change...";
    // BUTTON
    const button = document.createElement("button");
    button.style.backgroundColor = "#fff";
    button.style.padding = "5px";
    button.style.border = "1px solid #ccc";
    button.style.borderRadius = "3px";
    button.type = "submit";
    button.textContent = "Send";
    // BACKGROUND
    const background = document.createElement("div");
    background.style.position = "absolute";
    background.style.zIndex = "998";
    background.style.top = "0px";
    background.style.right = "0px";
    background.style.bottom = "0px";
    background.style.left = "0px";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    function removeAll() {
        removeBorder();
        container.remove();
        background.remove();
    }
    // FORM
    const form = document.createElement("form");
    form.onsubmit = function (event) {
        event.preventDefault();
        (0, send_1.sendMessage)(soilId, input.value)
            .then((d) => {
            console.log(d);
            removeAll();
        })
            .catch(console.error);
    };
    background.onclick = removeAll;
    // Position the container
    const elementRect = element.getBoundingClientRect();
    const bodyRect = document.body.getBoundingClientRect();
    // Determine available space around the element
    const spaceAbove = elementRect.top - bodyRect.top;
    const spaceBelow = bodyRect.bottom - elementRect.bottom;
    const spaceLeft = elementRect.left - bodyRect.left;
    const spaceRight = bodyRect.right - elementRect.right;
    // Position the input based on available space
    if (spaceBelow > 30) {
        // Place below if there is room
        container.style.top = `${elementRect.bottom + window.scrollY}px`;
        container.style.left = `${elementRect.left + window.scrollX}px`;
    }
    else if (spaceAbove > 30) {
        // Place above if there is room
        container.style.top = `${elementRect.top - 30 + window.scrollY}px`;
        container.style.left = `${elementRect.left + window.scrollX}px`;
    }
    else if (spaceRight > 150) {
        // Place to the right if there is room
        container.style.top = `${elementRect.top + window.scrollY}px`;
        container.style.left = `${elementRect.right + 10 + window.scrollX}px`;
    }
    else if (spaceLeft > 150) {
        // Place to the left if there is room
        container.style.top = `${elementRect.top + window.scrollY}px`;
        container.style.left = `${elementRect.left - 150 + window.scrollX}px`;
    }
    else {
        // Default position below the element if no other space is available
        container.style.top = `${elementRect.bottom + window.scrollY}px`;
        container.style.left = `${elementRect.left + window.scrollX}px`;
    }
    form.appendChild(input);
    form.appendChild(button);
    container.appendChild(form);
    document.body.appendChild(background);
    document.body.appendChild(container);
    setTimeout(() => input.focus());
}
