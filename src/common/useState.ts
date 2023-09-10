import { create } from "zustand";
import { getStars, setStars, setRecent, getRecent, LRUCache } from "@/utils";
import { _ALL_KEY } from "@/common/constants";

const LRU = new LRUCache(12);

export type FunctionType = {
  setVideos: (videos: FileSystemFileHandle[]) => void;
  setGroup: (group: GroupType[]) => void;
  search: (query: string) => void;
  filter: (groupKey: string) => void;
  reset: (initState: ValueType) => void;
  addPlayList: (video: VideoType) => void;
  removePlayList: (fileName: string) => void;
  setLoading: (loading: boolean) => void;
  setModal: (modalVisible: boolean) => void;
  setStar: (vidoeName: string) => void;
  setRecent: (clear?: boolean) => void;
  setDirs: (dirs: string[]) => void;
  setDirName: (dirName: string) => void;
  setFullCover: (isFullCover: boolean) => void;
};

export type GroupType = {
  name: string;
  key: string;
  files?: FileSystemFileHandle[];
};

export type VideoType = {
  fileName: string;
  name: string;
  url: string;
};

export type ValueType = {
  videos: FileSystemFileHandle[];
  group: GroupType[];
  dirs: string[];
  query: string;
  groupKey: string;
  dirName: string;
  playList: VideoType[];
  isPlaying: boolean;
  isLoading: boolean;
  modalVisible: boolean;
  isFullCover: boolean;
  stars: string[];
  recent: string[];
};

export const initState = {
  videos: [],
  group: [],
  dirs: [],
  query: "",
  groupKey: _ALL_KEY,
  dirName: _ALL_KEY,
  stars: getStars(),
  recent: getRecent(LRU),
  playList: [],
  isPlaying: false,
  isLoading: false,
  modalVisible: false,
  isFullCover: false,
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
    set((state) => {
      if (state.playList.some((v) => v.fileName === video.fileName)) {
        return {};
      }
      return { playList: [...state.playList, video] };
    }),
  removePlayList: (fileName) =>
    set((state) => ({
      playList: state.playList.filter((item) => item.fileName !== fileName),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setModal: (modalVisible) => set({ modalVisible }),
  setStar: (fileName) =>
    set((state) => {
      let stars: string[];
      if (state.stars.includes(fileName)) {
        stars = state.stars.filter((n) => n !== fileName);
      } else {
        stars = [...state.stars, fileName];
      }
      setStars(stars);
      return { stars };
    }),
  setRecent: (clear = false) =>
    set((state) => {
      if (clear) {
        LRU.clear();
        return { recent: [] };
      }
      state.playList.forEach((v) => {
        LRU.set(v.fileName, v.name);
      });
      const recent: string[] = LRU.toArray();
      setRecent(recent);
      return { recent };
    }),
  setDirs: (dirs) =>
    set({
      dirs,
    }),
  setDirName: (dirName) => set({ dirName }),
  setFullCover: (isFullCover) => set({ isFullCover }),
}));

export const filterVideos = (
  videos: FileSystemFileHandle[],
  isAuto: boolean = false,
  group: GroupType[],
  groupKey: string,
  query: string,
  dirs: Map<string, FileSystemFileHandle[]>,
  dirName: string
) => {
  if (isAuto) {
    return filterByAuto(videos, group, groupKey, query);
  } else {
    return filterByDir(videos, dirs, dirName, query);
  }
};

const filterByDir = (
  videos: FileSystemFileHandle[],
  dirs: Map<string, FileSystemFileHandle[]>,
  dirName: string,
  query: string
) => {
  const search = query.trim();
  let result: FileSystemFileHandle[] = [];
  if (dirName === _ALL_KEY) {
    result = videos;
  } else {
    result = dirs.get(dirName) || [];
  }
  if (search) {
    return result.filter((video) => video.name.toLowerCase().includes(search));
  }
  return result;
};

const filterByAuto = (
  videos: FileSystemFileHandle[],
  group: GroupType[],
  groupKey: string,
  query: string
) => {
  const search = query.trim();
  let result: FileSystemFileHandle[] = [];
  if (groupKey === _ALL_KEY) {
    result = videos;
  } else {
    result = group.find((item) => item.key === groupKey)?.files || [];
  }
  if (search) {
    return result.filter((video) => video.name.toLowerCase().includes(search));
  }
  return result;
};
