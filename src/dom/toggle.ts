import {
  BACKGROUND_ID,
  FORM_CONTAINER_ID,
  TOGGLE_CONTAINER_ID,
} from "../constants";
import { SoilAiSettings } from "../types";
import { createStyledElement } from "./create-element";

export function createToggle(settings: SoilAiSettings) {
  const container = createStyledElement(
    "div",
    {
      position: "fixed",
      bottom: "15px",
      right: "15px",
    },
    { id: TOGGLE_CONTAINER_ID }
  );

  const checkbox = createStyledElement(
    "input",
    {},
    {
      type: "checkbox",
      id: "soilAiCheckbox",
      alt: "Soil AI",
      checked: settings.enabled,
    }
  );
  checkbox.addEventListener("change", () => {
    settings.enabled = checkbox.checked;
    if (!checkbox.checked) {
      document.getElementById(FORM_CONTAINER_ID)?.remove();
      document.getElementById(BACKGROUND_ID)?.remove();
    }
  });

  const label = createStyledElement(
    "label",
    { marginRight: "5px" },
    { htmlFor: "soilAiCheckbox", textContent: "Soil AI" }
  );

  container.appendChild(label);
  container.appendChild(checkbox);
  document.body.appendChild(container);
}
