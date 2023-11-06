import { Panel, useReactFlow, useViewport } from "reactflow";
import { CanvasStateModifier } from "../atoms/types";
import { onAddTypeFactory } from "../nodes/Node";
import { run } from "../lib/runner";
import { MouseEvent } from "react";
import { NodeTypes } from "../nodes/common";

type ToolbarProps = {
  modifier: CanvasStateModifier;
};

export default function Toolbar({ modifier }: ToolbarProps): JSX.Element {
  const viewport = useViewport();
  const { getEdges, getNodes } = useReactFlow();

  const handleRun = (_: MouseEvent) => {
    try {
      run(getNodes(), getEdges());
    } catch (e) {
      alert("Exception: " + e);
    }
  }


  return (
    <Panel position="top-left">
      <div className="flex flex-row space-x-3">
        <button
          className="p-3 bg-orange-300 rounded shadow"
          onClick={onAddTypeFactory(NodeTypes.DeclarationNode, modifier, viewport)}
        >
          + Declaration
        </button>
        <button
          className="p-3 bg-blue-400 rounded shadow"
          onClick={onAddTypeFactory(NodeTypes.OutputNode, modifier, viewport)}
        >
          + Output
        </button>
        <button
          className="p-3 text-black bg-gray-200 rounded shadow"
          onClick={handleRun}
        >
          Run
        </button>
      </div>
    </Panel>
  );
}
