import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useState } from "@/common/useState";

function StarButton({ videoName }: { videoName: string }) {
  const { stars, setStar } = useState();
  const onStar = () => {
    setStar(videoName);
  };
  const isStared = stars.includes(videoName);
  return (
    <div
      className={`cursor-pointer ${isStared && "text-red-400"}`}
      onClick={onStar}
    >
      {isStared ? <AiFillHeart /> : <AiOutlineHeart />}
    </div>
  );
}

export default StarButton;
