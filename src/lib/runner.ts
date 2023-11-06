import { Edge, Node } from "reactflow";
import { buildAst } from "./ast";
import { ASTDeclarationNode, ASTNode, ASTOutputNode, ASTStartNode, ASTVisitor } from "./ast_nodes";
import { NodeTypes, Nullable } from "../nodes/common";

export function run(nodes: Node[], edges: Edge[]): void {
    const ast = buildAst(nodes, edges);
    const state = {};
    const visitor = new ASTVisitor();

    console.log(ast);

    let current: Nullable<ASTNode> = ast;
    while (current != null) {
        switch (current.node.type) {
            case NodeTypes.DeclarationNode:
                visitor.onVisitedDeclarationNode(current as ASTDeclarationNode, state);
                break;
            case NodeTypes.OutputNode:
                visitor.onVisitedOutputNode(current as ASTOutputNode, state);
                break;
            case NodeTypes.StartNode:
                visitor.onVisitedStartNode(current as ASTStartNode, state);
                break;
            default:
        }
        current = current.next.length == 0 ? null : current.next[0];
    }
}
