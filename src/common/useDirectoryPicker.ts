import { getGroupWithCount } from "../utils";
import { useState, GroupType, FunctionType } from "./useState";

type UnwrapPromise<T> = T extends Promise<infer U> ? U : T;
type HandleType = UnwrapPromise<ReturnType<typeof showDirectoryPicker>>;
type PickerReturnType = {
  videos: FileSystemHandle[];
  showPicker: () => Promise<void>;
  group: GroupType[];
} & Pick<FunctionType, "filter" | "search">;

export const useDirectoryPicker = (): PickerReturnType => {
  const { videos, group, setGroup, setVideos, filter, search } = useState();
  const files: FileSystemHandle[] = [];
  const showPicker = async () => {
    try {
      const handle = await showDirectoryPicker();
      await processHandle(handle);
    } catch (err) {
      console.error(err);
    }
    const _files = files.slice(0, 300);
    setVideos(_files);
    setGroup(getGroupWithCount(_files));
  };

  const processHandle = async (handle: HandleType) => {
    const iter = await handle.entries();
    for await (const entry of iter) {
      if (entry[1].kind === "directory") {
        await processHandle(entry[1]);
      } else {
        files.push(entry[1]);
      }
    }
  };

  return {
    showPicker,
    videos,
    group,
    filter,
    search,
  };
};
