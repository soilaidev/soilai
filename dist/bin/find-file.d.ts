#!/usr/bin/env node
import { SoilAiPayload } from "../types";
/** Example usage:
```ts
const fileContents = await findFileWithSoilId("unique-soil-id");
```
*/
export declare function findFileWithSoilId(soilId: string): Promise<Omit<SoilAiPayload, "message"> | null>;
export declare function writeToFile(filePath: string, contents: string): Promise<void>;
