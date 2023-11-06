export const NodeTypes = {
    DeclarationNode: "DeclarationNode",
    InputNode: "InputNode",
    OutputNode: "OutputNode",
    StartNode: "StartNode",
    EndNode: "EndNode",
    IfNode: "IfNode",
} as const;

export type Nullable<T> = T | null;
