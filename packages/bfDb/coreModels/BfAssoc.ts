import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import { CreationMetadata } from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfPid, BfTid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfModelErrorNotImplemented } from "packages/bfDb/classes/BfModelError.ts";

export type BfAssocRequiredProps = {
  action: string;
};

type AssocCreationMetadata = CreationMetadata & {
  bfTid: BfTid;
  bfPid: BfPid;
};

export class BfAssoc<
  ChildRequiredProps extends BfAssocRequiredProps = BfAssocRequiredProps,
  ChildOptionalProps = Record<string, unknown>,
> extends BfModel<
  ChildRequiredProps,
  ChildOptionalProps,
  AssocCreationMetadata
> {
  protected static isSorted = true;
  __typename = "BfAssoc";

  static findAllForParent(_currentViewer: BfCurrentViewer, _bfPid: BfPid) {
    throw new BfModelErrorNotImplemented("findAllForParent");
  }

  static findAllForTarget(_currentViewer: BfCurrentViewer, _bfTid: BfTid) {
    throw new BfModelErrorNotImplemented("findAllForTarget");
  }
}
