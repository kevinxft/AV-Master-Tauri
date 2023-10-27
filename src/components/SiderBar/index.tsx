import { useState } from "../../common/useState";

function SiderBar() {
  const { dirs, dirName, setDirName, isFullCover, setFullCover } = useState();
  return (
    <>
      <div className="flex flex-col max-h-screen overflow-y-auto text-orange-100 border-r select-none contes border-r-orange-100 w-52 pb-28 min-w-max">
        <button
          className="py-2"
          onClick={() => {
            setFullCover(!isFullCover);
          }}
        >
          切换封面
        </button>
        {dirs.map((dir) => (
          <div
            className={`px-4 py-1 cursor-pointer text-inherit  ${
              dirName === dir.name
                ? "bg-orange-200 text-slate-800  hover:text-slate-800"
                : "hover:bg-orange-200/20"
            }`}
            onClick={() => setDirName(dir.key)}
            key={dir.name}
          >
            {dir.name} ({dir.count})
          </div>
        ))}
      </div>
    </>
  );
}

export default SiderBar;
