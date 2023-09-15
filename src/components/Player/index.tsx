import { VideoType, useState } from "../../common/useState";
import { useEffect, useRef, RefObject } from "react";
import StarButton from "@/components/StarButton";

function Player({
  video,
  register,
}: {
  video: VideoType;
  register: (videoRef: RefObject<HTMLVideoElement>) => void;
}) {
  const videoRef = useRef(null);
  const { removePlayList } = useState();

  const onRemove = () => {
    removePlayList(video.fileName);
  };

  useEffect(() => {
    if (videoRef) {
      register(videoRef);
    }
  }, [register, videoRef]);
  return (
    <div className="relative aspect-video">
      <div className="absolute top-0 left-0 right-0 z-30 p-2 text-transparent hover:bg-slate-300/40 hover:text-white group">
        <div className="items-center justify-center hidden gap-1 group-hover:flex">
          {video.name}
          <StarButton videoName={video.fileName} />
          <button className="ml-auto" onClick={onRemove}>
            移除
          </button>
        </div>
      </div>
      <video
        className="object-contain"
        ref={videoRef}
        src={video.url}
        autoPlay
        controls
      ></video>
    </div>
  );
}

export default Player;
