import { useState } from "../../common/useState";
import { useRef, RefObject } from "react";
import Modal from "../Modal";
import PlayerGrid from "../PlayerGrid";
import Player from "../Player";

function PlayerBar() {
  const { playList, removePlayList, modalVisible, setModal, setRecent } =
    useState();
  const onRemove = (videoName: string) => removePlayList(videoName);

  const videoRefs = useRef<RefObject<HTMLVideoElement>[]>([]);

  const onRegister = (ref: RefObject<HTMLVideoElement>) => {
    console.log("register");
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

  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center w-screen h-16 gap-4 text-white bg-blue-400 shadow-md max-w-96 transition-all ${
          playList.length > 0 && !modalVisible
            ? "translate-y-0"
            : "translate-y-full"
        }`}
      >
        {playList.map((video) => (
          <div
            key={video.videoName}
            onClick={() => onRemove(video.videoName)}
            className="p-2 border-2 rounded-lg cursor-pointer "
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
          {playList.map((video) => (
            <Player key={video.name} video={video} register={onRegister} />
          ))}
        </PlayerGrid>
      </Modal>
    </>
  );
}

export default PlayerBar;
