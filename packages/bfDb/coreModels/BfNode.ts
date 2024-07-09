import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";

export type BfNodeRequiredProps = Record<string, unknown>;
export type BfNodeOptionalProps = Record<string, unknown>;
export type BfNodeCreationMetadata = CreationMetadata & Record<string, unknown>;

export class BfNode<
  ChildRequiredProps extends BfNodeRequiredProps = BfNodeRequiredProps,
  ChildOptionalProps extends BfNodeOptionalProps = BfNodeOptionalProps,
  ChildCreationMetadata extends BfNodeCreationMetadata = BfNodeCreationMetadata,
> extends BfModel<
  ChildRequiredProps,
  ChildOptionalProps,
  ChildCreationMetadata
> {
}
