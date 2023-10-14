import MovieWall from "./components/MovieWall";
import SiderBar from "./components/SiderBar";
import WelcomePanel from "@/components/WelcomePanel";
import { useState } from "@/common/useState";

function App() {
  const { videos } = useState();
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
    </>
  );
}

export default App;
