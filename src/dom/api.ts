import { PORT } from "../constants";

const LOCAL_SOIL_SERVER = `http://localhost:${PORT}/`;

export function sendMessage(soilId: string, message: string): Promise<object | null> {
  return fetch(LOCAL_SOIL_SERVER, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ soilId, message }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      return response.json();
    })
    .catch((error) => {
      console.error("Error posting to server:", error);

      return null;
    });
}

export function status(): Promise<boolean> {
  return fetch(LOCAL_SOIL_SERVER, { method: "GET" })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }

      return true;
    })
    .catch((error) => {
      console.error("Error posting to server:", error);

      return false;
    });
}
