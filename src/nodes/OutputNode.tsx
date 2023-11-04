import { MouseEvent, useState } from "react";
import { Handle, Node, NodeProps, Position, Viewport } from "reactflow";
import { useSetAtom } from "jotai";
import { CanvasStateModifier, ModalProps, NodeType } from "../atoms/types";
import { ModalData } from "../atoms/modal";

export type OutputNodeProps = {
    value: string | null,
};

export function newOutputNode(id: string, x: number, y: number): Node<OutputNodeProps> {
  return {
    id: id,
    type: "OutputNode",
    data: {
        value: null,
    },
    position: { x, y },
  };
}

export function OutputNode(props: NodeProps<OutputNodeProps>) {
  return (
    <>
      <Handle className="p-1" type="target" position={Position.Top} id="a" />
      <div
        className={
          "p-3 border rounded shadow w-[200px] bg-blue-400" +
          (props.selected ? " outline outline-black outline-2" : "")
        }
      >
        {props.data.value == null ? (
          <span className="absolute p-1 text-xs font-bold text-white bg-red-600 rounded -top-2 -right-2">
            Unset
          </span>
        ) : (
          <></>
        )}
        <h2 className="block text-lg font-bold">Output</h2>
        <h2>Value: {props.data.value ?? "-"} </h2>
      </div>
      <Handle className="p-1" type="source" id="b" position={Position.Bottom} />
    </>
  );
}

export function onAddOutputNode({ setNodes }: CanvasStateModifier, viewport: Viewport) {
  return () => {
    const node = newOutputNode(
      crypto.randomUUID(),
      viewport.x,
      viewport.y
    );
    setNodes((nds) => [...nds, node]);
  };
}

export function OutputNodeModal({ node, modifier: { setNodes } }: ModalProps) {
  const setModal = useSetAtom(ModalData);
  const [value, setValue] = useState<string>(node.data?.initialValue ?? "");

  const onSubmit = (_: MouseEvent) => {
    setNodes((nodes: NodeType[]): NodeType[] => {
      return nodes.map((e) => {
        if (e.id == node.id) {
          return {
            ...e,
            data: {
              value: value,
            },
          };
        }
        return e;
      });
    });
    setModal({
      content: null,
      isShowing: false,
    });
  };

  return (
    <div>
      <h3 className="mb-5 text-xl font-bold">Declaration</h3>
      <div className="flex flex-col space-y-5">
        <input
          type="text"
          value={value}
          onInput={(e) => setValue(e.currentTarget.value)}
          placeholder="Value"
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
