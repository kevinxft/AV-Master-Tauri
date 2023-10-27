import { useState, VideoType } from "../../common/useState";
import { useDirectoryPicker } from "@/common/useFs";
import { useCallback, useEffect, useRef } from "react";
import { formatName } from "@/utils";
import StarButton from "@/components/StarButton";
import { invoke } from "@tauri-apps/api";
import { readBinaryFile } from "@tauri-apps/api/fs";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { AiFillPlayCircle } from "react-icons/ai";
import { COVERS_DIR_FULL_PATH } from "@/common/constants";
import "./index.css";

function MoviePost({
  video,
  mini = false,
}: {
  video: VideoType;
  mini?: boolean;
}) {
  const { playList, covers, isFullCover, rootPath } = useState();
  const { rescanCovers } = useDirectoryPicker();

  const isInPlayList = playList.some((v) => v.name === video.name);
  const imgRef = useRef<HTMLImageElement>(null);

  const onPlayVideo = () => {
    invoke("play", { path: video.path });
  };

  const onRefreshCover = async () => {
    const response = (await invoke("get_cover", {
      code: video.formatName,
    })) as string;
    console.log(response);
    if (response && response.includes("http")) {
      await invoke("download_img", {
        path: `${rootPath}/${COVERS_DIR_FULL_PATH}/`,
        code: video.formatName,
        src: response,
      });
      rescanCovers();
      if (imgRef.current) {
        imgRef.current.src = response;
      }
    }
  };

  const setCover = useCallback(() => {
    if (!imgRef.current) {
      return;
    }
    const url = covers.get(video.formatName);
    if (url) {
      if (url.includes("blob")) {
        imgRef.current.src = url;
        return;
      }
      readBinaryFile(url).then((data) => {
        const uniArr = new Uint8Array(data);
        const imgBlob = new Blob([uniArr], { type: "image/jpg" });
        const blobUrl = URL.createObjectURL(imgBlob);
        covers.set(video.formatName, blobUrl);
        if (imgRef.current) {
          imgRef.current.src = convertFileSrc(url);
        }
      });
    }
  }, [video, covers, imgRef]);

  useEffect(() => {
    setCover();
  }, [setCover]);

  return (
    <div
      className={`relative flex flex-col transition-all ease-in-out overflow-hidden rounded-lg  cover-ratio bg-slate-500 ${
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
