import { formatName, getGroupWithCount } from "../utils";
import { _ALL_KEY } from "./constants";
import { useState, GroupType, FunctionType } from "./useState";
import {
  AV_MASTER_CONFIG_DIR,
  AV_MASTER_COVERS_DIR,
  AV_MASTER_USER_DATA,
} from "./constants";

export const dirs = new Map();
const _covers = new Map();
const files: FilesType = [];

type FilesType = FileSystemFileHandle[];
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type HandleType = UnwrapPromise<ReturnType<typeof showDirectoryPicker>>;
type PickerReturnType = {
  videos: FileSystemFileHandle[];
  showPicker: (startIn?: FileSystemDirectoryHandle) => Promise<void>;
  isLoading: boolean;
  group: GroupType[];
  refreshCovers: () => void;
} & Pick<FunctionType, "filter" | "search">;

let rootHandle: FileSystemDirectoryHandle;
let coversHanlde: FileSystemDirectoryHandle;

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
    setCovers,
  } = useState();

  const processDirs = (file: FileSystemFileHandle, dir: string) => {
    if (dirs.has(dir)) {
      dirs.get(dir).push(file);
    } else {
      dirs.set(dir, [file]);
    }
  };

  const processCovers = async (handle: HandleType) => {
    const iter = await handle.entries();
    for await (const entry of iter) {
      const file = entry[1];
      const fileName = formatName(file.name);
      if (file.kind === "file" && !_covers.has(fileName)) {
        const url = await toUrl(file);
        _covers.set(fileName, url);
      }
    }
    setCovers(_covers);
  };

  const refreshCovers = async () => {
    if (coversHanlde) {
      await processCovers(coversHanlde);
    }
  };

  const processHandle = async (handle: HandleType, currentDir?: string) => {
    const iter = await handle.entries();
    for await (const entry of iter) {
      const cur = entry[1];
      if (cur.kind === "directory") {
        if (cur.name === AV_MASTER_COVERS_DIR && !coversHanlde) {
          coversHanlde = cur;
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
      await initConfig(rootHandle);
      await processHandle(rootHandle);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
    setVideos(files);
    setGroup(getGroupWithCount(files));
    const dirNames = Array.from(dirs.keys());
    let sortedDirs = dirNames.sort((a: string, b: string) =>
      a.localeCompare(b, undefined, { sensitivity: "base" })
    );

    sortedDirs = sortedDirs.map((name) => {
      return {
        name,
        count: dirs.get(name).length,
        key: name,
      };
    });
    setDirs([
      {
        name: "全部",
        key: _ALL_KEY,
        count: files.length,
      },
      ...sortedDirs,
    ]);
  };

  return {
    showPicker,
    videos,
    group,
    filter,
    search,
    isLoading,
    refreshCovers,
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

export const saveImage = async (
  ImageName: string,
  data: Blob
): Promise<boolean> => {
  const coversDirHandle = await getCoversDirHandle();
  try {
    const file = new File([data], ImageName, { type: "image/jpeg" });
    if (coversDirHandle) {
      await writeFile(coversDirHandle, ImageName, file);
      return true;
    }
    return false;
  } catch (error) {
    console.error("保存图片失败", error);
    return false;
  }
};

export const refresDirs = () => {
  if (rootHandle) {
    console.log(rootHandle);
  }
};

const toUrl = async (handle: FileSystemFileHandle) => {
  const file = await handle.getFile();
  const cover = URL.createObjectURL(file);
  return cover;
};
