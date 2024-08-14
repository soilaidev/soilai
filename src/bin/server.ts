import { createServer, type IncomingMessage, type ServerResponse } from "http";
import { PORT } from "../constants";
import { postToSoilAi } from "./soilai-request";
import { findFileWithSoilId, writeFile } from "./find-file";

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  if (req.method !== "POST" || req.url !== "/") {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ success: false, error: "Not found" }));
  }

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const data = JSON.parse(body);

      if (typeof data.soilId !== "string" || typeof data.message !== "string") throw Error("Invalid data format");

      const fileData = await findFileWithSoilId(data.soilId);
      if (!fileData) throw Error("File with Soil ID not found");

      const { modifiedFileContents } = await postToSoilAi({ ...fileData, message: data.message });
      if (!modifiedFileContents.includes(`data-soil-id="${data.soilId}"`)) {
        throw Error("Error: soilId not found in modified file contents");
      }

      await writeFile(fileData.filePath, modifiedFileContents);

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      if (error instanceof Error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ success: false, error: error.message }));
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`Soil dev server is listening on port ${PORT}`);
});
