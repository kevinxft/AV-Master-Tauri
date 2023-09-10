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
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center p-2 text-transparent transition-all hover:bg-slate-300/40 hover:text-white">
        {video.name}
        <StarButton videoName={video.fileName} />
        <button className="p-1 ml-auto" onClick={onRemove}>
          移除
        </button>
      </div>
      <video
        className="object-contain w-full h-full"
        ref={videoRef}
        src={video.url}
        controls
      ></video>
    </div>
  );
}

export default Player;
