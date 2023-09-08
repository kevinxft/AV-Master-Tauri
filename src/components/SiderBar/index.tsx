import { useState } from "../../common/useState";

function SiderBar() {
  const { group, filter, groupKey } = useState();
  return (
    <div className="flex flex-col max-w-xl max-h-screen overflow-y-auto text-white pb-28 min-w-max bg-slate-500">
      {group.map((item) => (
        <div
          className={`px-6 py-1 cursor-pointer text-inherit hover:bg-white/10 ${
            groupKey === item.key
              ? "bg-orange-200 hover:bg-orange-200/90 text-slate-800"
              : ""
          }`}
          onClick={() => filter(item.key)}
          key={item.key}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}

export default SiderBar;
