import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import type { ConnectionArguments, ConnectionInterface } from "relay-runtime";
import type {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { BfEdge } from "packages/bfDb/coreModels/BfEdge.ts";
import { getLogger } from "deps.ts";
import {
  type BfCurrentViewer,
  IBfCurrentViewerInternalAdmin,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import { bfQueryItemsForGraphQLConnection } from "packages/bfDb/bfDb.ts";
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
  static async queryConnectionForGraphQL<
    TThis extends Constructor<
      BfModel<ChildRequiredProps, ChildOptionalProps, ChildCreationMetadata>
    >,
    ChildRequiredProps,
    ChildOptionalProps,
    ChildCreationMetadata extends BfNodeCreationMetadata,
  >(
    this: TThis,
    currentViewer: BfCurrentViewer,
    metadataToQuery: Partial<BfBaseModelMetadata<ChildRequiredProps>>,
    propsToQuery: Partial<ChildRequiredProps & ChildOptionalProps> = {},
    connectionArgs: ChildOptionalProps,
    bfGids: Array<BfAnyid> = [],
  ): Promise<
    ConnectionInterface<
      InstanceType<TThis> & BfBaseModelMetadata<ChildCreationMetadata>
    > & { count: number }
  > {
    const currentViewerIsAdmin = currentViewer instanceof
      IBfCurrentViewerInternalAdmin;
    const combinedMetadata = {
      ...metadataToQuery,
      // allow internal admins to query all models regardless of owner
      bfOid: currentViewerIsAdmin
        ? metadataToQuery.bfOid ?? currentViewer.organizationBfGid
        : currentViewer.organizationBfGid,
      className: this.name,
    };
    const { edges, ...others } = await bfQueryItemsForGraphQLConnection<
      ChildRequiredProps & Partial<ChildOptionalProps>,
      BfBaseModelMetadata<ChildCreationMetadata>
    >(
      combinedMetadata,
      propsToQuery,
      connectionArgs,
      bfGids,
    );

    return {
      ...others,
      // @ts-expect-error edge is anytyped but it shouldn't be... it should be a rowitem.
      edges: edges.map((edge) => ({
        cursor: edge.cursor,
        node: new this(
          currentViewer,
          edge.node.props,
          {},
          edge.node.metadata,
          true,
        ).toGraphql(),
      })),
    };
  }

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
