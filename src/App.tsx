import { useDirectoryPicker } from "./common/useDirectoryPicker";
import MovieWall from "./components/MoveiWall";
import SiderBar from "./components/SiderBar";
import PlayerBar from "./components/PlayerBar";

function App() {
  const { videos, showPicker } = useDirectoryPicker();
  return (
    <>
      <div className="flex min-w-full min-h-screen bg-slate-900 ">
        {videos.length === 0 ? (
          <>
            <button
              onClick={showPicker}
              className="p-4 m-auto text-white transition-all rounded-xl bg-cyan-600 hover:bg-cyan-400/60"
            >
              打开文件夹
            </button>
          </>
        ) : (
          <>
            <SiderBar />
            <MovieWall />
          </>
        )}
      </div>
      <PlayerBar />
    </>
  );
}

export default App;
