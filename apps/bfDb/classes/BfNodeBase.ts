import { generateNodeMetadata } from "apps/bfDb/utils/metadata.ts";
import {
  connectionFromNodes,
  type GraphqlNode,
  toGraphqlFromNode,
} from "apps/bfDb/graphql/helpers.ts";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorNode.ts";
import type { BfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import type { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { getLogger } from "packages/logger/logger.ts";
import type { JSONValue } from "apps/bfDb/bfDb.ts";
import { BfErrorNotImplemented } from "infra/BfError.ts";
import type {
  BfEdgeBase,
  BfEdgeBaseProps,
} from "apps/bfDb/classes/BfEdgeBase.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";
import {
  defineGqlNode,
  type GqlNodeSpec,
} from "apps/bfDb/graphql/builder/builder.ts";
import { generateUUID } from "lib/generateUUID.ts";

const logger = getLogger(import.meta);

export type BfNodeBaseProps = Record<string, JSONValue>;

export type BfMetadataBase = {
  /** Global ID */
  bfGid: BfGid;
  bfOid: BfGid;
  className: string;
  sortValue: number;
  lastUpdated?: Date;
};

export type BfNodeCache<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  T extends typeof BfNodeBase<TProps> = typeof BfNodeBase,
> = Map<
  BfGid | string,
  InstanceType<T>
>;

export class BfNodeBase<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  TMetadata extends BfMetadataBase = BfMetadataBase,
  TEdgeProps extends BfEdgeBaseProps = BfEdgeBaseProps,
> {
  static get __typename() {
    return this.name;
  }
  readonly __typename = (this.constructor as typeof BfNodeBase).__typename;

  private _id?: string;

  get id(): string {
    return this._id ?? (this._id = generateUUID());
  }

  protected _metadata: TMetadata;
  readonly relatedEdge: string = "apps/bfDb/classes/BfEdgeBase.ts";

  readonly _currentViewer: BfCurrentViewer;

  static defineGqlNode(
    ...args: Parameters<typeof defineGqlNode>
  ) {
    const defOrNull = args[0] as (typeof args)[0] | undefined;
    if (defOrNull === null) {
      this.gqlSpec = undefined;
      return undefined;
    }

    const Parent = Object.getPrototypeOf(this) as typeof BfNodeBase;

    if (typeof defOrNull === "function") {
      const spec = defineGqlNode(defOrNull);

      // Ensure 'implements' is an array
      spec.implements = spec.implements ?? [];

      // Include parent's spec if available
      if (Parent?.gqlSpec) {
        spec.implements.push(Parent.__typename);
      }

      this.gqlSpec = spec;
      return spec;
    }

    // Inherit gqlSpec from parent if not explicitly defined
    if (!this.gqlSpec && Parent?.gqlSpec) {
      const spec = defineGqlNode(() => {});
      spec.implements = [Parent.__typename];
      this.gqlSpec = spec;
    }

    return this.gqlSpec;
  }
  static gqlSpec?: GqlNodeSpec | null | undefined = this.defineGqlNode(
    (field) => {
      field.id("id");
    },
  );

  /** Coerce `undefined` → `null` so tests see a stable sentinel value */
  static {
    if (
      Object.prototype.hasOwnProperty.call(this, "gqlSpec") &&
      this.gqlSpec === undefined
    ) {
      // --> tells the test "GraphQL is turned off for this type"
      this.gqlSpec = null as never;
    }
  }

  static generateSortValue() {
    return Date.now();
  }

  static generateMetadata<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TThis extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    metadata: Partial<TMetadata> = {},
  ): TMetadata {
    return generateNodeMetadata(cv, this.name, {
      sortValue: this.generateSortValue(),
      ...metadata,
    }) as TMetadata;
  }

  static findX<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    _cv: BfCurrentViewer,
    _id: BfGid,
    _cache?: BfNodeCache,
  ): Promise<InstanceType<TThis>> {
    throw new BfErrorNotImplemented("Not implemented");
  }

  static query<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    this: TThis,
    _cv: BfCurrentViewer,
    _metadata: Partial<BfMetadataBase>,
    _props: Partial<TProps>,
    _bfGids: Array<BfGid>,
    _cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TThis>>> {
    throw new BfErrorNotImplemented();
  }

  static async find<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    id: BfGid,
    cache?: BfNodeCache,
  ): Promise<InstanceType<TThis> | null> {
    const cachedItem = cache?.get(id);
    if (cachedItem) {
      return cachedItem as InstanceType<TThis>;
    }
    try {
      const result = await this.findX(cv, id, cache) as InstanceType<TThis>;
      if (result) {
        if (cache) {
          cache.set(id, result);
        }
        return result;
      }
    } catch (e) {
      if (e instanceof BfErrorNodeNotFound) {
        logger.debug(`Node not found: ${id}`);
      } else {
        throw e;
      }
    }
    return null;
  }

  static async __DANGEROUS__createUnattached<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TThis extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    props: TProps,
    metadata?: Partial<TMetadata>,
    cache?: BfNodeCache,
  ): Promise<InstanceType<TThis>> {
    logger.debug(
      `Creating unattached ${this.name} with props ${JSON.stringify(props)}`,
    );
    const newNode = new this(cv, props, metadata) as InstanceType<TThis>;
    await newNode.beforeCreate();
    await newNode.save();
    await newNode.afterCreate();
    logger.debug(`Created ${newNode}`);
    cache?.set(newNode.metadata.bfGid, newNode);
    return newNode;
  }

  constructor(
    currentViewer: BfCurrentViewer,
    protected _props: TProps,
    metadata?: Partial<TMetadata>,
  ) {
    this._metadata = (this.constructor as typeof BfNodeBase).generateMetadata(
      currentViewer,
      metadata,
    );
    this._currentViewer = currentViewer;
  }

  get cv(): BfCurrentViewer {
    return this._currentViewer;
  }

  get metadata(): TMetadata {
    return this._metadata;
  }

  get props(): TProps {
    return this._props;
  }

  set props(props: TProps) {
    this._props = props;
  }

  isDirty(): boolean {
    return false;
  }

  toGraphql(): GraphqlNode {
    return toGraphqlFromNode(this as unknown as BfNodeBase);
  }

  toString() {
    return `${this.constructor.name}#${this.metadata.bfGid}⚡️${this.metadata.bfOid}`;
  }

  save(): Promise<this> {
    throw new BfErrorNotImplemented();
  }
  delete(): Promise<boolean> {
    throw new BfErrorNotImplemented();
  }
  load(): Promise<this> {
    throw new BfErrorNotImplemented();
  }

  async createTargetNode<
    TTargetProps extends BfNodeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    TargetClass: TTargetClass,
    targetProps: TTargetProps,
    metadata?: Partial<BfMetadataBase>,
    edgeProps: Partial<TEdgeProps> = {},
  ): Promise<InstanceType<TTargetClass>> {
    const logger = getLogger(import.meta);
    logger.debug(
      `Creating target node ${TargetClass.name} from ${this.constructor.name}`,
    );

    const targetNode = await TargetClass.__DANGEROUS__createUnattached(
      this.cv,
      targetProps,
      metadata,
    );

    logger.debug(`Target node created with ID: ${targetNode.metadata.bfGid}`);

    const relatedEdgeNameWithTs = this.relatedEdge.split("/").pop() as string;
    const relatedEdgeName = relatedEdgeNameWithTs.replace(".ts", "");
    logger.debug(
      `Using edge class: ${relatedEdgeName} from path: ${this.relatedEdge}`,
    );

    const bfEdgeImport = await import(this.relatedEdge);
    const BfEdgeClass = bfEdgeImport[relatedEdgeName] as typeof BfEdgeBase;

    logger.debug(`Creating edge with props:`, edgeProps);
    const createdEdge = await BfEdgeClass.createBetweenNodes(
      this.cv,
      this,
      targetNode,
      edgeProps,
    );

    logger.debug(
      `Edge created: ${createdEdge.metadata.bfGid} from ${this.metadata.bfGid} to ${targetNode.metadata.bfGid} with props:`,
      createdEdge.props,
    );

    return targetNode as InstanceType<TTargetClass>;
  }

  querySources<
    TSourceProps extends BfNodeBaseProps,
    TSourceClass extends typeof BfNodeBase<TSourceProps>,
  >(
    _SourceClass: TSourceClass,
    _props?: Partial<TSourceProps>,
  ): Promise<Array<InstanceType<TSourceClass>>> {
    throw new BfErrorNotImplemented();
  }

  async queryTargets<
    TTargetProps extends BfNodeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    TargetClass: TTargetClass,
    props: Partial<TTargetProps> = {},
    edgeProps: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TTargetClass>>> {
    const relatedEdgeNameWithTs = this.relatedEdge.split("/").pop() as string;
    const relatedEdgeName = relatedEdgeNameWithTs.replace(".ts", "");
    const bfEdgeImport = await import(this.relatedEdge);
    const BfEdgeClass = bfEdgeImport[relatedEdgeName] as typeof BfEdgeBase;

    return BfEdgeClass.queryTargetInstances(
      this.cv,
      TargetClass,
      this.metadata.bfGid,
      props,
      edgeProps,
      cache,
    );
  }

  async queryTargetsConnectionForGraphql<
    TTargetProps extends BfNodeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    TargetClass: TTargetClass,
    args: ConnectionArguments,
    props: Partial<TTargetProps> = {},
    edgeProps: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<Connection<GraphqlNode>> {
    const targets = await this.queryTargets(
      TargetClass,
      props,
      edgeProps,
      cache,
    );
    const gNodes = targets.map((n) => n.toGraphql());
    return connectionFromNodes(gNodes, args);
  }

  beforeCreate(): Promise<void> | void {}
  afterCreate(): Promise<void> | void {}
}
