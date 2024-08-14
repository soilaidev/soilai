import { addForm } from "./add";

export function initializeSoilAi() {
  function eventListener(event: MouseEvent) {
    console.log("Soil click event:", event);
    const target = event.target as HTMLElement;

    // Traverse up the DOM tree to find the closest element with data-soil-id
    const soilElement = target.closest("[data-soil-id]") as HTMLElement | null;

    if (soilElement) {
      const soilId = soilElement.getAttribute("data-soil-id");
      if (soilId) addForm(soilElement, soilId);
    }
  }

  document.addEventListener("click", eventListener);

  function removeClickListener() {
    document.removeEventListener("click", eventListener);
    console.log("Click listener removed.");
  }
  return removeClickListener;
}
