import { MouseEvent, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useSetAtom } from "jotai";
import { ModalData, ModalProps } from "../atoms/modal";

function DeclarationNodeModal({ nodeId }: ModalProps) {
  const setModal = useSetAtom(ModalData);
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");

  const onSubmit = () => {
    document.dispatchEvent(
      new CustomEvent("flower:updateNode", {
        bubbles: true,
        cancelable: false,
        detail: {
          id: nodeId,
          name: name,
          value: value,
        },
      })
    );
    setModal({
      content: null,
      isShowing: false,
    })
  };

  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Variable Declaration</h3>
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          value={name}
          onInput={(e) => setName(e.currentTarget.value)}
          placeholder="Variable Name"
          className="p-2 border border-black rounded"
        />
        <input
          type="text"
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
          placeholder="Initial Value"
          className="p-2 border border-black rounded"
        />
        <button
          onClick={onSubmit}
          className="p-2 bg-blue-300 rounded hover:cursor-pointer hover:bg-blue-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default function DeclarationNode(props: NodeProps) {
  const setModal = useSetAtom(ModalData);
  const onShowContextMenu = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setModal({
      content: <DeclarationNodeModal nodeId={props.id} />,
      isShowing: true,
    });
  };

  return (
    <>
      <Handle type="target" position={Position.Top} id="a" />
      <div
        className="p-3 border rounded shadow min-w-[15rem]"
        onContextMenu={onShowContextMenu}
      >
        {props.data?.variableName == null ? (
          <span className="absolute p-1 text-xs font-bold text-white bg-red-600 rounded -top-2 -right-2">
            Unset
          </span>
        ) : (
          <></>
        )}
        <h2 className="block text-lg font-bold">Variable Declaration</h2>
        <h2>Variable Name: {props.data?.variableName ?? "Unset"} </h2>
        <p>Initial Value: {props.data?.initialValue ?? "No initial value"}</p>
      </div>
      <Handle type="source" id="b" position={Position.Bottom} />
    </>
  );
}
