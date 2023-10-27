import { useState, filterVideos, VideoType } from "../../common/useState";
import MoviePost from "../MoviePost";
import SearchBar from "../SearchBar";
import { useState as _useState, useEffect } from "react";

function MovieWall() {
  const { videos, stars, query, dirName, isFullCover } = useState();

  const [_videos, setVideos] = _useState<Array<VideoType>>([]);

  useEffect(() => {
    setVideos(filterVideos(videos, query, dirName, stars));
  }, [videos, query, dirName, stars, setVideos]);

  return (
    <div className="flex flex-col flex-1 max-h-screen">
      <SearchBar />
      <div className="flex-1 overflow-y-auto">
        <div
          className={`grid gap-4 p-4 ${
            isFullCover
              ? 'min-[400px]:grid-cols-1 min-[800px]:grid-cols-2 min-[1200px]:grid-cols-3 min-[1600px]:grid-cols-4 min-[2000px]:grid-cols-5 min-[2400px]:grid-cols-6 min-[2800px]:grid-cols-7"'
              : "min-[300px]:grid-cols-2 min-[550px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1050px]:grid-cols-5 min-[1300px]:grid-cols-6 min-[1550px]:grid-cols-7 min-[1800px]:grid-cols-8 min-[2050px]:grid-cols-9 min-[2300px]:grid-cols-10 min-[2550px]:grid-cols-11 min-[2800px]:grid-cols-12"
          } `}
        >
          {_videos.map((video) => (
            <MoviePost key={video.name} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default MovieWall;
