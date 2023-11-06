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

const initialNodes: Node[] = [
  {
    id: "start",
    data: null,
    position: { x: 0, y: 0 },
    type: "StartNode",
    draggable: true,
    deletable: false,
    focusable: false,
  },
];

export default function Renderer() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const setModal = useSetAtom(ModalData);

  const modifier: CanvasStateModifier = { setNodes, setEdges, nodes, edges };

  const onConnect = (connection: Connection) => {
    const source = connection.source;
    if (connection.sourceHandle == null) {
      setEdges((eds) => {
        eds = eds.filter(e => e.source != source)
        return addEdge(
          {
            ...connection,
            type: "step",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 50,
              height: 50,
            },
            deletable: true,
          },
          eds
        )
      });
    } else {
      setEdges((eds) => {
        return addEdge(
          {
            ...connection,
            type: "step",
            animated: true,
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 50,
              height: 50,
            },
            deletable: true,
          },
          eds
        )
      });
    }
  };

  const onNodeContextMenu = (event: MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    const modalComp = modalComponentFactory(node, modifier);
    setModal({
      content: modalComp,
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
            connectionLineType={ConnectionLineType.Step}
            selectionMode={SelectionMode.Partial}
            onNodeContextMenu={onNodeContextMenu}
            fitView>
            <Toolbar modifier={modifier} />
            <MiniMap />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </>
  );
}
