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
import { getLogger } from "packages/logger.ts";
import type { BfGid } from "packages/bfDb/classes/BfNodeIds.ts";

const _logger = getLogger(import.meta);

export type BfEdgeInMemoryProps = BfEdgeBaseProps;
export type BfMetadataEdgeInMemory = BfMetadataEdgeBase;

/**
 * BfEdgeInMemory: In-memory implementation of edges between nodes
 * Useful for testing or simple in-memory operations
 */
export class BfEdgeInMemory<
  TProps extends BfEdgeInMemoryProps = BfEdgeInMemoryProps,
  TMetadata extends BfMetadataEdgeInMemory = BfMetadataEdgeInMemory,
> extends BfEdgeBase<TProps, TMetadata> {
  // In-memory storage for edges
  private static inMemoryEdges: Map<string, BfEdgeInMemory> = new Map();

  /**
   * Creates an edge between two nodes and stores it in memory
   *
   * @param cv - The current viewer context
   * @param sourceNode - The source node to connect from
   * @param targetNode - The target node to connect to
   * @param role - Optional role/label for the edge relationship
   * @returns A new BfEdgeInMemory instance representing the edge
   */
  static override async createBetweenNodes<
    T extends typeof BfEdgeInMemory = typeof BfEdgeInMemory,
    S extends BfNodeBase = BfNodeBase,
    U extends BfNodeBase = BfNodeBase,
  >(
    this: T,
    cv: BfCurrentViewer,
    sourceNode: S,
    targetNode: U,
    role = "",
  ): Promise<InstanceType<T>> {
    // Use the superclass implementation to create the edge
    const edge = await super.createBetweenNodes(
      cv,
      sourceNode,
      targetNode,
      role,
    ) as InstanceType<T>;

    // Store the edge in memory using a composite key of source and target IDs
    const key =
      `${sourceNode.metadata.bfGid}-${targetNode.metadata.bfGid}-${role}`;
    this.inMemoryEdges.set(key, edge as unknown as BfEdgeInMemory);

    return edge;
  }

  override save(): Promise<this> {
    // For in-memory implementation, just return this instance
    // No persistence needed as everything is already in memory
    return Promise.resolve(this);
  }

  override delete() {
    // Find the key for this edge
    for (const [key, edge] of BfEdgeInMemory.inMemoryEdges.entries()) {
      if (edge.metadata.bfGid === this.metadata.bfGid) {
        // Remove the edge from memory
        BfEdgeInMemory.inMemoryEdges.delete(key);
        return Promise.resolve(true);
      }
    }
    return Promise.resolve(false);
  }

  override load() {
    // For in-memory implementation, nothing needs to be loaded
    // The edge is already in memory
    return Promise.resolve(this);
  }

  /**
   * Gets all in-memory edges
   *
   * @returns Array of all edges stored in memory
   */
  static getAllInMemoryEdges(): BfEdgeInMemory[] {
    return Array.from(this.inMemoryEdges.values());
  }

  /**
   * Clears all in-memory edges
   */
  static clearInMemoryEdges(): void {
    this.inMemoryEdges.clear();
  }

  /**
   * Queries source instances connected to a target node.
   *
   * @param cv - The current viewer context
   * @param SourceClass - The class of the source nodes to query
   * @param targetId - The ID of the target node
   * @param propsToQuery - Optional properties to filter the query
   * @param edgePropsToQuery - Optional edge properties to filter the query
   * @returns Promise resolving to an array of source instances
   */
  /**
   * Queries edges where a node is the source.
   *
   * @param node - The source node to find edges for
   * @returns Promise resolving to an array of edges where the node is the source
   */
  static override querySourceEdgesForNode<TProps extends BfEdgeBaseProps>(
    node: BfNodeBase,
  ): Promise<Array<InstanceType<typeof BfEdgeInMemory<TProps>>>> {
    // Filter edges where the given node is the source
    const edges = Array.from(this.inMemoryEdges.values()).filter(
      (edge) => edge.metadata.bfSid === node.metadata.bfGid,
    );

    return Promise.resolve(
      edges as Array<InstanceType<typeof BfEdgeInMemory<TProps>>>,
    );
  }

  static override async querySourceInstances<
    TSourceClass extends typeof BfNodeBase<TSourceProps>,
    TEdgeProps extends BfEdgeBaseProps,
    TSourceProps extends BfNodeBaseProps,
  >(
    cv: BfCurrentViewer,
    SourceClass: TSourceClass,
    targetId: BfGid,
    propsToQuery: Partial<TSourceProps> = {},
    edgePropsToQuery: Partial<TEdgeProps> = {},
  ): Promise<Array<InstanceType<TSourceClass>>> {
    // Filter edges based on target ID and optionally by edge properties
    const matchingEdges = Array.from(this.inMemoryEdges.values()).filter(
      (edge) => {
        // Match target ID
        const targetMatches = edge.metadata.bfTid === targetId;
        if (!targetMatches) return false;

        // Match source class name if specified
        if (SourceClass && edge.metadata.bfSClassName !== SourceClass.name) {
          return false;
        }

        // Match edge properties if specified
        if (Object.keys(edgePropsToQuery).length > 0) {
          return Object.entries(edgePropsToQuery).every(([key, value]) => {
            return edge.props[key as keyof typeof edge.props] === value;
          });
        }

        return true;
      },
    );

    // Create a set of unique source IDs to prevent duplicates
    const sourceIds = new Set(matchingEdges.map((edge) => edge.metadata.bfSid));

    // Find the source nodes for each edge
    const sourcePromises = Array.from(sourceIds).map(async (sourceId) => {
      // For in-memory implementation, create a mock object with the source ID
      // In a real database implementation, this would be a lookup to the actual node
      const sourceNode = await SourceClass.find(cv, sourceId);

      // Filter by source node properties if specified
      if (sourceNode && Object.keys(propsToQuery).length > 0) {
        const matches = Object.entries(propsToQuery).every(([key, value]) => {
          return (sourceNode.props as TSourceProps)[key] === value;
        });
        return matches ? sourceNode : null;
      }

      return sourceNode;
    });

    // Wait for all source nodes to be retrieved and filter out nulls
    const sources = await Promise.all(sourcePromises);
    return sources.filter(Boolean) as Array<InstanceType<TSourceClass>>;
  }

  /**
   * Queries target instances connected to a source node.
   *
   * @param cv - The current viewer context
   * @param TargetClass - The class of the target nodes to query
   * @param sourceId - The ID of the source node
   * @param propsToQuery - Optional properties to filter the query
   * @param edgePropsToQuery - Optional edge properties to filter the query
   * @returns Promise resolving to an array of target instances
   */
  static override async queryTargetInstances<
    TTargetProps extends BfNodeBaseProps,
    TEdgeProps extends BfEdgeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    cv: BfCurrentViewer,
    TargetClass: TTargetClass,
    sourceId: BfGid,
    propsToQuery: Partial<TTargetProps> = {},
    edgePropsToQuery: Partial<TEdgeProps> = {},
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TTargetClass>>> {
    // Filter edges based on source ID and optionally by edge properties
    const matchingEdges = Array.from(this.inMemoryEdges.values()).filter(
      (edge) => {
        // Match source ID
        const sourceMatches = edge.metadata.bfSid === sourceId;
        if (!sourceMatches) return false;

        // Match target class name if specified
        if (TargetClass && edge.metadata.bfTClassName !== TargetClass.name) {
          return false;
        }

        // Match edge properties if specified
        if (Object.keys(edgePropsToQuery).length > 0) {
          return Object.entries(edgePropsToQuery).every(([key, value]) => {
            return edge.props[key as keyof typeof edge.props] === value;
          });
        }

        return true;
      },
    );

    // Create a set of unique target IDs to prevent duplicates
    const targetIds = new Set(matchingEdges.map((edge) => edge.metadata.bfTid));

    // Find the target nodes for each edge
    const targetPromises = Array.from(targetIds).map(async (targetId) => {
      // Check if the node is already in the cache
      const cachedNode = cache?.get(targetId);
      if (cachedNode) {
        // If we find it in the cache and it's the right type, use it
        if (cachedNode instanceof TargetClass) {
          // Filter by target node properties if specified
          if (Object.keys(propsToQuery).length > 0) {
            const matches = Object.entries(propsToQuery).every(
              ([key, value]) => {
                return (cachedNode.props as TTargetProps)[key] === value;
              },
            );
            return matches ? cachedNode : null;
          }
          return cachedNode;
        }
      }

      // If not in cache, retrieve from storage
      const targetNode = await TargetClass.find(cv, targetId);

      // Add to cache if found
      if (targetNode && cache) {
        cache.set(targetId, targetNode);
      }

      // Filter by target node properties if specified
      if (targetNode && Object.keys(propsToQuery).length > 0) {
        const matches = Object.entries(propsToQuery).every(([key, value]) => {
          return (targetNode.props as TTargetProps)[key] === value;
        });
        return matches ? targetNode : null;
      }

      return targetNode;
    });

    // Wait for all target nodes to be retrieved and filter out nulls
    const targets = await Promise.all(targetPromises);
    return targets.filter(Boolean) as Array<InstanceType<TTargetClass>>;
  }

  /**
   * Queries edges where a node is the target.
   *
   * @param node - The target node to find edges for
   * @returns Promise resolving to an array of edges where the node is the target
   */
  static override queryTargetEdgesForNode(
    node: BfNodeBase,
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<typeof BfEdgeInMemory>>> {
    // Filter edges where the given node is the target
    const edges = Array.from(this.inMemoryEdges.values()).filter(
      (edge) => edge.metadata.bfTid === node.metadata.bfGid,
    );

    // Add edges to cache if cache is provided
    // We'll use the edge's GID as the key
    if (cache) {
      for (const edge of edges) {
        cache.set(edge.metadata.bfGid, edge);
      }
    }

    return Promise.resolve(edges);
  }
}
