import type { JSX, MouseEventHandler } from "react";
import {
  DeclarationNode,
  DeclarationNodeModal,
  OnAddDeclarationNode,
} from "./DeclarationNode";
import { CanvasStateModifier } from "../atoms/types";
import { Node, Viewport } from "reactflow";
import { OnAddOutputNode, OutputNode, OutputNodeModal } from "./OutputNode";
import { StartNode } from "./StartNode";
import { EndNode } from "./EndNode";

export enum NodeTypes {
  DeclarationNode = "DeclarationNode",
  InputNode = "InputNode",
  TypeNode = "TypeNode",
  OutputNode = "OutputNode",
  StartNode = "StartNode",
  EndNode = "EndNode",
};

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

export function OnAddTypeFactory(
  type: string,
  modifier: CanvasStateModifier,
  viewport: Viewport
): MouseEventHandler {
  switch (type) {
    case "DeclarationNode":
      return OnAddDeclarationNode(modifier, viewport);
    case "OutputNode":
      return OnAddOutputNode(modifier, viewport);
  }
  return () => {};
}
