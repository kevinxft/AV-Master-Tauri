import { useDirectoryPicker } from "@/common/useFs";

function WelcomePanel() {
  const { openDir } = useDirectoryPicker();
  return (
    <div className="flex flex-col items-center justify-center w-64 h-64 m-auto bg-cyan-500 rounded-3xl">
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
