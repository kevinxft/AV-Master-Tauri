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
    <>
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
      <div className="grid grid-cols-3">{props.children}</div>
    </>
  );
}

export default PlayerGrid;
