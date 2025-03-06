import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
  type BfNodeCache,
} from "packages/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { type BfGid, toBfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { BfErrorNotImplemented } from "packages/BfError.ts";
import { getLogger } from "packages/logger.ts";
import {
  bfGetItem,
  bfPutItem,
  bfQueryItemsForGraphQLConnection,
  bfQueryItemsUnified,
} from "packages/bfDb/bfDb.ts";
import { BfErrorNodeNotFound } from "packages/bfDb/classes/BfErrorNode.ts";
import { generateUUID } from "lib/generateUUID.ts";
import type { BfEdgeBaseProps } from "packages/bfDb/classes/BfEdgeBase.ts";
import { BfMetadataNode } from "packages/bfDb/coreModels/BfNode.ts";
import type { Connection, ConnectionArguments } from "graphql-relay";

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
  override readonly relatedEdge: string = "packages/bfDb/coreModels/BfEdge.ts";
  protected _serverProps: TProps;
  protected _clientProps: Partial<TProps> = {};

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
    const itemFromDb = await bfGetItem(cv.bfOid, id);
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
    const items = await bfQueryItemsUnified(
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
    protected override _props: TProps,
    metadata?: Partial<TMetadata>,
  ) {
    super(currentViewer, _props, metadata);
    this._serverProps = _props;
  }

  override get props(): TProps {
    return { ...this._serverProps, ...this._clientProps };
  }

  override set props(props: Partial<TProps>) {
    this._clientProps = props;
  }

  override isDirty() {
    return Object.keys(this._clientProps).some((key) => {
      return this._clientProps[key] !== this._serverProps[key];
    });
  }

  override async save<TMetadata extends BfMetadataNode>() {
    logger.debug(`Saving ${this}`, this.props, this.metadata);
    await bfPutItem(this.props, this.metadata as unknown as TMetadata);
    this._serverProps = this.props;
    this._clientProps = {};
    return this;
  }

  override delete(): Promise<boolean> {
    throw new BfErrorNotImplemented();
  }

  override async load(): Promise<this> {
    const _item = await bfGetItem(this.cv.bfOid, this.metadata.bfGid);
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
      const createEdgeLog = await bfQueryItemsUnified(
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

    const edges = await bfQueryItemsUnified(
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
      const allEdgesFromSource = await bfQueryItemsUnified(
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

  override async queryTargetsConnectionForGraphql<
    TTargetProps extends BfNodeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    TargetClass: TTargetClass,
    args: ConnectionArguments,
    props: Partial<TTargetProps> = {},
    edgeProps: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<
    Connection<ReturnType<InstanceType<TTargetClass>["toGraphql"]>> & {
      count: number;
    }
  > {
    logger.debug(
      `queryTargetsConnectionForGraphql: ${this.constructor.name} -> ${TargetClass.name}`,
      { sourceId: this.metadata.bfGid, targetClass: TargetClass.name, args },
    );

    // Build edge metadata query for relationships
    const metadataQuery = {
      bfSid: this.metadata.bfGid,
      bfTClassName: TargetClass.name,
    };

    // Build props query from edgeProps if provided
    const propsQuery = Object.keys(edgeProps).length > 0 ? edgeProps : {};

    // Use bfQueryItemsForGraphQLConnection to handle cursor-based pagination efficiently at DB level
    const connection = await bfQueryItemsForGraphQLConnection(
      metadataQuery,
      propsQuery,
      args,
      [], // No explicit bfGids filter needed as we're filtering by bfSid already
    );

    // Once we have the paginated edges from the database, we need to:
    // 1. Get the target IDs from these edges
    // 2. Query for the actual target node instances
    // 3. Convert each node to its GraphQL representation
    // 4. Structure everything in Relay connection format

    // Extract target IDs from the edges
    const targetIds = connection.edges.map(
      (edge) => (edge.node.metadata.bfTid as BfGid)
    );

    // Query for target nodes
    const targetNodes = await TargetClass.query(
      this.cv,
      { className: TargetClass.name },
      props,
      targetIds,
      cache,
    );

    // Create a map of target nodes by ID for efficient lookup
    const targetNodesMap = new Map(
      targetNodes.map((node) => [node.metadata.bfGid, node]),
    );

    // Transform the connection to use actual node instances
    const transformedEdges = connection.edges.map((edge) => {
      const targetNode = targetNodesMap.get(
        edge.node.metadata.bfTid ?? "" as BfGid,
      );
      if (!targetNode) {
        logger.error(
          `Target node with ID ${edge.node.metadata.bfTid} not found`,
        );
        return null;
      }
      return {
        cursor: edge.cursor,
        node: targetNode.toGraphql(),
      };
    }).filter((edge) => edge !== null);

    // Return the connection with transformed edges
    return {
      edges: transformedEdges,
      pageInfo: connection.pageInfo,
      count: connection.count,
    };
  }
}
