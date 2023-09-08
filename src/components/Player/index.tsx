import { VideoType, useState } from "../../common/useState";
import { useEffect, useRef, RefObject } from "react";
import { AiOutlineStar, AiFillStar } from "react-icons/ai";

function Player({
  video,
  register,
}: {
  video: VideoType;
  register: (videoRef: RefObject<HTMLVideoElement>) => void;
}) {
  const videoRef = useRef(null);
  const { removePlayList, stars, setStar } = useState();

  const onRemove = () => {
    removePlayList(video.videoName);
  };

  const onStar = () => {
    setStar(video.videoName);
  };

  useEffect(() => {
    if (videoRef) {
      register(videoRef);
    }
  }, [register, videoRef]);
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-center p-2 text-transparent transition-all hover:bg-slate-300/40 hover:text-white">
        {video.name}
        <div className="cursor-pointer active:scale-50" onClick={onStar}>
          {stars.includes(video.name) ? <AiFillStar /> : <AiOutlineStar />}
        </div>
        <button className="p-1 ml-auto" onClick={onRemove}>
          移除
        </button>
      </div>
      <video ref={videoRef} src={video.url} controls></video>
    </div>
  );
}

export default Player;
