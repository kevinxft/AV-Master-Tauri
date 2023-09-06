import { create } from "zustand";

export type FunctionType = {
  setVideos: (videos: FileSystemHandle[]) => void;
  setGroup: (group: GroupType[]) => void;
  search: (query: string) => void;
  filter: (groupKey: string) => void;
  reset: (initState: ValueType) => void;
  addPlayList: (video: string) => void;
  removePlayList: (video: string) => void;
};

export type GroupType = {
  name: string;
  key: string;
  files?: FileSystemHandle[];
};

export type ValueType = {
  videos: FileSystemHandle[];
  group: GroupType[];
  query: string;
  groupKey: string;
  playList: string[];
  isPlaying: boolean;
};

export const initState = {
  videos: [],
  group: [],
  query: "",
  groupKey: "all",
  playList: [],
  isPlaying: false,
};

export type StateType = ValueType & FunctionType;
export const useState = create<StateType>((set) => ({
  ...initState,
  setVideos: (videos) => set(() => ({ videos })),
  setGroup: (group) => set(() => ({ group })),
  search: (query) => set(() => ({ query })),
  filter: (groupKey) => set(() => ({ groupKey })),
  reset: (initState) => set(() => ({ ...initState })),
  addPlayList: (video) =>
    set((state) => ({ playList: [...state.playList, video] })),
  removePlayList: (video) =>
    set((state) => ({
      playList: state.playList.filter((item) => item !== video),
    })),
}));

export const filterVideos = (
  videos: FileSystemHandle[],
  group: GroupType[],
  groupKey: string,
  query: string
) => {
  const search = query.trim();
  let result: FileSystemHandle[] = [];
  if (groupKey === "all") {
    result = videos;
  } else {
    result = group.find((item) => item.key === groupKey)?.files || [];
  }
  if (search) {
    return result.filter((video) => video.name.toLowerCase().includes(search));
  }
  return result;
};
