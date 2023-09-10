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
  const { playList } = useState();
  return (
    <div className="flex flex-col">
      <div
        className="flex gap-2 p-2 rounded-md bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => props?.onClose()}
          className="px-4 py-2 text-white bg-red-300 rounded-xl"
        >
          关闭
        </button>
        <button
          onClick={() => props?.onPlay()}
          className="p-2 text-white bg-orange-300 rounded-xl"
        >
          全部播放
        </button>
        <button
          onClick={() => props?.onPause()}
          className="p-2 text-white bg-orange-300 rounded-xl"
        >
          全部暂停
        </button>
        <button
          onClick={() => props?.onReplay()}
          className="p-2 text-white bg-orange-300 rounded-xl"
        >
          全部从头播放
        </button>
      </div>
      <div
        className={`grid h-[90vh] ${
          playList.length === 1
            ? "grid-cols-1"
            : playList.length >= 2 && playList.length < 5
            ? "grid-cols-2"
            : "grid-cols-3"
        }`}
      >
        {props.children}
      </div>
    </div>
  );
}

export default PlayerGrid;
