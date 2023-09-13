import { useState } from "../../common/useState";

function SiderBar() {
  // const { group, dirs, filter, groupKey } = useState();
  const { dirs, dirName, setDirName, isFullCover, setFullCover } = useState();

  return (
    // <div className="flex flex-col max-h-screen overflow-y-auto text-white bg-black border-r border-r-cyan-100 w-52 pb-28 min-w-max">
    //   {dirs.map((item) => (
    //     <div
    //       className={`px-6 py-2 cursor-pointer text-inherit hover:bg-white/10 ${
    //         groupKey === item.key
    //           ? "bg-cyan-200 hover:bg-cyan-200/90 text-slate-800"
    //           : ""
    //       }`}
    //       onClick={() => filter(item.key)}
    //       key={item.key}
    //     >
    //       {item.name}
    //     </div>
    //   ))}
    // </div>
    <>
      <div className="flex flex-col max-h-screen overflow-y-auto text-orange-100 border-r contes border-r-orange-100 w-52 pb-28 min-w-max">
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
            className={`px-6 py-2 cursor-pointer text-inherit  ${
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
