import { useViewport } from "reactflow";
import { CanvasStateModifier } from "../atoms/types";
import { OnAddTypeFactory } from "../nodes/Node";

type ToolbarProps = {
  modifier: CanvasStateModifier;
};

export default function Toolbar({ modifier }: ToolbarProps): JSX.Element {
  const viewport = useViewport();

  return (
    <div className="flex flex-row">
      <button
        className="p-3 bg-orange-300"
        onClick={OnAddTypeFactory("DeclarationNode", modifier, viewport)}
      >
        + Declaration
      </button>
    </div>
  );
}
