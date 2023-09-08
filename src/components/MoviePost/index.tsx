import { useState, VideoType } from "../../common/useState";
import { useRef } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import "./index.css";

const formatName = (name: string) =>
  name.replace("._", "").split(".")[0] || name;

function MoviePost({
  video,
  mini = false,
}: {
  video: FileSystemFileHandle;
  mini?: boolean;
}) {
  const { removePlayList, addPlayList, playList, setStar, stars } = useState();

  const isInclude = () => playList.some((v) => v.videoName === video.name);
  const _video = useRef<VideoType>();

  const onAddPlay = async () => {
    if (isInclude()) {
      return;
    }
    const url = await video.getFile();
    if (!_video.current) {
      _video.current = {
        videoName: video.name,
        name: formatName(video.name),
        url: URL.createObjectURL(url),
      };
    }
    addPlayList(_video.current);
  };

  const onRemove = () => {
    removePlayList(video.name);
  };

  const onStar = () => {
    setStar(video.name);
  };

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg shadow-2xl bg-slate-500 ${
        mini ? "w-24 h-40" : "w-40 h-64"
      }`}
    >
      <img className="cut-post" />
      <div
        className={`relative z-10 py-1 px-1  text-white cursor-pointer z-1 bg-black/50 star-parent ${
          mini ? "text-xs text-left" : "text-sm text-center"
        }`}
      >
        {formatName(video.name)}
        <div
          onClick={onStar}
          className={`absolute text-xl transition-all cursor-pointer star top-1 right-1 active:scale-50 ${
            stars.includes(video.name) ? "text-white" : "text-transparent"
          } ${mini ? "text-xs" : ""}`}
        >
          {stars.includes(video.name) ? <AiFillStar /> : <AiOutlineStar />}
        </div>
      </div>

      {isInclude() ? (
        <button
          onClick={onRemove}
          className={`py-1 mt-auto text-center text-white transition-all bg-red-500/60 hover:bg-red-500 ${
            mini ? "text-xs" : ""
          }`}
        >
          移除
        </button>
      ) : (
        <button
          onClick={onAddPlay}
          className={`py-1 mt-auto text-center text-white transition-all bg-blue-500/60 hover:bg-blue-500 ${
            mini ? "text-xs" : ""
          }`}
        >
          加入列表
        </button>
      )}
    </div>
  );
}

export default MoviePost;
