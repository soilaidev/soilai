import fs from "fs";
import path from "path";
import { promisify } from "util";
import ignore, { Ignore } from "ignore";
import { SoilAiPayload } from "../types";

const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);

async function getGitIgnore(rootDir: string): Promise<Ignore | null> {
  const gitIgnorePath = path.join(rootDir, ".gitignore");
  try {
    const gitIgnoreContent = await readFile(gitIgnorePath, "utf8");
    const ignorePatterns = gitIgnoreContent.split("\n").filter((line) => line.trim() !== "");

    return ignore().add(["./README.md", "./readme.md", ...ignorePatterns]);
  } catch (error) {
    console.error(error);
    console.warn("No .gitignore file found.");
    return null;
  }
}

async function findFileWithSoilIdRecursive(
  directory: string,
  soilId: string,
  ig: Ignore | null,
): Promise<Omit<SoilAiPayload, "message"> | null> {
  const files = await readdir(directory);

  for (const file of files) {
    const filePath = path.join(directory, file);
    if (ig?.ignores(path.relative(directory, filePath))) continue;

    const fileStat = fs.statSync(filePath);

    if (fileStat.isFile()) {
      const fileContents = fs.readFileSync(filePath, "utf-8");

      if (fileContents.includes(`data-soil-id="${soilId}"`)) {
        return { fileContents, filePath, fileExt: path.extname(file) };
      }
    } else if (fileStat.isDirectory()) {
      const result = await findFileWithSoilIdRecursive(filePath, soilId, ig);

      if (result) return result;
    }
  }

  return null;
}

/** Example usage:
```ts
const fileContents = await findFileWithSoilId("unique-soil-id");
```
*/
export async function findFileWithSoilId(soilId: string) {
  const currentDirectory = process.cwd();

  const ig = await getGitIgnore(currentDirectory);

  return findFileWithSoilIdRecursive(currentDirectory, soilId, ig);
}

export async function writeFile(filePath: string, contents: string): Promise<void> {
  try {
    // const formattedCode = await formatCodeWithPrettier(filePath, contents);

    await fs.promises.writeFile(filePath, contents);

    console.log(`Successfully wrote contents to ${filePath}`);
  } catch (error) {
    console.error(`Error writing contents to ${filePath}:`, error);
  }
}
