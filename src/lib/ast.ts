
/**
 * Interpreter has 2 steps:
 * - Convert the nodes and edges to a traversable.
 * - Traverses the traversable while interacting with the I/O if needed.
 */

import { Edge, Node } from "reactflow";
import { NodeTypes } from "../nodes/common";
import { ASTDeclarationNode, ASTEndNode, ASTIfNode, ASTNode, ASTOutputNode, ASTStartNode } from './ast_nodes';

function neighbourAstNodeFactory(type: keyof typeof NodeTypes, neighbourNode: Node) {
    return {
        [NodeTypes.StartNode]: () => new ASTStartNode(neighbourNode),
        [NodeTypes.DeclarationNode]: () => new ASTDeclarationNode(neighbourNode),
        [NodeTypes.OutputNode]: () => new ASTOutputNode(neighbourNode),
        [NodeTypes.EndNode]: () => new ASTEndNode(neighbourNode),
        [NodeTypes.IfNode]: () => new ASTIfNode(neighbourNode),

        // TODO: Define AST class for InputNode,
        [NodeTypes.InputNode]: () => new ASTIfNode(neighbourNode),
    }[type]();
}

export function buildPartialAst(current: ASTNode, nodeMap: Dict<Node>, edgeMap: Dict<Dict<Edge>>) {
    const currentNodeId = current.node.id;
    if (edgeMap[currentNodeId] === undefined) return current;

    const neighbours = Object.entries(edgeMap[currentNodeId]);
    if (neighbours.length <= 0) return current;

    const type = current.node.type as keyof typeof NodeTypes;
    switch (type) {
        case NodeTypes.IfNode: {
            current.next = [null, null];
            for (let i = 0; i < 2; i++) {
                const [neighbourID, neighbourEdge] = neighbours[i];
                const neighbourNode = nodeMap[neighbourID];
                const neighbourType = neighbourNode.id as keyof typeof NodeTypes;
                const neighbourASTNode = neighbourAstNodeFactory(neighbourType, neighbourNode);
                if (neighbourEdge.sourceHandle == "TruePath") {
                    current.next[0] = buildPartialAst(neighbourASTNode, nodeMap, edgeMap);
                } else {
                    current.next[1] = buildPartialAst(neighbourASTNode, nodeMap, edgeMap);
                }
            }
            break;
        }
        default: {
            console.log("im here", type, neighbours);
            const [neighbourID, _] = neighbours[0];
            const neighbourNode = nodeMap[neighbourID];
            const neighbourType = neighbourNode.id as keyof typeof NodeTypes;
            const neighbourASTNode = neighbourAstNodeFactory(neighbourType, neighbourNode);
            current.next = [buildPartialAst(neighbourASTNode, nodeMap, edgeMap)];
            break;
        }
    }
    return current;
}

export function buildAst(nodes: Node[], edges: Edge[]): ASTNode {
    const { nodesMap, edgesMap } = convertIntoMaps(nodes, edges);
    const root = new ASTStartNode(nodesMap['start']);
    return buildPartialAst(root, nodesMap, edgesMap);
}

interface Dict<T> {
    [key: string]: T;
}

function convertIntoMaps(nodes: Node[], edges: Edge[]): { nodesMap: Dict<Node>, edgesMap: Dict<Dict<Edge>> } {
    const nodesMap: Dict<Node> = {};
    for (let node of nodes) {
        nodesMap[node.id] = node;
    }
    const edgesMap: Dict<Dict<Edge>> = {};
    for (let edge of edges) {
        if (edgesMap[edge.source] === undefined) {
            edgesMap[edge.source] = { [edge.target]: edge };
        } else {
            edgesMap[edge.source][edge.target] = edge;
        }
    }
    return {
        nodesMap,
        edgesMap,
    };
}
