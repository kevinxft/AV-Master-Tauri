import { removeFileType } from "../utils";
import { useState } from "../common/useState";
import "./index.css";

function MoviePost(props: { video: FileSystemHandle }) {
  const { addPlayList } = useState();
  const onAddPlay = () => {
    console.log(props.video);
  };
  return (
    <div className="relative flex flex-col w-48 overflow-hidden rounded-lg shadow-2xl h-72 bg-slate-500">
      <img
        className="cut-post"
        // src="https://pics.dmm.co.jp/mono/movie/adult/1mist409/1mist409pl.jpg"
      />
      <div className="z-10 text-center text-white z-1 bg-black/50">
        {removeFileType(props.video.name)}
      </div>
      <button
        onClick={onAddPlay}
        className="py-1 mt-auto text-center text-white transition-all bg-blue-500/60 hover:bg-blue-500"
      >
        播放
      </button>
    </div>
  );
}

export default MoviePost;
