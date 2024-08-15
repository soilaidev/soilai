"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toast = toast;
const create_element_1 = require("./create-element");
function toast(message, error = false) {
    const toast = (0, create_element_1.createStyledElement)("div", {
        position: "fixed",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: error ? "#ff3333" : "#333",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
        opacity: "0",
        transition: "opacity 0.5s, bottom 0.5s",
        width: "fit-content",
        maxWidth: "100%",
    }, { textContent: message });
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.bottom = "30px";
    }, 10);
    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.bottom = "20px";
        setTimeout(() => {
            toast.remove();
        }, 500);
    }, 3000);
}
