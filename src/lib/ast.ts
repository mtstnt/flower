
/**
 * Interpreter has 2 steps:
 * - Convert the nodes and edges to a traversable.
 * - Traverses the traversable while interacting with the I/O if needed.
 */

import { Edge, Node } from "reactflow";
import { NodeTypes, Nullable } from "../nodes/common";
import { ASTDeclarationNode, ASTEndNode, ASTNode, ASTOutputNode, ASTStartNode } from './ast_nodes';

export function buildAst(nodes: Node[], edges: Edge[]): ASTNode {
    const { nodesMap, edgesMap } = convertIntoMaps(nodes, edges);

    const startNode = nodesMap["start"];
    let queue = [startNode.id];

    let root: Nullable<ASTNode> = null;
    let previousAstNode: Nullable<ASTNode> = null;

    while (queue.length > 0) {
        const currentNodeId = queue.pop()!;
        const currentNode = nodesMap[currentNodeId];

        // Create the node based on current type.
        const currentAstNode: ASTNode = ({
            [NodeTypes.StartNode]: () => new ASTStartNode(currentNode),
            [NodeTypes.DeclarationNode]: () => new ASTDeclarationNode(currentNode),
            [NodeTypes.OutputNode]: () => new ASTOutputNode(currentNode),
            [NodeTypes.EndNode]: () => new ASTEndNode(currentNode),
        }[currentNode.type ?? ''])();

        // Enlist all neighbours to queue (BFS)
        const neighboursList = Object.keys(edgesMap[currentNode.id] ?? {});
        for (let neighbour of neighboursList) {
            queue.unshift(neighbour);
        }

        // Find the next node.
        switch (currentNode.type!) {
            // TODO: Handle multiple-connection node.
            // case NodeTypes.IfNode: // Handle two next nodes.
            // One next node.
            default: {
                if (neighboursList.length > 1) {
                    throw new Error("A single-node source has multiple edges");
                }
                if (previousAstNode == null) {
                    previousAstNode = currentAstNode;
                    root = currentAstNode;
                } else {
                    // TODO: Make this type-safe.
                    previousAstNode.next = [currentAstNode];
                    previousAstNode = currentAstNode;
                }
            }
        }
    }

    console.log(root!);

    return root!;
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
