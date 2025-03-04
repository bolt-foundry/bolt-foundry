import {
  type BfMetadataNode,
  BfNode,
} from "packages/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger.ts";
import {
  BfEdgeBase,
  type BfEdgeBaseProps,
  type BfMetadataEdgeBase,
} from "packages/bfDb/classes/BfEdgeBase.ts";
import type {
  BfNodeBase,
  BfNodeBaseProps,
  BfNodeCache,
} from "packages/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfGid } from "packages/bfDb/classes/BfNodeIds.ts";

const _logger = getLogger(import.meta);

export type BfEdgeProps = BfEdgeBaseProps & BfNodeBaseProps;

// Combine metadata from both BfNode (for DB) and BfEdgeBase (for edge structure)
export type BfMetadataEdge = BfMetadataNode & BfMetadataEdgeBase;

export class BfEdge<TProps extends BfEdgeProps = BfEdgeProps>
  extends BfNode<TProps, BfMetadataEdge> {
  /**
   * Generates metadata for an edge between two nodes
   *
   * @param cv - The current viewer context
   * @param sourceNode - The source node to connect from
   * @param targetNode - The target node to connect to
   * @returns Edge metadata with source and target information
   */
  static generateEdgeMetadata<
    TMetadata extends BfMetadataEdgeBase,
  >(
    cv: BfCurrentViewer,
    sourceNode: BfNodeBase,
    targetNode: BfNodeBase,
    metadata?: Partial<TMetadata>,
  ): TMetadata {
    // Generate the base metadata
    const baseMetadata = BfEdgeBase.generateEdgeMetadata(
      cv,
      sourceNode,
      targetNode,
      metadata,
    );

    // Override the className to be this class's name instead of BfEdgeBase
    return {
      ...baseMetadata,
      className: this.name,
    } as TMetadata;
  }
  static async createBetweenNodes<
    TEdgeProps extends BfEdgeBaseProps,
    TSourceProps extends BfNodeBaseProps,
    TTargetProps extends BfNodeBaseProps,
  >(
    cv: BfCurrentViewer,
    sourceNode: BfNodeBase<TSourceProps>,
    targetNode: BfNodeBase<TTargetProps>,
    props: Partial<TEdgeProps> = {},
  ): Promise<InstanceType<typeof BfEdge<TEdgeProps>>> {
    const logger = getLogger(import.meta);
    logger.debug(
      `Creating edge between ${sourceNode.constructor.name}(${sourceNode.metadata.bfGid}) -> ${targetNode.constructor.name}(${targetNode.metadata.bfGid})`,
      { props },
    );

    // Generate metadata for the edge
    const metadata = this.generateMetadata(cv, {
      bfSid: sourceNode.metadata.bfGid,
      bfTid: targetNode.metadata.bfGid,
      bfSClassName: sourceNode.metadata.className,
      bfTClassName: targetNode.metadata.className,
    } as Partial<BfMetadataEdge>);

    logger.debug(`Generated edge metadata:`, metadata);

    // Create default props if none provided
    const edgeProps = {
      // Always have a role property
      role: "default",
      ...props,
    } as unknown as TEdgeProps;

    logger.debug(`Final edge props:`, edgeProps);

    // Create the edge instance
    const edgeInstance = new this(
      cv,
      edgeProps,
      metadata,
    ) as InstanceType<typeof BfEdge<TEdgeProps>>;

    // Save the edge
    logger.debug(`Saving edge to database`);
    await edgeInstance.save<BfMetadataEdge>();
    logger.debug(
      `Edge saved successfully with ID: ${edgeInstance.metadata.bfGid}`,
    );

    return edgeInstance;
  }

  static async querySourceInstances<
    TSourceClass extends typeof BfNodeBase<TSourceProps>,
    TEdgeProps extends BfEdgeBaseProps,
    TSourceProps extends BfNodeBaseProps = BfNodeBaseProps,
  >(
    cv: BfCurrentViewer,
    SourceClass: TSourceClass,
    targetId: BfGid,
    propsToQuery: Partial<TSourceProps> = {},
    edgePropsToQuery: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TSourceClass>>> {
    // Query edges that have this target ID
    const edgeMetadata: Partial<BfMetadataEdge> = {
      bfTid: targetId,
      className: this.name,
    };

    // Find all edges that connect to the target node with matching properties
    const edges = await this.query(cv, edgeMetadata, edgePropsToQuery);

    if (edges.length === 0) {
      return [];
    }

    // Extract source IDs from the edges
    const sourceIds = edges.map((edge) => edge.metadata.bfSid);

    // Query the source nodes by their IDs
    return SourceClass.query(
      cv,
      { className: SourceClass.name },
      propsToQuery,
      sourceIds,
      cache,
    );
  }

  static querySourceEdgesForNode<TProps extends BfEdgeBaseProps>(
    node: BfNodeBase,
  ): Promise<Array<InstanceType<typeof BfEdge<TProps>>>> {
    // Query edges where the provided node is the source
    const metadataToQuery: Partial<BfMetadataEdge> = {
      bfSid: node.metadata.bfGid,
      className: this.name,
    };

    return this.query(
      node.cv,
      metadataToQuery,
      {}, // No specific props filter
    ) as Promise<Array<InstanceType<typeof BfEdge<TProps>>>>;
  }

  static async queryTargetInstances<
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
    TEdgeProps extends BfEdgeBaseProps,
    TTargetProps extends BfNodeBaseProps = BfNodeBaseProps,
  >(
    cv: BfCurrentViewer,
    TargetClass: TTargetClass,
    sourceId: BfGid,
    propsToQuery: Partial<TTargetProps> = {},
    edgePropsToQuery: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TTargetClass>>> {
    // Query edges that have this source ID
    const edgeMetadata: Partial<BfMetadataEdge> = {
      bfSid: sourceId,
      className: this.name,
    };

    // Find all edges that connect from the source node with matching properties
    const edges = await this.query(cv, edgeMetadata, edgePropsToQuery);

    if (edges.length === 0) {
      return [];
    }

    // Extract target IDs from the edges
    const targetIds = edges.map((edge) => edge.metadata.bfTid);

    // Query the target nodes by their IDs
    return TargetClass.query(
      cv,
      { className: TargetClass.name },
      propsToQuery,
      targetIds,
      cache,
    );
  }

  static queryTargetEdgesForNode(
    node: BfNodeBase,
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<typeof BfEdge>>> {
    // Query edges where the provided node is the target
    const metadataToQuery: Partial<BfMetadataEdge> = {
      bfTid: node.metadata.bfGid,
      className: this.name,
    };

    return this.query(
      node.cv,
      metadataToQuery,
      {}, // No specific props filter
      undefined, // No specific IDs filter
      cache, // Pass the cache to the query method
    ) as Promise<Array<InstanceType<typeof BfEdge>>>;
  }

  constructor(
    currentViewer: BfCurrentViewer,
    props: TProps,
    metadata?: Partial<BfMetadataEdge>,
  ) {
    super(currentViewer, props, metadata);
  }
}
