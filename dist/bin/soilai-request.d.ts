#!/usr/bin/env node
import { SoilAiPayload, SoilAiResponse } from "../types";
export declare function postToSoilAi(payload: SoilAiPayload, apiKey: string): Promise<SoilAiResponse>;
