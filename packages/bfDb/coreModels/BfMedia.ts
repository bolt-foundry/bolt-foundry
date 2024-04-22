import { BfModel } from "packages/bfDb/classes/BfModel.ts";

export type BfMediaRequiredProps = {
  name: string;
};
export type BfMediaOptionalProps = Record<string, unknown>;

export class BfMedia<
  ChildRequiredProps extends BfMediaRequiredProps = BfMediaRequiredProps,
  ChildOptionalProps extends BfMediaOptionalProps = BfMediaOptionalProps,
> extends BfModel<ChildRequiredProps, ChildOptionalProps> {
  __typename = "BfMedia";
  protected static isSorted = true;
}
