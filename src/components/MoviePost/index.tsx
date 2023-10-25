import { useState, VideoType } from "../../common/useState";
import { useEffect, useRef } from "react";
import { formatName } from "@/utils";
import StarButton from "@/components/StarButton";
import { FiRefreshCw } from "react-icons/fi";
import { invoke } from "@tauri-apps/api";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { AiFillPlayCircle } from "react-icons/ai";
import "./index.css";

function MoviePost({
  video,
  mini = false,
}: {
  video: VideoType;
  mini?: boolean;
}) {
  const { playList, covers, isFullCover, refreshTag } = useState();

  const isInPlayList = playList.some((v) => v.name === video.name);
  const imgRef = useRef<HTMLImageElement>(null);

  const onPlayVideo = () => {
    console.log(video.path);
    invoke("play", { path: video.path });
  };

  const onRefreshCover = async () => {
    console.log(video);
    const response = await invoke("get_cover", { code: video.formatName });
    console.log(response);
  };

  useEffect(() => {
    async function setCover() {
      if (imgRef.current) {
        const url = covers.get(video.formatName);
        if (url) {
          if (url.includes("blob")) {
            imgRef.current.src = url;
            return;
          }
          console.log("createUrl");
          const data = await readBinaryFile(url);
          const uniArr = new Uint8Array(data);
          const imgBlob = new Blob([uniArr], { type: "image/jpg" });
          const blobUrl = URL.createObjectURL(imgBlob);
          covers.set(video.formatName, blobUrl);
          imgRef.current.src = convertFileSrc(url);
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
            className={`relative py-1 px-1 cursor-pointer text-white bg-black/50 star-parent ${
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
              <div onClick={onPlayVideo}>
                <AiFillPlayCircle />
              </div>
              <StarButton videoName={video.name} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviePost;
