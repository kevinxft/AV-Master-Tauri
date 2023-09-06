const re = /[^A-Za-z_]*([A-Za-z]+)-\d+/g;

export const groupFile = (files: FileSystemHandle[]) => {
  const result: { [key: string]: FileSystemHandle[] } = {};
  files.forEach((file) => {
    const group = re.exec(file.name)?.[1] || "others";
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(file);
  });
  return result;
};

export const removeFileType = (fileName: string) =>
  fileName.replace(/^(.+?)(\.[^.]+)?$/, "$1");

export const getGroupWithCount = (files: FileSystemHandle[]) => {
  const group = groupFile(files);

  console.warn(group);

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
