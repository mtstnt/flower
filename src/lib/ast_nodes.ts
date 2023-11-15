import { Node } from "reactflow";
import { DeclarationNodeProps } from "../nodes/DeclarationNode";
import { OutputNodeProps } from "../nodes/OutputNode";
import { Nullable } from "../nodes/common";
import { IfNodeProps } from "../nodes/IfNode";
import { parse } from "./expr_parser";
import { tokenize } from "./expr_tokenizer";

export interface ASTNodeVisitor {
    onVisitedStartNode(start: ASTStartNode, state: StateObj): void
    onVisitedDeclarationNode(declaration: ASTDeclarationNode, state: StateObj): void
    onVisitedOutputNode(output: ASTOutputNode, state: StateObj): void
}

export interface StateObj {
    [key: string]: any;
}

declare const addCommands: <N extends string, T extends Record<string, any>>(
    name: N, myFunctions: T
  ) => {
    [K in (string & keyof T) as `${N}_${K}`]: T[K];
}

export abstract class ASTNode {
    public next: Nullable<ASTNode>[] = [];
    abstract validate(): boolean;

    constructor(
        public node: Node,
    ) { }
}

export class ASTStartNode extends ASTNode {
    validate(): boolean {
        return true;
    }
}

export class ASTEndNode extends ASTNode {
    validate(): boolean {
        return true;
    }
}

export class ASTIfNode extends ASTNode {
    constructor(
        public node: Node<IfNodeProps>,
    ) { super(node); }

    validate(): boolean {
        // TODO: Validate syntax.
        return true;
    }
}

export class ASTDeclarationNode extends ASTNode {
    constructor(
        public node: Node<DeclarationNodeProps>,
    ) { super(node) }

    validate(): boolean {
        return this.node.data.variableName != null;
    }
}

export class ASTOutputNode extends ASTNode {
    constructor(
        public node: Node<OutputNodeProps>,
    ) { super(node) }

    validate(): boolean {
        return this.node.data.value != null;
    }
}

export class ASTVisitor implements ASTNodeVisitor {
    onVisitedDeclarationNode(declaration: ASTDeclarationNode, state: StateObj): void {
        const { variableName, initialValue } = declaration.node.data;
        if (!declaration.validate()) {
            throw new Error("Invalid declaration!");
        }
        state[variableName!] = initialValue;
    }

    onVisitedOutputNode(output: ASTOutputNode, state: StateObj): void {
        const { value } = output.node.data;
        if (!output.validate) {
            throw new Error("Invalid output!");
        }
        // TODO: Just print the value as a variableName.
        if (state[value!] === undefined) {
            throw new Error("Variable with name of " + value! + " not found!");
        }
        alert("Printed: " + state[value!]);
    }

    onVisitedIfNode(ifNode: ASTIfNode, state: StateObj): void {
        const condition = ifNode.node.data.condition ?? "";
        const tokens = tokenize(condition);
        const conditionAst = parse(tokens);
        // const result = traverse(conditionAst, state);
    }

    onVisitedStartNode(_: ASTStartNode, __: StateObj): void {}
}
