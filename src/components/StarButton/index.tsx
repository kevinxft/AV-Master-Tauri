import { AiOutlineStar, AiFillStar } from "react-icons/ai";
import { useState } from "@/common/useState";

function StarButton({ videoName }: { videoName: string }) {
  const { stars, setStar } = useState();
  const onStar = () => {
    setStar(videoName);
  };
  return (
    <div className="cursor-pointer" onClick={onStar}>
      {stars.includes(videoName) ? <AiFillStar /> : <AiOutlineStar />}
    </div>
  );
}

export default StarButton;
