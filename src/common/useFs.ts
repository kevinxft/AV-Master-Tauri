import { readDir, createDir, exists, writeTextFile } from "@tauri-apps/api/fs";
import type { FileEntry } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import {
  AV_MASTER_CONFIG_DIR,
  AV_MASTER_COVERS_DIR,
  AV_MASTER_USER_DATA,
} from "./constants";

let rootPath: string;
const dirs: FileEntry[] = [];

const IGNORE = [
  AV_MASTER_CONFIG_DIR,
  AV_MASTER_COVERS_DIR,
  AV_MASTER_USER_DATA,
];

export const openDir = async () => {
  const dirPath = (await open({
    directory: true,
    multiple: false,
  })) as string;
  console.log(dirPath);
  if (dirPath) {
    rootPath = dirPath;
    const entries = await readDir(dirPath as string, {
      recursive: true,
    });
    console.log(entries);
    processEntries(entries);
  }
  console.log(dirs);
  await initConfig(dirPath);
};

function processEntries(entries: FileEntry[]) {
  for (const entry of entries) {
    if (!IGNORE.includes(entry.name as string) && entry.children) {
      dirs.push(entry);
      processEntries(entry.children);
    }
  }
}

export const initConfig = async (rootPath: string) => {
  const configPath = `${rootPath}/${AV_MASTER_CONFIG_DIR}`;
  const coversPath = `${configPath}/${AV_MASTER_COVERS_DIR}`;
  const userDataPath = `${configPath}/${AV_MASTER_USER_DATA}`;

  await createIfNot(coversPath, async () => {
    await createDir(coversPath, { recursive: true });
  });
  await createIfNot(userDataPath, async () => {
    await writeTextFile(userDataPath, "{}");
  });
};

const createIfNot = async (path: string, callback: () => void) => {
  if (await exists(path)) {
    console.log("path is exists !");
    return;
  }
  await callback();
};
