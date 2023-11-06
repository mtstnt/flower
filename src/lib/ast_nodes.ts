import { Node } from "reactflow";
import { DeclarationNodeProps } from "../nodes/DeclarationNode";
import { OutputNodeProps } from "../nodes/OutputNode";
import { Nullable } from "../nodes/common";

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

type NextConnectionType = {
    next: Nullable<ASTNode>,
} | {
    next0: Nullable<ASTNode>,
    next1: Nullable<ASTNode>,
}

export abstract class ASTNode {
    public next: ASTNode[] = [];
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

    onVisitedStartNode(_: ASTStartNode, __: StateObj): void {}
}
