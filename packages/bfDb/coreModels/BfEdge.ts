import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import {
  BfGid,
  BfPid,
  BfTid,
} from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfModelErrorNotImplemented } from "packages/bfDb/classes/BfModelError.ts";

export type BfEdgeRequiredProps = Record<string, never>;

export type BfEdgeOptionalProps = {
  action?: string;
};

type AssocCreationMetadata = CreationMetadata & {
  bfTid: BfTid | BfGid;
  bfPid: BfPid | BfGid;
};

export class BfEdge<
  ChildRequiredProps extends BfEdgeRequiredProps = BfEdgeRequiredProps,
  ChildOptionalProps extends BfEdgeOptionalProps = Record<string, unknown>,
> extends BfNode<
  ChildRequiredProps,
  ChildOptionalProps,
  AssocCreationMetadata
> {
  protected static isSorted = true;
  __typename = "BfEdge";

  static findAllForParent(_currentViewer: BfCurrentViewer, _bfPid: BfPid) {
    throw new BfModelErrorNotImplemented("findAllForParent");
  }

  static findAllForTarget(_currentViewer: BfCurrentViewer, _bfTid: BfTid) {
    throw new BfModelErrorNotImplemented("findAllForTarget");
  }
}
