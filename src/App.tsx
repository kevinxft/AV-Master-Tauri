import { useDirectoryPicker } from "./common/useDirectoryPicker";
import MovieWall from "./components/MovieWall";
import SiderBar from "./components/SiderBar";
import PlayerBar from "./components/PlayerBar";
import WelcomePanel from "@/components/WelcomePanel";
import { invoke } from "@tauri-apps/api";

// now we can call our Command!
// Right-click the application background and open the developer tools.
// You will see "Hello, World!" printed in the console!
invoke("greet", { name: "World" })
  // `invoke` returns a Promise
  .then((response) => console.log(response));

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
