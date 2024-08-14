import path from "path";
import prettier from "prettier";

// Map of file extensions to Prettier parsers
const parserMap = new Map<string, prettier.BuiltInParserName>([
  ["ts", "typescript"],
  ["tsx", "babel-ts"],
  ["js", "babel"],
  ["jsx", "babel"],
  ["html", "html"],
  ["css", "css"],
]);

export async function formatCodeWithPrettier(filePath: string, code: string) {
  const configFile = await prettier.resolveConfigFile(filePath);

  const options = (configFile && (await prettier.resolveConfig(configFile))) || {};

  const extension = path.extname(filePath);
  const parser = parserMap.get(extension);

  return prettier.format(code, parser ? { ...options, parser } : options);
}
