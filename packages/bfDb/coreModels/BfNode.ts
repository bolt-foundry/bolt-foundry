import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);
const logVerbose = logger.trace;

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
  public async createTargetNode<
    TThis extends Constructor<
      BfModel<TRequiredProps, TOptionalProps, TCreationMetadata>
    >,
    TRequiredProps,
    TOptionalProps,
    TCreationMetadata extends CreationMetadata,
  >(
    this: BfNode,
    currentViewer: BfCurrentViewer,
    TargetClass: typeof BfNode,
    targetProps: TRequiredProps & Partial<TOptionalProps>,
    targetCreationMetadata: TCreationMetadata,
  ): Promise<
    InstanceType<TThis> & BfBaseModelMetadata<TCreationMetadata>
  > {
    logVerbose("createTargetNode", {
      currentViewer,
      TargetClass,
      targetProps,
      targetCreationMetadata,
    });
    const targetModel = await TargetClass.create(
      currentViewer,
      targetProps,
      targetCreationMetadata,
    );
    await BfEdge.createEdgeBetweenNodes(
      currentViewer,
      this,
      targetModel,
    );
    logVerbose("created edge", {
      sourceId: this.metadata.bfGid,
      targetId: targetModel.metadata.bfGid,
    });
    return targetModel as unknown as 
      & InstanceType<TThis>
      & BfBaseModelMetadata<TCreationMetadata>;
  }
}
