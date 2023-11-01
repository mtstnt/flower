import { useSetAtom } from "jotai";
import { ModalData } from "../atoms/modal";

export default function Modal({ visible, content }: any) {
  const setModal = useSetAtom(ModalData);
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute z-50 w-10/12 p-5 -translate-x-1/2 -translate-y-1/2 bg-gray-100 border rounded shadow sm:w-5/12 top-1/2 left-1/2"
      style={{ display: visible ? "inherit" : "none" }}
    >
      <button
        onClick={() => setModal({ content: null, isShowing: false })}
        className="absolute top-5 right-5"
      >
        &#10060;
      </button>
      {content}
    </div>
  );
}
