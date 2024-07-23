import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfGid, BfSid, BfTid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";

export type BfEdgeRequiredProps = Record<string, never>;

export type BfEdgeOptionalProps = {
  action?: string;
};

type EdgeCreationMetadata = CreationMetadata & {
  bfTid: BfTid | BfGid;
  bfSid: BfSid | BfGid;
};


export class BfEdge<
  ChildRequiredProps extends BfEdgeRequiredProps = BfEdgeRequiredProps,
  ChildOptionalProps extends BfEdgeOptionalProps = Record<string, unknown>,
> extends BfNode<
  ChildRequiredProps,
  ChildOptionalProps,
  EdgeCreationMetadata
> {
  __typename = "BfEdge";

}
