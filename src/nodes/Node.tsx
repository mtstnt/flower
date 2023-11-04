import type { JSX, MouseEventHandler } from "react";
import {
  DeclarationNode,
  DeclarationNodeModal,
  onAddDeclarationNode,
} from "./DeclarationNode";
import { CanvasStateModifier } from "../atoms/types";
import { Node, Viewport } from "reactflow";
import { onAddOutputNode, OutputNode, OutputNodeModal } from "./OutputNode";
import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";
import { NodeTypes } from "./common";

export const nodeTypesMap = {
  [NodeTypes.DeclarationNode]: DeclarationNode,
  [NodeTypes.OutputNode]: OutputNode,
  [NodeTypes.StartNode]: StartNode,
  [NodeTypes.EndNode]: EndNode,
};

/**
 * Get a modal component to render on the modal based on the node's `type` property.
 */
export function modalComponentFactory(
  node: Node,
  modifier: CanvasStateModifier
): JSX.Element {
  switch (node.type ?? "") {
    case "DeclarationNode":
      return <DeclarationNodeModal node={node} modifier={modifier} />;
    case "OutputNode":
      return <OutputNodeModal node={node} modifier={modifier} />;
    case "InputNode":
      return <>Input Node</>;
    case "IfNode":
      return <>If Node</>;
    case "ExpressionNode":
      return <>Expr Node</>;
  }
  return <></>;
}

export function onAddTypeFactory(
  type: string,
  modifier: CanvasStateModifier,
  viewport: Viewport
): MouseEventHandler {
  switch (type) {
    case "DeclarationNode":
      return onAddDeclarationNode(modifier, viewport);
    case "OutputNode":
      return onAddOutputNode(modifier, viewport);
  }
  return () => {};
}
