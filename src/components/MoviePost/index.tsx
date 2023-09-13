import { useState, VideoType } from "../../common/useState";
import { useEffect, useRef } from "react";
import { formatName, getPost } from "@/utils";
import StarButton from "@/components/StarButton";
import AddButton from "@/components/AddButton";
import { useDirectoryPicker } from "@/common/useDirectoryPicker";
import { FiRefreshCw } from "react-icons/fi";
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
    covers,
    isFullCover,
    refreshTag,
    updateRefreshTag,
  } = useState();
  const { refreshCovers } = useDirectoryPicker();

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

  const onRefreshCover = async () => {
    const isSuccess = await getPost(formatName(video.name));
    if (isSuccess) {
      await refreshCovers();
      updateRefreshTag();
    }
  };

  useEffect(() => {
    async function setCover() {
      if (imgRef.current) {
        const url = covers.get(formatName(video.name));
        if (url) {
          imgRef.current.src = url;
        }
      }
    }
    setCover();
  }, [imgRef, video, covers, refreshTag]);

  return (
    <div
      className={`relative flex flex-col transition-all ease-in-out overflow-hidden rounded-lg w-full cover-ratio bg-slate-500 ${
        video.name.includes("uncensored") && "ring-4 ring-pink-500"
      } ${isFullCover ? "full-cover" : "font-cover"}`}
    >
      <img
        ref={imgRef}
        className={`${isFullCover ? "full-post" : "clip-post"}`}
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
            <span onClick={onRefreshCover}>{formatName(video.name)}</span>
          </div>
          <div className="flex items-center h-10 mt-auto text-white bg-black/50">
            <div className="ml-2 hover:rotate-180" onClick={onRefreshCover}>
              <FiRefreshCw />
            </div>
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
