import { useState, VideoType } from "../../common/useState";
import { localCovers } from "@/common/useDirectoryPicker";
import { useEffect, useRef } from "react";
import { formatName, getPost } from "@/utils";
import StarButton from "@/components/StarButton";
import AddButton from "@/components/AddButton";
import "./index.css";

function MoviePost({
  video,
  mini = false,
}: {
  video: FileSystemFileHandle;
  mini?: boolean;
}) {
  const {
    removePlayList,
    addPlayList,
    playList,
    stars,
    isFullCover,
    setFullCover,
  } = useState();

  const isInPlayList = playList.some((v) => v.fileName === video.name);
  const _video = useRef<VideoType>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onAddPlay = async () => {
    const url = await video.getFile();
    if (!_video.current) {
      _video.current = {
        name: formatName(video.name),
        fileName: video.name,
        url: URL.createObjectURL(url),
      };
    }
    addPlayList(_video.current);
  };

  const onRemove = () => {
    removePlayList(video.name);
  };

  const onAddClick = async () => {
    console.log(isInPlayList);
    if (isInPlayList) {
      await onRemove();
      return;
    }
    await onAddPlay();
  };

  const refreshCover = async () => {
    // const res = await getPost(formatName(video.name));
    // if (imgRef.current) {
    //   imgRef.current.src = res.url;
    // }
  };

  useEffect(() => {
    async function setCover() {
      if (imgRef.current) {
        const name = video.name;
        const cover: FileSystemFileHandle | string = localCovers.get(
          formatName(name)
        );
        if (!cover) {
          return;
        }
        if (typeof cover === "string") {
          imgRef.current.src = cover;
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
      className={`relative flex flex-col transition-all ease-in-out overflow-hidden rounded-lg w-full cover-ratio bg-slate-500 ${
        video.name.includes("uncensored") && "ring-4 ring-pink-500"
      } ${isFullCover ? "full-cover" : "font-cover"}`}
    >
      <img
        className={`${isFullCover ? "full-post" : "clip-post"}`}
        ref={imgRef}
      />
      <div
        className={`absolute inset-0 flex flex-col cursor-pointer ${
          !isInPlayList && "mask"
        }`}
      >
        <div className="absolute inset-0 flex flex-col inner">
          <div
            className={`relative z-10 py-1 px-1 cursor-pointer z-1 text-white bg-black/50 star-parent ${
              mini ? "text-xs text-left" : "text-sm text-center"
            }`}
          >
            <span onClick={refreshCover}>{formatName(video.name)}</span>
          </div>
          <div className="flex h-10 mt-auto text-white bg-black/50">
            <div className="flex items-center gap-2 ml-auto text-3xl">
              <AddButton isInPlayList={isInPlayList} onClick={onAddClick} />
              <StarButton videoName={video.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviePost;
