import { MouseEvent } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Connection,
  addEdge,
  useViewport,
  MiniMap,
  Controls,
  ConnectionLineType,
  MarkerType,
  SelectionMode,
  Node,
} from "reactflow";
import "reactflow/dist/style.css";
import { NodeTypes, getModalComponentByType } from "./nodes/Node";
import {
  NewDeclarationNode,
} from "./nodes/DeclarationNode";
import { useSetAtom } from "jotai";
import { ModalData } from "./atoms/modal";

export default function Renderer() {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const viewport = useViewport();
  const setModal = useSetAtom(ModalData);

  const onAddDeclarationNode = () => {
    const node = NewDeclarationNode(
      crypto.randomUUID(),
      viewport.x / 2.0,
      viewport.y / 2.0
    );
    setNodes((nds) => [...nds, node]);
  };

  const onConnect = (connection: Connection) => {
    setEdges((eds) =>
      addEdge(
        {
          ...connection,
          type: "step",
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
    const nodeModalComponent = getModalComponentByType(node, setNodes, setEdges);
    setModal({
      content: nodeModalComponent,
      isShowing: true,
    });
  };

  return (
    <>
      <button className="p-3 bg-orange-300" onClick={onAddDeclarationNode}>
        Add Declaration
      </button>
      <div className="h-[500px] border w-full">
        <div className="w-full h-full">
          <ReactFlow
            nodeTypes={NodeTypes}
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
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
