import { addForm } from "./add";

export function initializeSoilAi() {
  function eventListener(event: MouseEvent) {
    console.log("Click listener added.");
    const target = event.target as HTMLElement;

    const soilId = target.getAttribute("data-soil-id");

    if (soilId) addForm(target, soilId);
  }

  document.addEventListener("click", eventListener);

  function removeClickListener() {
    document.removeEventListener("click", eventListener);
    console.log("Click listener removed.");
  }
  return removeClickListener;
}
