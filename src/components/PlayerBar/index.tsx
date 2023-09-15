import { useState } from "../../common/useState";
import { useRef, RefObject } from "react";
import Modal from "../Modal";
import PlayerGrid from "../PlayerGrid";
import Player from "../Player";

function PlayerBar() {
  const {
    playList,
    removePlayList,
    modalVisible,
    setModal,
    setRecent,
    isFullScreen,
  } = useState();
  const onRemove = (videoName: string) => removePlayList(videoName);

  const videoRefs = useRef<RefObject<HTMLVideoElement>[]>([]);

  const onRegister = (ref: RefObject<HTMLVideoElement>) => {
    videoRefs.current.push(ref);
  };

  const onHide = () => {
    setModal(false);
    onPauseAll();
  };

  const onShow = () => {
    setModal(true);
    onPlayAll();
    setRecent(false);
  };

  const onPlayAll = () => {
    videoRefs.current.forEach((v) => v.current?.play());
  };

  const onPauseAll = () => {
    videoRefs.current.forEach((v) => v.current?.pause());
  };

  const onReplayAll = () => {};

  const lastVideo = playList[playList.length - 1];

  return (
    <>
      <div
        className={`fixed bottom-2 left-0 right-0 mx-auto rounded-lg w-fit z-50 flex items-center justify-center px-4  h-16 gap-4 text-white bg-neutral-900 shadow-md max-w-96 transition-all ${
          playList.length > 0 && !modalVisible
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        {playList.map((video) => (
          <div
            key={video.fileName}
            onClick={() => onRemove(video.fileName)}
            className="p-2 text-sm underline rounded-lg cursor-pointer"
          >
            {video.name}
          </div>
        ))}
        <button
          onClick={onShow}
          className="px-4 py-2 text-white rounded-lg select-none bg-amber-500/90 hover:bg-amber-400"
        >
          播放
        </button>
      </div>
      <Modal visible={modalVisible} onClose={onHide}>
        <PlayerGrid
          onClose={onHide}
          onPause={onPauseAll}
          onPlay={onPlayAll}
          onReplay={onReplayAll}
        >
          {!isFullScreen
            ? lastVideo && (
                <Player
                  key={lastVideo.name}
                  video={lastVideo}
                  register={onRegister}
                />
              )
            : playList.map((video) => (
                <Player key={video.name} video={video} register={onRegister} />
              ))}
        </PlayerGrid>
      </Modal>
    </>
  );
}

export default PlayerBar;
