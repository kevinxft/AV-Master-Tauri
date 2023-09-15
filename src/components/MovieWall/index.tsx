import { useState, filterVideos } from "../../common/useState";
import { dirs } from "@/common/useDirectoryPicker";
import MoviePost from "../MoviePost";
import { useRef } from "react";
import { _ALL_KEY } from "@/common/constants";

function MovieWall() {
  const {
    videos,
    search,
    filter,
    group,
    query,
    groupKey,
    dirName,
    isFullCover,
  } = useState();
  const inputRef: React.RefObject<HTMLInputElement> = useRef(null);

  const onSearch = () => {
    if (inputRef.current) {
      search(inputRef.current.value);
    }
  };

  const onReset = () => {
    search("");
    filter(_ALL_KEY);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col flex-1 max-h-screen overflow-hidden select-none">
      <div className="p-4 text-white">
        {dirName === _ALL_KEY ? "全部作品" : dirName}
      </div>
      <div className="overflow-y-auto pb-[100px]">
        {/* <div className="grid gap-4 p-4 min-[400px]:grid-cols-1 min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1600px]:grid-cols-4 min-[2000px]:grid-cols-5 min-[2400px]:grid-cols-6 min-[2800px]:grid-cols-7"> */}
        <div
          className={`grid gap-4 p-4 ${
            isFullCover
              ? 'min-[400px]:grid-cols-1 min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1600px]:grid-cols-4 min-[2000px]:grid-cols-5 min-[2400px]:grid-cols-6 min-[2800px]:grid-cols-7"'
              : "min-[300px]:grid-cols-2 min-[550px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1050px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1550px]:grid-cols-7 min-[1800px]:grid-cols-8 min-[2050px]:grid-cols-9 min-[2300px]:grid-cols-10 min-[2550px]:grid-cols-11 min-[2800px]:grid-cols-12"
          } `}
        >
          {filterVideos(
            videos,
            false,
            group,
            groupKey,
            query,
            dirs,
            dirName
          ).map((video) => (
            <MoviePost key={video.name} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieWall;
