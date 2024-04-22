import { BfModel } from "packages/bfDb/classes/BfModel.ts";

export type BfContainerRequiredProps = {
  name: string;
};

export type BfContainerOptionalProps = Record<string, unknown>;

type BfContainerCreationMetadata = Record<string, never>;

export class BfContainer<
  BfContainerChildRequiredProps extends BfContainerRequiredProps =
    BfContainerRequiredProps,
  BfContainerChildOptionalProps extends BfContainerOptionalProps =
    BfContainerOptionalProps,
  BfContainerChildCreationMetadata extends BfContainerCreationMetadata =
    BfContainerCreationMetadata,
> extends BfModel<
  BfContainerChildRequiredProps,
  BfContainerChildOptionalProps,
  BfContainerChildCreationMetadata
> {}
