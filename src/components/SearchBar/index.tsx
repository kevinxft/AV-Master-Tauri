import { useState } from "@/common/useState";
import { useDirectoryPicker } from "@/common/useFs";

function SearchBar() {
  const { dirName } = useState();
  const { rescanCovers } = useDirectoryPicker();
  return (
    <div className="flex p-4 text-white">
      <div>{dirName}</div>
      <div className="ml-2 cursor-pointer" onClick={rescanCovers}>
        rescan covers
      </div>
      <input
        className="px-2 ml-auto text-black rounded-sm"
        placeholder="搜索"
      />
    </div>
  );
}

export default SearchBar;
