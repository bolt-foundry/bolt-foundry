import {
  BfEdgeBase,
  type BfEdgeBaseProps,
  type BfMetadataEdgeBase,
} from "packages/bfDb/classes/BfEdgeBase.ts";
import type {
  BfNodeBase,
  BfNodeBaseProps,
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
}
