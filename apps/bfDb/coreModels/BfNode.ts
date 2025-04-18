import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
  type BfNodeCache,
} from "apps/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import { type BfGid, toBfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import { BfErrorNotImplemented } from "infra/BfError.ts";
import { getLogger } from "packages/logger/logger.ts";
import { storage } from "apps/bfDb/storage/storage.ts";
import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorNode.ts";
import { generateUUID } from "lib/generateUUID.ts";
import type { BfEdgeBaseProps } from "apps/bfDb/classes/BfEdgeBase.ts";

const logger = getLogger(import.meta);

export type BfMetadataNode = BfMetadataBase & {
  /** Creator ID */
  bfCid: BfGid;
  createdAt: Date;
  lastUpdated: Date;
};

/**
 * talks to the database with graphql stuff
 */
export class BfNode<
  TProps extends BfNodeBaseProps = BfNodeBaseProps,
  TMetadata extends BfMetadataBase = BfMetadataNode,
  TEdgeProps extends BfEdgeBaseProps = BfEdgeBaseProps,
> extends BfNodeBase<TProps, TMetadata, TEdgeProps> {
  override readonly relatedEdge: string = "apps/bfDb/coreModels/BfEdge.ts";
  protected _savedProps: TProps;
  protected override _props: TProps;

  static override generateMetadata<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TThis extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    metadata?: Partial<TMetadata>,
  ): TMetadata {
    const bfGid = toBfGid(generateUUID());
    const baseDefaults: BfMetadataBase = {
      bfGid: bfGid,
      bfOid: cv.bfOid,
      className: this.name,
      sortValue: this.generateSortValue(),
    };
    const nodeDefaults = {
      ...baseDefaults,
      bfCid: cv.bfGid,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
    return { ...nodeDefaults, ...metadata } as unknown as TMetadata;
  }

  static override async findX<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    id: BfGid,
    cache?: BfNodeCache,
  ) {
    logger.debug(`findX: ${this.name} ${id} ${cv}`);
    const itemFromCache = cache?.get(id);
    if (itemFromCache) {
      return itemFromCache as InstanceType<TThis>;
    }
    const itemFromDb = await storage.get(cv.bfOid, id);
    logger.debug(itemFromDb);
    if (!itemFromDb) {
      logger.debug("couldn't find item", cv.bfOid, id);
      throw new BfErrorNodeNotFound();
    }
    const item = new this(cv, itemFromDb.props as TProps, itemFromDb.metadata);
    cache?.set(id, item);
    return item as InstanceType<TThis>;
  }

  static override async query<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
    TMetadata extends BfMetadataNode = BfMetadataNode,
  >(
    this: TThis,
    cv: BfCurrentViewer,
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
      const instance = new this(cv, item.props as TProps, item.metadata);
      cache?.set(item.metadata.bfGid, instance);
      return instance as InstanceType<TThis>;
    });
  }

  constructor(
    currentViewer: BfCurrentViewer,
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
    const _item = await storage.get(this.cv.bfOid, this.metadata.bfGid);
    throw new BfErrorNotImplemented();
    // return this;
  }

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
    logger.debug(
      `queryTargets: ${this.constructor.name} -> ${TargetClass.name}`,
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
    };
    const propsQuery = Object.keys(edgeProps).length > 0 ? edgeProps : {};

    // First, let's try to get an edge directly from the database to see if it exists
    const relatedEdgeNameWithTs = this.relatedEdge.split("/").pop() as string;
    const relatedEdgeName = relatedEdgeNameWithTs.replace(".ts", "");
    logger.debug(
      `Using edge class: ${relatedEdgeName} from path: ${this.relatedEdge}`,
    );
    logger.debug(
      `Edge query metadataQuery:`,
      metadataQuery,
    );
    logger.debug(`Edge query propsQuery:`, propsQuery);
    logger.debug(
      `Related edge class: ${this.relatedEdge}, derived edge name: ${relatedEdgeName}`,
    );

    // Load the edge creation log to understand what's happening
    try {
      const createEdgeLog = await storage.query(
        { className: relatedEdgeName },
        {},
        undefined,
        "ASC",
        "sort_value",
      );
      logger.debug(
        `All ${relatedEdgeName} edges in system:`,
        createEdgeLog.slice(0, 5),
      );
    } catch (error) {
      logger.error(`Error looking up all edges:`, error);
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
      // Debug why no edges were found
      logger.debug(`No edges found, checking if edge was created properly`);

      // Let's check if the edge exists at all with this source ID
      const allEdgesFromSource = await storage.query(
        { bfSid: this.metadata.bfGid },
        {},
        undefined,
        "ASC",
        "sort_value",
      );

      logger.debug(
        `Found ${allEdgesFromSource.length} edges with just source ID`,
      );
      if (allEdgesFromSource.length > 0) {
        logger.debug(
          `Edge exists with source ID but not with props filter. First edge:`,
          allEdgesFromSource[0],
        );
      }

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
