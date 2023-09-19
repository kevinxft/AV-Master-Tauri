import { useDirectoryPicker } from "@/common/useDirectoryPicker";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/common/db";
import { openDir } from "@/common/useFs";

function WelcomePanel() {
  const { showPicker } = useDirectoryPicker();
  const directories = useLiveQuery(() => db.directories.toArray());
  return (
    <div className="flex flex-col items-center justify-center w-64 h-64 m-auto bg-cyan-500 rounded-3xl">
      <div>最近打开</div>
      {directories?.map((dir) => (
        <div
          className="p-4 bg-red-300 rounded-md cursor-pointer"
          onClick={() => showPicker(dir.handle)}
          key={dir.name}
        >
          {dir.name}
        </div>
      ))}
      <button
        onClick={() => openDir()}
        className="p-4 m-auto text-white transition-all rounded-xl bg-cyan-600 hover:bg-cyan-600/90"
      >
        打开文件夹
      </button>
    </div>
  );
}

export default WelcomePanel;
