import { formatName, getGroupWithCount } from "../utils";
import { _ALL_KEY } from "./constants";
import { useState, GroupType, FunctionType } from "./useState";

const AV_MASTER_CONFIG_DIR = "__AV_MASTER_CONFIG__";
const AV_MASTER_COVERS_DIR = "__AV_MASTER_COVERS__";
const AV_MASTER_USER_DATA = "__AV_MASTER_USER_DATA__.json";

export const localCovers = new Map();
export const dirs = new Map();
const files: FilesType = [];

type FilesType = FileSystemFileHandle[];
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type HandleType = UnwrapPromise<ReturnType<typeof showDirectoryPicker>>;
type PickerReturnType = {
  videos: FileSystemFileHandle[];
  showPicker: (startIn?: FileSystemDirectoryHandle) => Promise<void>;
  isLoading: boolean;
  group: GroupType[];
} & Pick<FunctionType, "filter" | "search">;

let rootHandle: FileSystemDirectoryHandle;

const processCovers = async (handle: HandleType) => {
  const iter = await handle.entries();
  for await (const entry of iter) {
    if (entry[1].kind === "file") {
      localCovers.set(formatName(entry[1].name), entry[1]);
    }
  }
};

const processDirs = (file: FileSystemFileHandle, dir: string) => {
  if (dirs.has(dir)) {
    dirs.get(dir).push(file);
  } else {
    dirs.set(dir, [file]);
  }
};

const processHandle = async (handle: HandleType, currentDir?: string) => {
  const iter = await handle.entries();
  for await (const entry of iter) {
    const cur = entry[1];
    if (cur.kind === "directory") {
      if (cur.name === AV_MASTER_COVERS_DIR) {
        await processCovers(cur);
      } else {
        await processHandle(cur, cur.name);
      }
    } else {
      if (cur.name !== AV_MASTER_USER_DATA) {
        files.push(cur);
        if (currentDir) {
          processDirs(cur, currentDir);
        }
      }
    }
  }
};

export const useDirectoryPicker = (): PickerReturnType => {
  const {
    videos,
    group,
    setGroup,
    setVideos,
    setDirs,
    filter,
    search,
    isLoading,
    setLoading,
  } = useState();
  const showPicker = async (startIn?: FileSystemDirectoryHandle) => {
    try {
      setLoading(true);
      if (startIn) {
        console.log("startIn", startIn);
        const iter = await startIn.entries();
        const first: FileSystemHandle = (await iter.next()).value();
        rootHandle = await showDirectoryPicker({
          ...{ startIn: first },
        });
      } else {
        rootHandle = await showDirectoryPicker({ mode: "readwrite" });
      }
      const file = await rootHandle.getDirectoryHandle(AV_MASTER_CONFIG_DIR);
      console.log("rootHanlde", file);
      await processHandle(rootHandle);
      await initConfig(rootHandle);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    setVideos(files);
    setGroup(getGroupWithCount(files));
    setDirs([_ALL_KEY, ...Array.from(dirs.keys())]);
  };

  return {
    showPicker,
    videos,
    group,
    filter,
    search,
    isLoading,
  };
};

export const writeFile = async (
  handle: FileSystemDirectoryHandle,
  fileName: string,
  contents: string | Blob
) => {
  const fileHandle = await handle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
};

export const createFolder = async (
  handle: FileSystemDirectoryHandle,
  directory: string
) => {
  if (handle) {
    await handle.getDirectoryHandle(directory, {
      create: true,
    });
  }
};

const getDirHandle = async (
  handle: FileSystemDirectoryHandle,
  directory: string
) => {
  try {
    const dirHandle = await handle.getDirectoryHandle(directory);
    return dirHandle;
  } catch (error) {
    return null;
  }
};

const getFileHandle = async (
  handle: FileSystemDirectoryHandle,
  file: string
) => {
  try {
    const fileHanlde = await handle.getFileHandle(file);
    return fileHanlde;
  } catch (error) {
    return null;
  }
};

const initConfig = async (handle: FileSystemDirectoryHandle) => {
  if (!handle) {
    return;
  }
  if (!(await getDirHandle(handle, AV_MASTER_CONFIG_DIR))) {
    await createFolder(handle, AV_MASTER_CONFIG_DIR);
  }
  await initCoversDir();
  await initUserData();
};

const initCoversDir = async () => {
  const configDirHandle = await getDirHandle(rootHandle, AV_MASTER_CONFIG_DIR);
  if (configDirHandle) {
    createFolder(configDirHandle, AV_MASTER_COVERS_DIR);
  }
};

const initUserData = async () => {
  const configDirHandle = await getDirHandle(rootHandle, AV_MASTER_CONFIG_DIR);
  if (configDirHandle) {
    if (!(await getFileHandle(configDirHandle, AV_MASTER_USER_DATA))) {
      await writeFile(configDirHandle, AV_MASTER_USER_DATA, "");
    }
  }
};

const getCoversDirHandle = async () => {
  try {
    const configDirHandle = await getDirHandle(
      rootHandle,
      AV_MASTER_CONFIG_DIR
    );
    if (configDirHandle) {
      return await getDirHandle(configDirHandle, AV_MASTER_COVERS_DIR);
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const saveImage = async (ImageName: string, data: Blob) => {
  const coversDirHandle = await getCoversDirHandle();
  try {
    const file = new File([data], ImageName, { type: "image/jpeg" });
    if (coversDirHandle) {
      await writeFile(coversDirHandle, ImageName, file);
    }
  } catch (error) {
    console.error("保存图片失败", error);
  }
};

export const refresDirs = () => {
  if (rootHandle) {
    console.log(rootHandle);
  }
};
