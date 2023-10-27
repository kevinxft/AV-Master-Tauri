import { readDir, createDir, exists, writeTextFile } from "@tauri-apps/api/fs";
import type { FileEntry } from "@tauri-apps/api/fs";
import { open } from "@tauri-apps/api/dialog";
import { useState, dirType, VideoType } from "@/common/useState";
import { formatName } from "@/utils";
import {
  AV_MASTER_CONFIG_DIR,
  AV_MASTER_COVERS_DIR,
  AV_MASTER_USER_DATA,
  COVERS_DIR_FULL_PATH,
  _ALL_KEY,
  _ALL_KEY_NAME,
} from "./constants";

const dirs: dirType[] = [];
const allVideos: VideoType[] = [];
const covers = new Map();

const IGNORE = [
  AV_MASTER_CONFIG_DIR,
  AV_MASTER_COVERS_DIR,
  AV_MASTER_USER_DATA,
];

const converFileType = (files: FileEntry[]) => {
  return files.map((file) => ({
    name: file.name as string,
    path: file.path,
    formatName: formatName(file.name || ""),
  }));
};

export const useDirectoryPicker = () => {
  const { setCovers, setVideos, setDirs, setRootPath, rootPath } = useState();
  let total = 0;

  const openDir = async (dirPath = "") => {
    if (dirPath === "") {
      dirPath = (await open({
        directory: true,
        multiple: false,
      })) as string;
    }
    console.log(dirPath);
    if (dirPath) {
      setRootPath(dirPath);
      const entries = await readDir(dirPath as string, {
        recursive: true,
      });
      await processEntries(entries);
    }
    dirs.unshift({
      name: _ALL_KEY_NAME,
      key: _ALL_KEY,
      count: total,
    });
    setDirs(dirs);
    setVideos(allVideos);
    initConfig(dirPath);
  };

  async function processEntries(entries: FileEntry[]) {
    for (const entry of entries) {
      if (!IGNORE.includes(entry.name as string) && entry.children) {
        dirs.push({
          name: entry.name as string,
          key: entry.name as string,
          count: entry.children.length,
        });
        allVideos.push(...converFileType(entry.children));
        total += entry.children.length;
        await processEntries(entry.children);
      } else if (entry.name === AV_MASTER_CONFIG_DIR) {
        const coversDir = entry.children?.find(
          (f) => f.name === AV_MASTER_COVERS_DIR
        );
        if (coversDir) {
          await processCovers(coversDir.children || []);
        }
      }
    }
  }

  async function processCovers(entries: FileEntry[]) {
    for (const entry of entries) {
      if (entry.name) {
        covers.set(formatName(entry.name), entry.path);
      }
    }
    setCovers(covers);
  }

  async function rescanCovers() {
    const entries = await readDir(rootPath + COVERS_DIR_FULL_PATH, {
      recursive: true,
    });
    console.log(entries);
    await processCovers(entries);
  }

  return {
    openDir,
    rescanCovers,
  };
};

export const initConfig = async (rootPath: string) => {
  if (!rootPath) {
    return;
  }
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
