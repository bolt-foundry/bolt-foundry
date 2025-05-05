import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
  type BfNodeCache,
  type ConcreteBfNodeBaseCtor,
} from "apps/bfDb/classes/BfNodeBase.ts";
import { type BfGid, toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import { BfErrorNotImplemented } from "infra/BfError.ts";
import { getLogger } from "packages/logger/logger.ts";
import { storage } from "apps/bfDb/storage/storage.ts";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorNode.ts";
import { generateUUID } from "lib/generateUUID.ts";
import type {
  BfEdgeBase,
  BfEdgeBaseProps,
} from "apps/bfDb/classes/BfEdgeBase.ts";
import type { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";
import type { CurrentViewer } from "apps/bfDb/classes/CurrentViewer.ts";

const logger = getLogger(import.meta);

export type BfMetadataNode = BfMetadataBase & {
  /** Creator ID */
  bfCid: BfGid;
  createdAt: Date;
  lastUpdated: Date;
};

/**
 * BfNode – concrete implementation of a database‑backed node.
 */
export class BfNode<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  TMetadata extends BfMetadataBase = BfMetadataNode,
  TEdgeProps extends BfEdgeBaseProps = BfEdgeBaseProps,
> extends BfNodeBase<TProps, TMetadata, TEdgeProps> {
  /**
   * Default edge implementation that connects **any two** nodes when a more
   * specialised edge hasn’t been defined.  Individual subclasses can override
   * this with a more specific edge type (e.g. `BfEdgeComment`).
   */

  protected _savedProps: TProps;
  protected override _props: TProps;

  /* ─────────────── GraphQL integration ─────────────── */
  static override defineGqlNode(
    def: Parameters<typeof GraphQLObjectBase.defineGqlNode>[0],
  ) {
    // Respect explicit "no GraphQL" opt‑out
    if (def === null) {
      return super.defineGqlNode(null);
    }

    // Otherwise wrap so callers still get the usual helpers
    return super.defineGqlNode((field, relation, mutation) => {
      def?.(field, relation, mutation);
    });
  }

  static override gqlSpec = this.defineGqlNode((field) => {
    field.id("id");
  });

  /* ─────────────── ID helpers ─────────────── */
  override get id(): string {
    return this.metadata.bfGid;
  }

  /* ─────────────── Metadata helpers ─────────────── */
  static override generateMetadata<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TThis extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    this: TThis,
    cv: CurrentViewer,
    metadata?: Partial<TMetadata>,
  ): TMetadata {
    const bfGid = toBfGid(generateUUID());
    const baseDefaults: BfMetadataBase = {
      bfGid,
      bfOid: cv.orgBfOid,
      className: this.name,
      sortValue: this.generateSortValue(),
    };
    const nodeDefaults = {
      ...baseDefaults,
      bfCid: cv.personBfGid,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    return { ...nodeDefaults, ...metadata } as unknown as TMetadata;
  }

  /* ─────────────── Static fetch helpers ─────────────── */
  static override async findX<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataNode,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    this: TThis,
    cv: CurrentViewer,
    id: BfGid,
    cache?: BfNodeCache,
  ) {
    logger.debug(`findX: ${this.name} ${id} ${cv}`);
    const itemFromCache = cache?.get(id);
    if (itemFromCache) {
      return itemFromCache as InstanceType<TThis>;
    }
    const itemFromDb = await storage.get(cv.orgBfOid, id);
    logger.debug(itemFromDb);
    if (!itemFromDb) {
      logger.debug("couldn't find item", cv.orgBfOid, id);
      throw new BfErrorNodeNotFound();
    }
    const Ctor = this as unknown as ConcreteBfNodeBaseCtor<TProps, TMetadata>;
    const item = new Ctor(
      cv,
      itemFromDb.props as TProps,
      itemFromDb.metadata as TMetadata,
    );
    cache?.set(id, item);
    return item as InstanceType<TThis>;
  }

  static override async query<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
    TMetadata extends BfMetadataNode = BfMetadataNode,
  >(
    this: TThis,
    cv: CurrentViewer,
    metadata: Partial<TMetadata>,
    props?: Partial<TProps>,
    bfGids?: Array<BfGid>,
    cache?: BfNodeCache,
    options: {
      useSizeLimit?: boolean;
      cursorValue?: number | string;
      maxSizeBytes?: number;
      batchSize?: number;
      totalLimit?: number;
      countOnly?: boolean;
    } = {},
  ) {
    const items = await storage.query(
      metadata,
      props,
      bfGids,
      "ASC",
      "sort_value",
      options,
    );

    return items.map((item) => {
      const Ctor = this as unknown as ConcreteBfNodeBaseCtor<TProps, TMetadata>;
      const instance = new Ctor(
        cv,
        item.props as TProps,
        item.metadata as TMetadata,
      );
      cache?.set(item.metadata.bfGid, instance);
      return instance as InstanceType<TThis>;
    });
  }

  static override async fetchRelatedClass() {
    const { BfEdge } = await import("apps/bfDb/coreModels/BfEdge.ts");
    return BfEdge as typeof BfEdgeBase;
  }

  /* ─────────────── Lifecycle ─────────────── */
  constructor(
    currentViewer: CurrentViewer,
    _props: TProps,
    metadata?: Partial<TMetadata>,
  ) {
    super(currentViewer, _props, metadata);

    this._savedProps = _props;
    this._props = { ..._props };
  }

  override get props(): TProps {
    return this._props;
  }

  override set props(newProps: Partial<TProps>) {
    this._props = { ...this._props, ...newProps };
  }

  override isDirty() {
    return JSON.stringify(this._props) !== JSON.stringify(this._savedProps);
  }

  override async save<TMetadata extends BfMetadataNode>() {
    this.metadata.lastUpdated = new Date();
    logger.debug(`Saving ${this}`, this.props, this.metadata);
    await storage.put(this.props, this.metadata as unknown as TMetadata);
    this._savedProps = this._props;
    return this;
  }

  override delete(): Promise<boolean> {
    throw new BfErrorNotImplemented();
  }

  override async load(): Promise<this> {
    const item = await storage.get(this.cv.orgBfOid, this.metadata.bfGid);
    if (!item) {
      throw new BfErrorNodeNotFound();
    }
    this._props = item.props as TProps;
    this._savedProps = this._props;
    this._metadata = item.metadata as unknown as TMetadata;
    return this;
  }

  /* ─────────────── Edge helpers ─────────────── */
  override async queryTargets<
    TTargetProps extends BfNodeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    TargetClass: TTargetClass,
    props: Partial<TTargetProps> = {},
    edgeProps: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
    options: {
      useSizeLimit?: boolean;
      cursorValue?: number | string;
      maxSizeBytes?: number;
      batchSize?: number;
      totalLimit?: number;
      countOnly?: boolean;
    } = {},
  ): Promise<Array<InstanceType<TTargetClass>>> {
    const EdgeClass = await (this.constructor as typeof BfNode)
      .fetchRelatedClass();

    logger.debug(
      `queryTargets: ${this.constructor.name} –[${EdgeClass.name}]-> ${TargetClass.name}`,
      {
        sourceId: this.metadata.bfGid,
        targetClass: TargetClass.name,
        props,
        edgeProps,
        options,
      },
    );

    // Query for edges that connect from this node to targets of the specified class
    const metadataQuery = {
      bfSid: this.metadata.bfGid,
      bfTClassName: TargetClass.name,
    } as const;
    const propsQuery = Object.keys(edgeProps).length > 0 ? edgeProps : {};

    // 🔎 Diagnostic: show the first few edges of this type in the system
    try {
      const createEdgeLog = await storage.query(
        { className: EdgeClass.name },
        {},
        undefined,
        "ASC",
        "sort_value",
      );
      logger.debug(
        `First five ${EdgeClass.name} edges in system:`,
        createEdgeLog.slice(0, 5),
      );
    } catch (error) {
      logger.error(`Error looking up edge instances:`, error);
    }

    const edges = await storage.query(
      metadataQuery,
      propsQuery,
      undefined,
      "ASC",
      "sort_value",
      options,
    );

    logger.debug(`Found ${edges.length} edges from ${this.metadata.bfGid}`);

    if (edges.length === 0) {
      return [];
    }

    // Get all target IDs from the edges and filter out any undefined values
    const targetIds = edges.map((edge) => edge.metadata.bfTid).filter((
      id,
    ): id is BfGid => id !== undefined);

    logger.debug(`Target IDs from edges:`, targetIds);

    // Query for target nodes that match the given class and properties
    const targetNodes = await TargetClass.query(
      this.cv,
      { className: TargetClass.name },
      props,
      targetIds,
      cache,
    );

    logger.debug(`Found ${targetNodes.length} target nodes`);

    return targetNodes as Array<InstanceType<TTargetClass>>;
  }
}
