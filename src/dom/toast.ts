import { createStyledElement } from "./create-element";

export function toast(message: string) {
  const toast = createStyledElement(
    "div",
    {
      position: "fixed",
      bottom: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      backgroundColor: "#333",
      color: "#fff",
      padding: "10px 20px",
      borderRadius: "5px",
      boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
      opacity: "0",
      transition: "opacity 0.5s, bottom 0.5s",
      width: "220px",
      maxWidth: "100%",
    },
    { textContent: message }
  );

  // Append the toast to the body
  document.body.appendChild(toast);

  // Animate in
  setTimeout(() => {
    toast.style.opacity = "1";
    toast.style.bottom = "30px";
  }, 10);

  // Animate out after 3 seconds
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.bottom = "20px";

    // Remove the toast from the DOM after the animation
    setTimeout(() => {
      toast.remove();
    }, 500); // match the transition duration
  }, 3000);
}
