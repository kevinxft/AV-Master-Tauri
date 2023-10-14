import { LRUCache } from "./LRUCache";
export * from "./LRUCache";
import { _ALL_KEY } from "@/common/constants";

const baseURL = "http://192.168.2.105:7777";
const localStarsKey = "AV-MASTER-STARS";
const localRecentKey = "AV-MASTER-RECENT";
const localRecentPathKey = "AV-MASTER-RECENT-Path";

export const fileNameRe = /([A-Za-z]+)-\d+/;

export const formatName = (name: string) =>
  name
    .replace("._", "")
    .replace(/-_uncensored|_uncensored/, "")
    .replace(/\..*$/, "") || name;

export const groupFile = (files: FileSystemFileHandle[]) => {
  const result: { [key: string]: FileSystemFileHandle[] } = {};
  files.forEach((file) => {
    const match = file.name.toUpperCase().match(fileNameRe);
    const group = match ? match[1] : "others";
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(file);
  });
  return result;
};

export const removeFileType = (fileName: string) =>
  fileName.replace(/^(.+?)(\.[^.]+)?$/, "$1");

export const getGroupWithCount = (files: FileSystemFileHandle[]) => {
  const group = groupFile(files);
  const list = Object.keys(group)
    .sort((a, b) => group[b].length - group[a].length)
    .map((key) => ({
      name: `${key} (${group[key].length})`,
      key,
      files: group[key],
    }));
  return [
    {
      name: `全部 (${files.length})`,
      key: _ALL_KEY,
    },
    ...list,
  ];
};

export const setRecentPath = (path: string) => {
  const paths = getLocalArr(localRecentPathKey);
  if (paths.includes(path)) {
    return;
  }
  setLocalArr(localRecentPathKey, [path, ...paths]);
};

export const getRecnetPaths = () => {
  return getLocalArr(localRecentPathKey);
};

export const setRecent = (arr: string[]) => {
  setLocalArr(localRecentKey, arr);
};

export const getRecent = (LRU: LRUCache) => {
  const arr = getLocalArr(localRecentKey);
  LRU.initData(arr);
  return arr;
};

export const setStars = (arr: string[]) => {
  setLocalArr(localStarsKey, arr);
};

export const getStars = () => {
  return getLocalArr(localStarsKey);
};

const getLocalArr = (key: string) => {
  const stars: string = getLocalStorage(key, true);
  return stars.split(",");
};

const setLocalArr = (key: string, arr: string[]) => {
  setLocalStorage(key, arr.filter((v) => !!v).join(","));
};

export const getLocalStorage = (key: string, origin = false) => {
  const result = localStorage.getItem(key);
  if (result === null) {
    return "";
  }
  if (origin) {
    return result;
  }
  try {
    return JSON.parse(result);
  } catch (error) {
    return result;
  }
};

export const setLocalStorage = (key: string, value: object | string) => {
  let _value: string;
  if (typeof value === "object" && value !== null) {
    _value = JSON.stringify(value);
  } else {
    _value = value;
  }
  localStorage.setItem(key, _value);
};

export const getPost = async (code: string): Promise<boolean> => {
  const _code = formatName(code);
  const response = await fetch(`${baseURL}/av/${_code}`);
  const data = await response.json();
  if (data.url) {
    return await downloadImage(code, data.url);
  }
  return false;
};

export const downloadImage = async (code: string, url: string) => {
  const response = await fetch(`${baseURL}/cover?url=${url}`);
  const ImageName = `${code}.jpg`;
  const data = await response.blob();
  if (data.size === 0) {
    return false;
  }
  return !!ImageName;
  // return await saveImage(ImageName, data);
};
