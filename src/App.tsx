import { useDirectoryPicker } from "./common/useDirectoryPicker";
import MovieWall from "./components/MovieWall";
import SiderBar from "./components/SiderBar";
import PlayerBar from "./components/PlayerBar";
import WelcomePanel from "@/components/WelcomePanel";

function App() {
  const { videos } = useDirectoryPicker();
  return (
    <>
      <div className="flex min-w-full min-h-screen bg-neutral-950 ">
        {videos.length === 0 ? (
          <WelcomePanel />
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
