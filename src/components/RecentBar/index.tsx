import { useState } from "@/common/useState";
import MoviePost from "@/components/MoviePost";
import { AiOutlineClear } from "react-icons/ai";

function RecentBar() {
  const { videos, recent, setRecent } = useState();
  const recentList = videos.filter((v) => recent.includes(v.name));
  const onClearRecent = () => setRecent(true);
  return recentList.length > 0 ? (
    <div className="px-4 text-white">
      <div className="flex items-center gap-2 py-4 text-slate-300">
        最近观看{" "}
        <div className="cursor-pointer" onClick={onClearRecent}>
          <AiOutlineClear />
        </div>
      </div>
      <div className="flex gap-4">
        {recentList.map((post) => (
          <MoviePost key={post.name} mini={true} video={post} />
        ))}
      </div>
    </div>
  ) : null;
}

export default RecentBar;
