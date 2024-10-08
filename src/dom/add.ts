import { BACKGROUND_ID, FORM_CONTAINER_ID } from "../constants";
import { createStyledElement } from "./create-element";
import { sendMessage } from "../api";
import { SendIcon } from "./send-icon";
import { toast } from "./toast";

// const darkMode = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;

function addBorder(element: HTMLElement) {
  // Save original styles
  const originalStyle = {
    border: element.style.border,
  };

  // Set new styles
  // element.style.border = "2px dashed black";
  element.style.border = "2px dashed #aaa";

  // Remove the border after a short delay (e.g., 1 second)
  return function removeBorder() {
    element.style.border = originalStyle.border;
  };
}

export function addForm(
  element: HTMLElement,
  soilId: string,
  env: "js" | "react" = "js",
  demo?: { inputId: string }
) {
  const removeBorder = addBorder(element);

  const input = createStyledElement(
    "input",
    {
      color: "#333",
      boxSizing: "content-box",
      padding: "7px",
      border: "1px solid #ccc",
      borderRadius: "3px",
      marginRight: "3px",
      height: "19px",
      flex: "1",
    },
    { type: "text", autofocus: true, placeholder: "Describe your change..." }
  );

  if (demo) input.value = demo.inputId;

  const button = createStyledElement(
    "button",
    {
      boxSizing: "content-box",
      padding: "2px 0px 4px 0px",
    },
    { type: "submit", innerHTML: SendIcon }
  );

  // Position the container
  const elementRect = element.getBoundingClientRect();
  const bodyRect = document.body.getBoundingClientRect();

  // Determine available space around the element
  const spaceAbove = elementRect.top - bodyRect.top;
  const spaceBelow = bodyRect.bottom - elementRect.bottom;
  const spaceLeft = elementRect.left - bodyRect.left;
  const spaceRight = bodyRect.right - elementRect.right;

  let top: string, left: string;

  // Position the input based on available space
  if (spaceBelow > 30) {
    // Place below if there is room
    top = `${elementRect.bottom + window.scrollY}px`;
    left = `${elementRect.left + window.scrollX}px`;
  } else if (spaceAbove > 30) {
    // Place above if there is room
    top = `${elementRect.top - 30 + window.scrollY}px`;
    left = `${elementRect.left + window.scrollX}px`;
  } else if (spaceRight > 150) {
    // Place to the right if there is room
    top = `${elementRect.top + window.scrollY}px`;
    left = `${elementRect.right + 10 + window.scrollX}px`;
  } else if (spaceLeft > 150) {
    // Place to the left if there is room
    top = `${elementRect.top + window.scrollY}px`;
    left = `${elementRect.left - 150 + window.scrollX}px`;
  } else {
    // Default position below the element if no other space is available
    top = `${elementRect.bottom + window.scrollY}px`;
    left = `${elementRect.left + window.scrollX}px`;
  }

  const container = createStyledElement(
    "div",
    {
      position: "absolute",
      zIndex: "999",
      backgroundColor: "#fff",
      padding: "5px",
      borderRadius: "5px",
      margin: "5px",
      border: "1px solid #ccc",
      boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.4)",
      width: "300px",
      maxWidth: "100%",
      top,
      left,
    },
    { id: FORM_CONTAINER_ID }
  );

  const background = createStyledElement(
    "div",
    {
      position: "absolute",
      zIndex: "998",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
      // backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    { id: BACKGROUND_ID }
  );

  function removeAll() {
    removeBorder();
    container.remove();
    background.remove();
  }

  background.onclick = removeAll;

  const form = createStyledElement(
    "form",
    {
      display: "flex",
    },
    {
      onsubmit: function (event) {
        event.preventDefault();

        if (!demo) {
          sendMessage({ soilId, message: input.value, env })
            .then(() => toast("Harvest time!"))
            .catch((e: Error) => toast(e.message));
        }

        setTimeout(() => {
          removeAll();
          toast("Planting in rich soil...");
        }, 500);
      },
    }
  );

  form.appendChild(input);
  form.appendChild(button);
  container.appendChild(form);

  document.body.appendChild(background);
  document.body.appendChild(container);

  setTimeout(() => input.focus());

  return removeAll;
}
