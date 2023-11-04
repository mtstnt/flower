import { MouseEvent, useState } from "react";
import { Handle, Node, NodeProps, Position, Viewport } from "reactflow";
import { useSetAtom } from "jotai";
import { CanvasStateModifier, ModalProps, NodeType } from "../atoms/types";
import { ModalData } from "../atoms/modal";
import { NodeTypes } from "./common";

export type DeclarationNodeProps = {
  variableName: Nullable<string>,
  initialValue: Nullable<string>,
};

export function newDeclarationNodeObject(id: string, x: number, y: number): Node<DeclarationNodeProps> {
  return {
    id: id,
    type: NodeTypes.DeclarationNode,
    data: {
      variableName: null,
      initialValue: null,
    },
    position: { x, y },
  };
}

export function DeclarationNode(props: NodeProps<DeclarationNodeProps>) {
  return (
    <>
      <Handle className="p-1" type="target" position={Position.Top} id="a" />
      <div
        className={
          "p-3 border rounded shadow w-[200px] bg-white" +
          (props.selected ? " outline outline-black outline-2" : "")
        }
      >
        {props.data.variableName == null ? (
          <span className="absolute p-1 text-xs font-bold text-white bg-red-600 rounded -top-2 -right-2">
            Unset
          </span>
        ) : (
          <></>
        )}
        <h2 className="block text-lg font-bold">Declaration</h2>
        <h2>Variable Name: {props.data.variableName ?? "-"} </h2>
        <p>Initial Value: {props.data.initialValue ?? "-"}</p>
      </div>
      <Handle className="p-1" type="source" id="b" position={Position.Bottom} />
    </>
  );
}

export function onAddDeclarationNode({ setNodes }: CanvasStateModifier, viewport: Viewport) {
  return () => {
    const node = newDeclarationNodeObject(
      crypto.randomUUID(),
      viewport.x / 2.0 + 20,
      viewport.y / 2.0 + 20,
    );
    setNodes((nds) => [...nds, node]);
  };
}

export function DeclarationNodeModal({ node, modifier: { setNodes } }: ModalProps) {
  const setModal = useSetAtom(ModalData);
  const [name, setName] = useState<string>(node.data?.variableName ?? "");
  const [value, setValue] = useState<string>(node.data?.initialValue ?? "");

  const onSubmit = (_: MouseEvent) => {
    setNodes((nodes: NodeType[]): NodeType[] => {
      return nodes.map((e) => {
        if (e.id == node.id) {
          return {
            ...e,
            data: {
              variableName: name,
              initialValue: value,
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
