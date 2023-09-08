import { useState } from "@/common/useState";
import MoviePost from "@/components/MoviePost";

function StarBar() {
  const { videos, stars } = useState();

  const starList = videos.filter((v) => stars.includes(v.name));
  return starList.length > 0 ? (
    <div className="px-4 text-white">
      <div className="py-4 text-slate-300">收藏</div>
      <div className="flex gap-4">
        {starList.map((post) => (
          <MoviePost key={post.name} mini={true} video={post} />
        ))}
      </div>
    </div>
  ) : null;
}

export default StarBar;
