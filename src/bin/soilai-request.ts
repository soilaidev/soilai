#!/usr/bin/env node

import * as https from "https";
import { URL } from "url";
import { config } from "dotenv";

// Types
import { SoilAiPayload, SoilAiResponse } from "../types";

config({ path: `.env.development` });

const SOIL_SERVER = "https://soilai.dev/api/package";

export async function postToSoilAi(
  payload: SoilAiPayload,
  apiKey: string
): Promise<SoilAiResponse> {
  const url = new URL(`${SOIL_SERVER}?apiKey=${apiKey}`);
  const data = JSON.stringify(payload);

  const options: https.RequestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(data),
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let responseData = "";

      res.on("data", (chunk) => {
        responseData += chunk;
      });

      res.on("end", () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) {
          resolve(JSON.parse(responseData) as SoilAiResponse);
        } else {
          reject(
            new Error(
              `Request failed with status code ${res.statusCode}: ${responseData}`
            )
          );
        }
      });
    });

    req.on("error", (error) => {
      reject(new Error(`Error making request: ${error.message}`));
    });

    // Write the request body
    req.write(data);
    req.end();
  });
}
