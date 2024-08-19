import { CONTAINER_ID } from "../constants";
import { addForm } from "./add";
import { status } from "../api";
import { toast } from "./toast";

export function initializeSoilAi(env: "js" | "react" = "js") {
  function eventListener(event: MouseEvent) {
    if (document.getElementById(CONTAINER_ID)) return;

    const target = event.target as HTMLElement;

    // Traverse up the DOM tree to find the closest element with data-soil-id
    const soilElement = target.closest("[data-soil-id]") as HTMLElement | null;

    if (soilElement) {
      const soilId = soilElement.getAttribute("data-soil-id");
      if (soilId) addForm(soilElement, soilId, env);
    }
  }

  status().then((isServerRunning: boolean) => {
    if (!isServerRunning) return toast("Soil AI server is not running", true);

    document.addEventListener("click", eventListener);
  });

  function removeClickListener() {
    document.removeEventListener("click", eventListener);
  }

  return removeClickListener;
}
