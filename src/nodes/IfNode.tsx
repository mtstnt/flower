import { MouseEvent, useState } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { useSetAtom } from "jotai";
import { ModalProps, NodeType } from "../atoms/types";
import { ModalData } from "../atoms/modal";
import { Nullable } from "./common";

export type IfNodeProps = {
    condition: Nullable<string>,
};

export function IfNode(props: NodeProps<IfNodeProps>) {
  return (
    <>
      <Handle className="p-1" type="target" position={Position.Top} id="a" />
      <div
        className={
          "p-3 border rounded shadow w-[200px] bg-red-300" +
          (props.selected ? " outline outline-black outline-2" : "")
        }
      >
        {props.data.condition == null ? (
          <span className="absolute p-1 text-xs font-bold text-white bg-red-600 rounded -top-2 -right-2">
            Unset
          </span>
        ) : (
          <></>
        )}
        <h2 className="block text-lg">
            <b>If</b> <br />
            {props.data.condition ?? "-"}</h2>
        <div className="absolute -left-10 top-10">False</div>
        <div className="absolute -right-10 top-10">True</div>
      </div>

      <Handle className="p-1" type="source" id="FalsePath" position={Position.Left} />
      <Handle className="p-1" type="source" id="TruePath" position={Position.Right} />
    </>
  );
}

export function IfNodeModal({ node, modifier: { setNodes } }: ModalProps) {
  const setModal = useSetAtom(ModalData);
  const [condition, setCondition] = useState<string>(node.data?.condition ?? "");

  const onSubmit = (_: MouseEvent) => {
    setNodes((nodes: NodeType[]): NodeType[] => {
      return nodes.map((e) => {
        if (e.id == node.id) {
          return {
            ...e,
            data: {
              condition: condition,
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
          value={condition}
          onInput={(e) => setCondition(e.currentTarget.value)}
          placeholder="Condition"
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
