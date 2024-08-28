import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import type {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { getLogger } from "deps.ts";
const logger = getLogger(import.meta);

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
    TTargetClass extends Constructor<
      BfModel<TProps, Record<string, unknown>, TCreationMetadata>
    >,
    TProps extends Record<string, unknown>,
    TCreationMetadata extends BfBaseModelMetadata<CreationMetadata> =
      BfBaseModelMetadata<CreationMetadata>,
  >(
    TargetClass: TTargetClass,
    targetProps: TProps,
    role?: string,
    targetCreationMetadata?: TCreationMetadata,
  ) {
    logger.debug("createTargetNode", {
      TargetClass,
      targetProps,
      targetCreationMetadata,
    });

    const targetModel = await (TargetClass as unknown as typeof BfNode)
      .__DANGEROUS__createUnattached(
        this.currentViewer,
        targetProps,
        targetCreationMetadata,
      );
    await BfEdge.createEdgeBetweenNodes(
      this.currentViewer,
      this,
      targetModel,
      role,
    );
    logger.debug("created edge", {
      sourceId: this.metadata.bfGid,
      sourceClass: this.constructor.name,
      targetId: targetModel.metadata.bfGid,
      targetClass: targetModel.constructor.name,
      role,
    });
    return targetModel as InstanceType<TTargetClass>;
  }
}
