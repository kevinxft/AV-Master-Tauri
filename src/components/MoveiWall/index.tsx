import { useState, filterVideos } from "../../common/useState";
import { localCovers } from "@/common/useDirectoryPicker";
import { formatName, getPost } from "@/utils";
import MoviePost from "../MoviePost";
import RecentBar from "../RecentBar";
import StarBar from "../StarBar";
import { useRef } from "react";

function MovieWall() {
  const { videos, search, filter, group, query, groupKey } = useState();
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const onSearch = () => {
    if (inputRef.current) {
      search(inputRef.current.value);
    }
  };

  const onReset = () => {
    search("");
    filter("all");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getVideoPost = async () => {
    for (const video of videos) {
      const name = formatName(video.name);
      if (!localCovers.has(name)) {
        console.log(`正在处理${name}封面`);
        await getPost(name);
      } else {
        console.log(`${name}已有封面`);
      }
    }
    onReset();
  };

  return (
    <div className="flex flex-col flex-1 max-h-screen overflow-hidden">
      <div className="flex items-center flex-shrink-0 h-16 px-4 shadow-xl bg-slate-700">
        <input ref={inputRef} className="h-8 px-2 rounded-md" type="text" />
        <button
          onClick={onSearch}
          className="h-8 px-4 ml-2 text-white transition-all rounded-md bg-sky-600 hover:bg-sky-700"
        >
          搜索
        </button>
        <button
          onClick={onReset}
          className="h-8 px-4 ml-2 transition-all bg-orange-400 rounded-md hover:bg-orange-500 text-neutral-800"
        >
          重置
        </button>
        <button
          onClick={getVideoPost}
          className="h-8 px-4 ml-2 transition-all bg-green-400 rounded-md hover:bg-green-500 text-neutral-700"
        >
          获取封面
        </button>
      </div>
      <StarBar />
      <RecentBar />
      <div className="p-4 text-white">
        {groupKey === "all" ? "全部作品" : `${groupKey}系列`}
      </div>
      <div className="flex flex-row flex-wrap gap-4 px-4 overflow-y-auto pb-96">
        {filterVideos(videos, group, groupKey, query).map((video) => (
          <MoviePost key={video.name} video={video} />
        ))}
      </div>
    </div>
  );
}

export default MovieWall;
