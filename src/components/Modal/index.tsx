import {
  ReactNode,
  RefObject,
  useEffect,
  useRef,
  useState as _useState,
  useCallback,
} from "react";
import { useState } from "@/common/useState";
import {
  AiOutlineClose,
  AiOutlineFullscreenExit,
  AiOutlineFullscreen,
} from "react-icons/ai";

function Modal({
  visible,
  children,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  const { isFullScreen, setFullScreen } = useState();
  const divRef: RefObject<HTMLDivElement> = useRef(null);
  const [position, setPosition] = _useState({ x: 0, y: 0 });
  const _position = useRef({ x: 0, y: 0 });

  const onDrag = useCallback(
    (e: MouseEvent) => {
      const x =
        e.pageX - (divRef.current !== null ? divRef.current?.offsetLeft : 0);
      const y =
        e.pageY - (divRef.current !== null ? divRef.current?.offsetTop : 0);

      window.onmousemove = (e: MouseEvent) => {
        const cx = e.pageX - x;
        const cy = e.pageY - y;
        setPosition({
          x: cx,
          y: cy,
        });
      };

      window.onmouseup = () => {
        window.onmousemove = null;
        window.onmouseup = null;
      };
    },
    [setPosition]
  );

  const onToggleFullScreen = () => {
    setFullScreen(!isFullScreen);
    if (!isFullScreen) {
      _position.current = { ...position };
      setPosition({ x: 0, y: 0 });
    } else {
      setPosition({ ..._position.current });
    }
  };

  useEffect(() => {
    if (divRef.current) {
      divRef.current.addEventListener("mousedown", onDrag);
    }
  }, [divRef, onDrag, visible]);

  return visible ? (
    <div
      ref={divRef}
      className={`fixed p-2 bg-black rounded-xl shadow-blue-500/90 shadow-md ${
        isFullScreen && "w-full h-full"
      } ${isFullScreen && "transition-all"}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="flex text-xs text-black bg-slate-800">
        <div className="flex gap-1 p-1">
          <div
            onClick={() => onClose()}
            className="p-1 bg-red-600 rounded-full cursor-pointer"
          >
            <AiOutlineClose />
          </div>
          <div
            className="p-1 bg-orange-300 rounded-full cursor-pointer"
            onClick={onToggleFullScreen}
          >
            {isFullScreen ? (
              <AiOutlineFullscreenExit />
            ) : (
              <AiOutlineFullscreen />
            )}
          </div>
        </div>
        <div className="flex-1 cursor-move"></div>
      </div>
      <div className={isFullScreen ? "" : "w-96"}>{children}</div>
    </div>
  ) : null;
}

export default Modal;
