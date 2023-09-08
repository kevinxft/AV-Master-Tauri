import { create } from "zustand";
import { getStars, setStars, setRecent, getRecent, LRUCache } from "@/utils";

const LRU = new LRUCache(10);

export type FunctionType = {
  setVideos: (videos: FileSystemFileHandle[]) => void;
  setGroup: (group: GroupType[]) => void;
  search: (query: string) => void;
  filter: (groupKey: string) => void;
  reset: (initState: ValueType) => void;
  addPlayList: (video: VideoType) => void;
  removePlayList: (videoName: string) => void;
  setLoading: (loading: boolean) => void;
  setModal: (modalVisible: boolean) => void;
  setStar: (vidoeName: string) => void;
  setRecent: (clear?: boolean) => void;
};

export type GroupType = {
  name: string;
  key: string;
  files?: FileSystemFileHandle[];
};

export type VideoType = {
  videoName: string;
  name: string;
  url: string;
};

export type ValueType = {
  videos: FileSystemFileHandle[];
  group: GroupType[];
  query: string;
  groupKey: string;
  playList: VideoType[];
  isPlaying: boolean;
  isLoading: boolean;
  modalVisible: boolean;
  stars: string[];
  recent: string[];
};

export const initState = {
  videos: [],
  group: [],
  query: "",
  groupKey: "all",
  stars: getStars(),
  recent: getRecent(LRU),
  playList: [],
  isPlaying: false,
  isLoading: false,
  modalVisible: false,
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
      if (state.playList.includes(video)) {
        return {};
      }
      return { playList: [...state.playList, video] };
    }),
  removePlayList: (videoName) =>
    set((state) => ({
      playList: state.playList.filter((item) => item.videoName !== videoName),
    })),
  setLoading: (isLoading) => set({ isLoading }),
  setModal: (modalVisible) => set({ modalVisible }),
  setStar: (videoName) =>
    set((state) => {
      let stars: string[];
      if (state.stars.includes(videoName)) {
        stars = state.stars.filter((n) => n !== videoName);
      } else {
        stars = [...state.stars, videoName];
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
        LRU.set(v.videoName, v.name);
      });
      const recent: string[] = LRU.toArray();
      setRecent(recent);
      return { recent };
    }),
}));

export const filterVideos = (
  videos: FileSystemFileHandle[],
  group: GroupType[],
  groupKey: string,
  query: string
) => {
  const search = query.trim();
  let result: FileSystemFileHandle[] = [];
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
