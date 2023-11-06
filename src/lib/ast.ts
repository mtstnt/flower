
/**
 * Interpreter has 2 steps:
 * - Convert the nodes and edges to a traversable.
 * - Traverses the traversable while interacting with the I/O if needed.
 */

import { Edge, Node } from "reactflow";
import { NodeTypes } from "../nodes/common";
import { ASTDeclarationNode, ASTEndNode, ASTNode, ASTOutputNode, ASTStartNode } from './ast_nodes';

export function buildPartialAst(current: ASTNode, nodeMap: Dict<Node>, edgeMap: Dict<Dict<boolean>>) {
    const currentNodeId = current.node.id;
    if (edgeMap[currentNodeId] === undefined) return current;

    const neighbours = Object.keys(edgeMap[currentNodeId]);

    for (let neighbour of neighbours) {
        const neighbourNode = nodeMap[neighbour];

        const neighbourAstNode: ASTNode = ({
            [NodeTypes.StartNode]: () => new ASTStartNode(neighbourNode),
            [NodeTypes.DeclarationNode]: () => new ASTDeclarationNode(neighbourNode),
            [NodeTypes.OutputNode]: () => new ASTOutputNode(neighbourNode),
            [NodeTypes.EndNode]: () => new ASTEndNode(neighbourNode),
        }[neighbourNode.type ?? ''])();

        current.next.push(neighbourAstNode);

        buildPartialAst(neighbourAstNode, nodeMap, edgeMap);
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

function convertIntoMaps(nodes: Node[], edges: Edge[]): { nodesMap: Dict<Node>, edgesMap: Dict<Dict<boolean>> } {
    const nodesMap: Dict<Node> = {};
    for (let node of nodes) {
        nodesMap[node.id] = node;
    }
    const edgesMap: Dict<Dict<boolean>> = {};
    for (let edge of edges) {
        if (edgesMap[edge.source] === undefined) {
            edgesMap[edge.source] = { [edge.target]: true };
        } else {
            edgesMap[edge.source][edge.target] = true;
        }
    }
    return {
        nodesMap,
        edgesMap,
    };
}
