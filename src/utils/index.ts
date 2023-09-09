import { LRUCache } from "./LRUCache";
import { saveImage } from "@/common/useDirectoryPicker";
export * from "./LRUCache";

const localStarsKey = "AV-MASTER-STARS";
const localRecentKey = "AV-MASTER-RECENT";

export const fileNameRe = /([A-Za-z]+)-\d+/;

export const formatName = (name: string) =>
  name.replace("._", "").replace("_uncensored", "").split(".")[0] || name;

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
      key: "all",
    },
    ...list,
  ];
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

export const getPost = async (
  code: string
): Promise<{ code: string; url: string }> => {
  const response = await fetch(`http://localhost:3000/av/${formatName(code)}`);
  const data = await response.json();
  if (data.url) {
    await downloadImage(code, data.url);
  }
  return data;
};

export const downloadImage = async (code: string, url: string) => {
  const response = await fetch(`http://localhost:3000/cover?url=${url}`);
  const ImageName = `${code}.jpg`;
  const data = await response.blob();
  console.log(data);
  if (data.size > 0) {
    await saveImage(ImageName, data);
  }
};
