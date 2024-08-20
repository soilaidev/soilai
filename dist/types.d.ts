export type InitialMessage = {
    message: string;
    env: "js" | "react" | "react-native";
    soilId?: string;
    pathname?: string;
};
export type SoilAiPayload = {
    message: string;
    fileContents: string;
    filePath: string;
    fileExt: string;
    soilId: string;
};
export type SoilAiResponse = {
    modifiedFileContents: string;
};
export type SoilAiSettings = {
    enabled: boolean;
};
