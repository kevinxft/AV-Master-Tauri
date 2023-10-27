import { create } from "zustand";
import { getStars, setStars, setRecent, getRecent, LRUCache } from "@/utils";
import { _ALL_KEY } from "@/common/constants";

const LRU = new LRUCache(12);

export type FunctionType = {
  setRootPath: (path: string) => void;
  setVideos: (videos: VideoType[]) => void;
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
  setDirs: (dirs: dirType[]) => void;
  setDirName: (dirName: string) => void;
  setFullCover: (isFullCover: boolean) => void;
  setCovers: (covers: Map<string, string>) => void;
  updateRefreshTag: () => void;
  setFullScreen: (isFullScreen: boolean) => void;
};

export type GroupType = {
  name: string;
  key: string;
  files?: VideoType[];
};

export type VideoType = {
  path: string;
  formatName: string;
  name: string;
  url?: string;
};

export type dirType = {
  name: string;
  count: number;
  key: string;
};

export type ValueType = {
  rootPath: string;
  videos: VideoType[];
  group: GroupType[];
  dirs: dirType[];
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
  covers: Map<string, string>;
  refreshTag: number;
  isFullScreen: boolean;
};

export const initState = {
  rootPath: "",
  videos: [],
  group: [],
  dirs: [],
  query: "",
  covers: new Map(),
  groupKey: _ALL_KEY,
  dirName: _ALL_KEY,
  stars: getStars(),
  recent: getRecent(LRU),
  playList: [],
  isPlaying: false,
  isLoading: false,
  modalVisible: false,
  isFullCover: false,
  isFullScreen: false,
  refreshTag: 0,
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
      if (state.playList.some((v) => v.name === video.name)) {
        return {};
      }
      return { playList: [...state.playList, video] };
    }),
  removePlayList: (fileName) =>
    set((state) => ({
      playList: state.playList.filter((item) => item.name !== fileName),
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
        LRU.set(v.name, v.name);
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
  setCovers: (covers) => set({ covers }),
  updateRefreshTag: () =>
    set((state) => ({ refreshTag: state.refreshTag + 1 })),
  setFullScreen: (isFullScreen) => set({ isFullScreen }),
  setRootPath: (path) => set({ rootPath: path }),
}));

export const filterVideos = (
  videos: VideoType[],
  query: string,
  dirName: string,
  stars: string[]
) => {
  const result = filterByDir(videos, query, dirName, stars);
  return result;
};

const filterByDir = (
  videos: VideoType[],
  query: string,
  dirName: string,
  stars: string[]
) => {
  const search = query.trim();
  let result: VideoType[] = [];
  if (dirName === _ALL_KEY) {
    result = videos.reduce((acc, cur) => {
      if (stars.includes(cur.name)) {
        acc.unshift(cur);
      } else {
        acc.push(cur);
      }
      return acc;
    }, [] as VideoType[]);
  } else {
    result = videos.filter((video) => video.path.includes(dirName));
  }
  if (search) {
    result = result.filter((video) =>
      video.name.toLowerCase().includes(search)
    );
  }
  console.log(result);
  return result;
};
