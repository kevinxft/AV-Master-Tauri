import { formatName, getGroupWithCount } from "../utils";
import { useState, GroupType, FunctionType } from "./useState";

const AV_MASTER_CONFIG_DIR = "__AV_MASTER_CONFIG__";
const AV_MASTER_COVERS_DIR = "__AV_MASTER_COVERS__";
const AV_MASTER_USER_DATA = "__AV_MASTER_USER_DATA__.json";

export const localCovers = new Map();

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type HandleType = UnwrapPromise<ReturnType<typeof showDirectoryPicker>>;
type PickerReturnType = {
  videos: FileSystemFileHandle[];
  showPicker: () => Promise<void>;
  isLoading: boolean;
  group: GroupType[];
} & Pick<FunctionType, "filter" | "search">;

let handle: FileSystemDirectoryHandle;

export const useDirectoryPicker = (): PickerReturnType => {
  const {
    videos,
    group,
    setGroup,
    setVideos,
    filter,
    search,
    isLoading,
    setLoading,
  } = useState();
  const files: FileSystemFileHandle[] = [];
  const showPicker = async () => {
    try {
      setLoading(true);
      handle = await showDirectoryPicker();
      await processHandle(handle);
      await initConfig(handle);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    setVideos(files);
    setGroup(getGroupWithCount(files));
  };

  const processCovers = async (handle: HandleType) => {
    const iter = await handle.entries();
    for await (const entry of iter) {
      if (entry[1].kind === "file") {
        localCovers.set(formatName(entry[1].name), entry[1]);
      }
    }
  };

  const processHandle = async (handle: HandleType) => {
    const iter = await handle.entries();
    for await (const entry of iter) {
      if (entry[1].kind === "directory") {
        if (entry[1].name === AV_MASTER_COVERS_DIR) {
          await processCovers(entry[1]);
        } else {
          await processHandle(entry[1]);
        }
      } else {
        if (entry[1].name !== AV_MASTER_USER_DATA) {
          files.push(entry[1]);
        }
      }
    }
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
  const configDirHandle = await getDirHandle(handle, AV_MASTER_CONFIG_DIR);
  if (configDirHandle) {
    createFolder(configDirHandle, AV_MASTER_COVERS_DIR);
  }
};

const initUserData = async () => {
  const configDirHandle = await getDirHandle(handle, AV_MASTER_CONFIG_DIR);
  if (configDirHandle) {
    if (!(await getFileHandle(configDirHandle, AV_MASTER_USER_DATA))) {
      await writeFile(configDirHandle, AV_MASTER_USER_DATA, "");
    }
  }
};

const getCoversDirHandle = async () => {
  try {
    const configDirHandle = await getDirHandle(handle, AV_MASTER_CONFIG_DIR);
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
