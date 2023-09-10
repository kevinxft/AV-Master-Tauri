import { AiFillMinusCircle, AiFillPlusCircle } from "react-icons/ai";

function AddButton({
  onClick,
  isInPlayList,
}: {
  onClick: () => void;
  isInPlayList: boolean;
}) {
  return (
    <div
      className={`cursor-pointer ${isInPlayList ? "text-red-400" : ""}`}
      onClick={onClick}
    >
      {isInPlayList ? <AiFillMinusCircle /> : <AiFillPlusCircle />}
    </div>
  );
}

export default AddButton;
