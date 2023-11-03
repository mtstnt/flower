import { Panel, useViewport } from "reactflow";
import { CanvasStateModifier } from "../atoms/types";
import { OnAddTypeFactory } from "../nodes/Node";

type ToolbarProps = {
  modifier: CanvasStateModifier;
};

export default function Toolbar({ modifier }: ToolbarProps): JSX.Element {
  const viewport = useViewport();

  return (
    <Panel position="top-left">
      <div className="flex flex-row space-x-3">
        <button
          className="p-3 bg-orange-300 rounded shadow"
          onClick={OnAddTypeFactory("DeclarationNode", modifier, viewport)}
        >
          + Declaration
        </button>
        <button
          className="p-3 bg-orange-300 rounded shadow"
          onClick={OnAddTypeFactory("DeclarationNode", modifier, viewport)}
        >
          + Declaration
        </button>
        <button
          className="p-3 bg-orange-300 rounded shadow"
          onClick={OnAddTypeFactory("DeclarationNode", modifier, viewport)}
        >
          + Declaration
        </button>
      </div>
    </Panel>
  );
}
