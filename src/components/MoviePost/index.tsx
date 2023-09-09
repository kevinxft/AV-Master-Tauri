import { useState, VideoType } from "../../common/useState";
import { localCovers } from "@/common/useDirectoryPicker";
import { useEffect, useRef } from "react";
import { formatName, getPost } from "@/utils";
import StarButton from "@/components/StarButton";
import "./index.css";

function MoviePost({
  video,
  mini = false,
}: {
  video: FileSystemFileHandle;
  mini?: boolean;
}) {
  const { removePlayList, addPlayList, playList, stars } = useState();

  const isInclude = () => playList.some((v) => v.videoName === video.name);
  const _video = useRef<VideoType>();
  const imgRef = useRef<HTMLImageElement>(null);

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

  const refreshCover = async () => {
    const res = await getPost(formatName(video.name));
    if (imgRef.current) {
      imgRef.current.src = res.url;
    }
  };

  useEffect(() => {
    async function setCover() {
      if (imgRef.current) {
        const name = formatName(video.name);
        const cover: FileSystemFileHandle | string = localCovers.get(name);
        if (!cover) {
          return;
        }
        if (typeof cover === "string") {
          return;
        }
        const file = await cover.getFile();
        const url = URL.createObjectURL(file);
        imgRef.current.src = url;
        localCovers.set(name, url);
      }
    }
    setCover();
  }, [imgRef, video]);

  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-lg shadow-2xl bg-slate-500 ${
        mini ? "w-24 h-36" : "w-40 h-60"
      }`}
    >
      <img className="cut-post" ref={imgRef} />
      <div
        className={`relative z-10 py-1 px-1  text-white cursor-pointer z-1 bg-black/50 star-parent ${
          mini ? "text-xs text-left" : "text-sm text-center"
        }`}
      >
        <span onClick={refreshCover}>{formatName(video.name)}</span>
        <div
          className={`absolute text-xl transition-all cursor-pointer star top-1 right-1 ${
            stars.includes(video.name) ? "text-white" : "text-transparent"
          } ${mini ? "text-xs" : ""}`}
        >
          <StarButton videoName={video.name} />
        </div>
      </div>

      {isInclude() ? (
        <button
          onClick={onRemove}
          className={`mt-auto text-center text-white transition-all bg-red-500/60 hover:bg-red-500 ${
            mini ? "text-xs" : ""
          }`}
        >
          移除
        </button>
      ) : (
        <button
          onClick={onAddPlay}
          className={`mt-auto text-center text-white transition-all bg-blue-500/60 hover:bg-blue-500 ${
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
