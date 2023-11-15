import { Panel, useReactFlow, useViewport } from "reactflow";
import { createNodeByType } from "../nodes/Node";
import { run } from "../lib/runner";
import { MouseEvent } from "react";
import { NodeTypes } from "../nodes/common";
import { CanvasStateModifier } from "../atoms/types";
import { tokenize } from "../lib/expr_tokenizer";

export type ToolbarProps = {
  modifier: CanvasStateModifier,
}

export default function Toolbar({ modifier }: ToolbarProps): JSX.Element {
  const viewport = useViewport();
  const { setNodes } = modifier;
  const { getEdges, getNodes } = useReactFlow();

  const handleRun = (_: MouseEvent) => {
    // try {
      console.log(tokenize("a&&b||(c&&d) + 10"));
      run(getNodes(), getEdges());
    // } catch (e) {
    //   alert("Exception: " + e);
    // }
  };

  const handleAddNode = (type: keyof typeof NodeTypes) => {
    return (_: MouseEvent) => {
      const node = createNodeByType(type, viewport, crypto.randomUUID());
      setNodes((nds) => [...nds, node]);
    };
  };

  return (
    <Panel position="top-left">
      <div className="flex flex-row space-x-3">
        <button
          className="p-3 bg-orange-300 rounded shadow"
          onClick={handleAddNode(NodeTypes.DeclarationNode)}
        >
          + Declaration
        </button>
        <button
          className="p-3 bg-blue-400 rounded shadow"
          onClick={handleAddNode(NodeTypes.OutputNode)}
        >
          + Output
        </button>
        <button
          className="p-3 bg-red-300 rounded shadow"
          onClick={handleAddNode(NodeTypes.IfNode)}
        >
          + If
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
