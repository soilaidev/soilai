import { InitialMessage } from "../types";
export declare function sendMessage(payload: InitialMessage): Promise<object | null>;
export declare function status(): Promise<boolean>;
