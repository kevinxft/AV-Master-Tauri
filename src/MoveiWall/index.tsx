import { useState, filterVideos } from "../common/useState";
import MoviePost from "../MoviePost";
import { useRef } from "react";

function MovieWall() {
  const { videos, search, filter, playList, group, query, groupKey } =
    useState();
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
      </div>
      <div className="px-4 text-white">
        query:{query}, groupKey: {groupKey}
      </div>
      {playList.length > 0 && <div>{playList.length}</div>}
      <div className="flex flex-row flex-wrap gap-4 p-4 overflow-y-auto">
        {filterVideos(videos, group, groupKey, query).map((video) => (
          <MoviePost key={video.name} video={video} />
        ))}
      </div>
    </div>
  );
}

export default MovieWall;
