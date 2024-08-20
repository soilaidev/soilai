export function getNewNextFile(soilId: string) {
  return `export default function Page() {
  return (
    <div 
      data-soil-id="${soilId}" 
      className="text-black dark:text-white flex flex-col items-center justify-center min-h-screen p-4"
    >
      <h1>New Page Contents</h1>
    </div>
  );
}
`;
}

export function getNewReactNativeFile(soilId: string) {
  return `import { View, Text, StyleSheet } from "react-native";
import { TouchableSoilAiScreen } from "soil-react-native";

export default function Screen() {
  return (
    <TouchableSoilAiScreen soilId="${soilId}">
      <Text>New Page Contents</Text>
    </TouchableSoilAiScreen>
  );
}
`;
}
