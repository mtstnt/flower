import { useCallback, useEffect } from "react";
import ReactFlow, { useNodesState, useEdgesState, Connection, addEdge } from "reactflow";
import "reactflow/dist/style.css";
import { NodeTypes } from "./nodes/Node";

const initialNodes = [
  {
    id: "1",
    type: "DeclarationNode",
    data: null,
    position: {
      x: 100,
      y: 100,
    },
  },
  {
    id: "2",
    type: "DeclarationNode",
    data: null,
    position: {
      x: 100,
      y: 150,
    },
  },
];

export default function Renderer() {
  const [nodes, setNodes, onNodesChange] = useNodesState<any>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log(connection);
      setEdges((eds) => addEdge(connection, eds));
    },
    [edges]
  );

  useEffect(() => {
    document.addEventListener(
      "flower:updateNode" as any,
      (event: CustomEvent<any>) => {
        const { id, name, value } = event.detail;
        setNodes((nds) =>
          nds.map((node) => {
            if (node.id == id) {
              node.data = {
                variableName: name,
                initialValue: value,
              };
            }
            return node;
          })
        );
      }
    );
  }, []);

  return (
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
      />
    </div>
  );
}
