import { SetStateAction } from "jotai";
import { Edge, Node } from "reactflow";

type Nullable<T> = T | null;

/**
 * Wrapper type to contain canvas modifier functions and variables to be passed to needed components.
 */
export type CanvasStateModifier = {
    nodes: NodeType[],
    edges: EdgeType[],
    setNodes: SetNodeType,
    setEdges: SetEdgeType,
}

export type ModalDataType = {
    data?: Nullable<any>,
    content: Nullable<JSX.Element>,
    isShowing: boolean,
};

export type SetNodeType = React.Dispatch<SetStateAction<NodeType[]>>;
export type SetEdgeType = React.Dispatch<SetStateAction<EdgeType[]>>;

// Types for the appropriate Node and Edge type from setStates.
export type NodeType = Node<any, string|undefined>;
export type EdgeType = Edge<any>;

// ModalProps has the functionalities to manage the state of the Canvas.
export type ModalProps = {
    node: Node,
    setNodes: SetNodeType,
    setEdges: SetEdgeType,
};
