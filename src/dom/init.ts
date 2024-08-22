import { FORM_CONTAINER_ID } from "../constants";
import { addForm } from "./add";
import { status } from "../api";
import { toast } from "./toast";
import { SoilAiSettings } from "../types";
import { createToggle } from "./toggle";

const soilAiSettings: SoilAiSettings = {};

export function initializeSoilAi(env: "js" | "react" = "js") {
  function eventListener(event: MouseEvent) {
    if (
      document.getElementById(FORM_CONTAINER_ID) ||
      localStorage.getItem("soilAiEnabled") === "false"
    ) {
      return;
    }

    const target = event.target as HTMLElement;

    // Traverse up the DOM tree to find the closest element with data-soil-id
    const soilElement = target.closest("[data-soil-id]") as HTMLElement | null;

    if (soilElement) {
      const soilId = soilElement.getAttribute("data-soil-id");
      if (soilId) {
        soilAiSettings.removeAll = addForm(soilElement, soilId, env);
      }
    }
  }

  status().then((isServerRunning: boolean) => {
    if (!isServerRunning) return toast("Soil AI server is not running", true);

    createToggle(soilAiSettings);

    document.addEventListener("click", eventListener);
  });

  function removeClickListener() {
    document.removeEventListener("click", eventListener);
  }

  return removeClickListener;
}
