import type { JSX } from 'react';
import { DeclarationNode, DeclarationNodeModal } from "./DeclarationNode";
import { SetEdgeType, SetNodeType } from '../atoms/types';
import { Node } from 'reactflow';

export const NodeTypes = {
    DeclarationNode: DeclarationNode,
}

// Get a modal component to render on the modal based on the node's `type` property.
export function getModalComponentByType(
    node: Node,
    setNodes: SetNodeType,
    setEdges: SetEdgeType,
): JSX.Element {
    switch (node.type ?? "") {
        case "DeclarationNode":
            return <DeclarationNodeModal node={node} setNodes={setNodes} setEdges={setEdges} />;
        case "InputNode": return <>Input Node</>;
        case "IfNode": return <>If Node</>;
        case "ExpressionNode": return <>Expr Node</>;
    }
    return <></>
}
