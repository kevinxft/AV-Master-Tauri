import { ReactNode } from "react";
import { useState } from "../../common/useState";

type PlayerGridType = {
  children: ReactNode;
  onClose: () => void;
  onPause: () => void;
  onPlay: () => void;
  onReplay: () => void;
};

function PlayerGrid(props: PlayerGridType) {
  const { playList, isFullScreen } = useState();
  return (
    <div
      className={`grid ${
        isFullScreen
          ? playList.length === 1
            ? "grid-cols-1"
            : playList.length >= 2 && playList.length < 5
            ? "grid-cols-2"
            : "grid-cols-3"
          : "grid-cols-1"
      }`}
    >
      {props.children}
    </div>
  );
}

export default PlayerGrid;
