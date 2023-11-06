import type { JSX } from "react";
import { DeclarationNode, DeclarationNodeModal } from "./DeclarationNode";
import { CanvasStateModifier } from "../atoms/types";
import { Node, Viewport } from "reactflow";
import { OutputNode, OutputNodeModal } from "./OutputNode";
import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";
import { NodeTypes } from "./common";
import { IfNode, IfNodeModal } from "./IfNode";

export const nodeTypesMap = {
  [NodeTypes.DeclarationNode]: DeclarationNode,
  [NodeTypes.OutputNode]: OutputNode,
  [NodeTypes.StartNode]: StartNode,
  [NodeTypes.IfNode]: IfNode,
  [NodeTypes.EndNode]: EndNode,
};

/**
 * Get a modal component to render on the modal based on the node's `type` property.
 */
export function modalComponentFactory(
  node: Node,
  modifier: CanvasStateModifier
): JSX.Element {
  const type = node.type as keyof typeof NodeTypes;
  switch (type) {
    case NodeTypes.DeclarationNode:
      return <DeclarationNodeModal node={node} modifier={modifier} />;
    case NodeTypes.OutputNode:
      return <OutputNodeModal node={node} modifier={modifier} />;
    case NodeTypes.IfNode:
      return <IfNodeModal node={node} modifier={modifier} />;
    case NodeTypes.InputNode:
      return <>Input Node</>;
  }
  return <></>;
}

export function createNodeByType(
  type: keyof typeof NodeTypes,
  viewport: Viewport,
  id: string
): Node {
  const data = {
    [NodeTypes.StartNode]: {},
    [NodeTypes.EndNode]: {},
    [NodeTypes.DeclarationNode]: { variableName: null, initialValue: null },
    [NodeTypes.InputNode]: { variableName: null },
    [NodeTypes.OutputNode]: { value: null },
    [NodeTypes.IfNode]: { condition: null },
  }[type];

  return {
    id: id,
    type: type,
    position: { x: viewport.x / 2.0, y: viewport.y / 2.0 },
    data: data,
  };
}
