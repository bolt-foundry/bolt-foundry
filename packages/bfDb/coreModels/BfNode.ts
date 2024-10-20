import { BfModel } from "packages/bfDb/classes/BfModel.ts";
import type {
  BfBaseModelMetadata,
  Constructor,
  CreationMetadata,
} from "packages/bfDb/classes/BfBaseModelMetadata.ts";
import { getLogger } from "packages/logger/logger.ts";
import {
  type BfCurrentViewer,
  IBfCurrentViewerInternalAdmin,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfAnyid } from "packages/bfDb/classes/BfBaseModelIdTypes.ts";
import {
  bfQueryAncestorsByClassName,
  bfQueryItemsForGraphQLConnection,
  bfSubscribeToConnectionChanges,
} from "packages/bfDb/bfDb.ts";
import type { ConnectionArguments } from "packages/graphql/deps.ts";
import { BfModelErrorClassMismatch } from "packages/bfDb/classes/BfModelError.ts";
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
    connectionArgs: unknown,
    bfGids: Array<BfAnyid> = [],
  ): Promise<
    // @ts-expect-error #techdebt on deno upgrade
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
      // @ts-expect-error #techdebt
      combinedMetadata,
      propsToQuery,
      connectionArgs,
      bfGids,
    );

    return {
      ...others,
      edges: edges.map((edge) => {
        if (edge.node.metadata.className != this.name) {
          throw new BfModelErrorClassMismatch(
            `Connection class mismatch. Got ${edge.node.metadata.className} but expected ${this.name}`,
          );
        }
        return {
          cursor: edge.cursor,
          node: new this(
            currentViewer,
            edge.node.props,
            {},
            edge.node.metadata,
            true,
          ).toGraphql(),
        };
      }),
    };
  }

  public async createTargetNode<
    TTargetClass extends Constructor<
      BfModel<TProps, Record<string, unknown>, TCreationMetadata>
    >,
    TProps extends Record<string, unknown>,
    TCreationMetadata extends Partial<BfBaseModelMetadata<CreationMetadata>> =
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
    const { BfEdge } = await import("packages/bfDb/coreModels/BfEdge.ts");
    await BfEdge.createBetweenNodes(
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

  public async queryAncestorsByClassName<
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TSourceClass extends abstract new (...args: any) => any,
  >(
    BfNodeClass: TSourceClass,
    limit: number = 10,
  ) {
    const ancestors = await bfQueryAncestorsByClassName(
      this.currentViewer.organizationBfGid,
      this.metadata.bfGid,
      BfNodeClass.name,
      limit,
    );
    logger.debug("BfNode ancestors", ancestors);
    return ancestors.map(({ props, metadata }) => {
      return new (BfNodeClass as unknown as typeof BfNode)(
        this.currentViewer,
        props,
        {},
        metadata,
        false,
      );
    }) as Array<InstanceType<TSourceClass>>;
  }

  public async querySourceInstances<
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TSourceClass extends abstract new (...args: any) => any,
  >(
    SourceClass: TSourceClass,
    props: Partial<ChildRequiredProps & ChildOptionalProps> = {},
  ) {
    const { BfEdge } = await import("packages/bfDb/coreModels/BfEdge.ts");
    return BfEdge.querySourceInstances(
      this.currentViewer,
      SourceClass,
      this.metadata.bfGid,
      props,
    );
  }

  public async queryTargetInstances<
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TTargetClass extends abstract new (...args: any) => any,
  >(
    TargetClass: TTargetClass,
    props: Partial<ChildRequiredProps & ChildOptionalProps> = {},
    edgeProps: Partial<ChildOptionalProps> = {},
  ) {
    const { BfEdge } = await import("packages/bfDb/coreModels/BfEdge.ts");
    return BfEdge.queryTargetInstances(
      this.currentViewer,
      TargetClass,
      this.metadata.bfGid,
      props,
      edgeProps,
    );
  }

  public async queryTargetsConnectionForGraphQL<
    // an actual good use of any.
    // deno-lint-ignore no-explicit-any
    TTargetClass extends abstract new (...args: any) => any,
  >(
    TargetClass: TTargetClass,
    args: ConnectionArguments,
    props: Partial<ChildRequiredProps & ChildOptionalProps> = {},
    edgeProps: Partial<ChildOptionalProps> = {},
  ) {
    const { BfEdge } = await import("packages/bfDb/coreModels/BfEdge.ts");
    return BfEdge.queryTargetsConnectionForGraphQL(
      this.currentViewer,
      TargetClass,
      this.metadata.bfGid,
      props,
      args,
      edgeProps,
    );
  }

  getConnectionSubscriptionForGraphql(targetClassName: string) {
    return bfSubscribeToConnectionChanges(
      this.metadata.bfOid,
      this.metadata.bfGid,
      targetClassName,
    );
  }

  override async delete() {
    const { BfEdge } = await import("packages/bfDb/coreModels/BfEdge.ts");
    const bfGid = this.metadata.bfGid;
    await super.delete();
    await BfEdge.deleteEdgesTouchingNode(this.currentViewer, bfGid);
  }
}
