import { ReactNode } from "react";

function Modal({
  visible,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className={`transition-all max-h-screen top-0 left-0 right-0 bottom-0 fixed z-40 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="h-full bg-black">{children}</div>
    </div>
  );
}

export default Modal;
