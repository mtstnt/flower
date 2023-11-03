import { MouseEvent } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  MiniMap,
  Controls,
  ConnectionLineType,
  MarkerType,
  SelectionMode,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { nodeTypesMap, modalComponentFactory } from "./nodes/Node";
import { useSetAtom } from "jotai";
import { ModalData } from "./atoms/modal";
import Toolbar from "./components/Toolbar";
import { CanvasStateModifier } from "./atoms/types";

export default function Renderer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const setModal = useSetAtom(ModalData);

  const modifier: CanvasStateModifier = { setNodes, setEdges, nodes, edges };

  const onConnect = (connection: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          type: "step",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 50,
            height: 50,
          },
        },
        eds
      )
    );
  };

  const onNodeContextMenu = (event: MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    const nodeModalComponent = modalComponentFactory(node, modifier);
    setModal({
      content: nodeModalComponent,
      isShowing: true,
    });
  };

  return (
    <>
      <div className="w-full h-screen border">
        <div className="w-full h-full">
          <ReactFlow
            nodeTypes={nodeTypesMap}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            zoomOnScroll={false}
            panOnScroll={true}
            panOnDrag={false}
            connectionLineType={ConnectionLineType.Step}
            selectionMode={SelectionMode.Partial}
            onNodeContextMenu={onNodeContextMenu}
            onEdgeClick={() => {}}
            onNodeClick={() => {}}
            fitView
          >
            <Toolbar modifier={modifier} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
