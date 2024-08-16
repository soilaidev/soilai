export type InitialMessage = {
    message: string;
    soilId: string;
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
