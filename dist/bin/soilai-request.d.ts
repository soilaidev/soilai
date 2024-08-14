#!/usr/bin/env node
import { SoilAiPayload, SoilAiResponse } from "../types";
export declare function postToSoilAi(payload: SoilAiPayload): Promise<SoilAiResponse>;
