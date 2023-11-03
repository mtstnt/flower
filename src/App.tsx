import { MouseEvent } from "react";
import Renderer from "./Renderer";
import { ModalData } from "./atoms/modal";
import Modal from "./components/Modal";
import { useAtom } from "jotai";

export default function App() {
  const [modal, setModal] = useAtom(ModalData);
  const onCloseModal = (_: MouseEvent) => {
    setModal({
      content: null,
      isShowing: false,
    });
  }
  return (
    <div id="main" onClick={onCloseModal}>
      <Modal content={modal.content} visible={modal.isShowing} />
      <div className="container w-8/12 mx-auto">
        <h1 className="text-3xl font-bold">Flower</h1>
        <Renderer />
      </div>
    </div>
  );
}
