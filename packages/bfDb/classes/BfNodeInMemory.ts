import { BfErrorNodeNotFound } from "packages/bfDb/classes/BfErrorNode.ts";
import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
  type BfNodeCache,
} from "packages/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import type { BfGid } from "packages/bfDb/classes/BfNodeIds.ts";
import { getLogger } from "packages/logger.ts";

const logger = getLogger(import.meta);

export type BfNodeInMemoryProps = BfNodeBaseProps;
export type BfMetadataNodeInMemory = BfMetadataBase;

/**
 * BfNodeInMemory: In-memory implementation of BfNodeBase
 * Provides a simple in-memory storage for nodes with basic CRUD operations
 */
export class BfNodeInMemory<
  TProps extends BfNodeInMemoryProps = BfNodeInMemoryProps,
  TMetadata extends BfMetadataNodeInMemory = BfMetadataNodeInMemory,
> extends BfNodeBase<TProps, TMetadata> {
  // In-memory storage for nodes
  private static inMemoryNodes: Map<string, BfNodeInMemory> = new Map();
  override readonly relatedEdge: string = "packages/bfDb/coreModels/BfEdge.ts";

  /**
   * Create a new node in memory
   */
  static override async __DANGEROUS__createUnattached<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TReturnable extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    cv: BfCurrentViewer,
    props: TProps,
    metadata?: Partial<TMetadata>,
    cache?: BfNodeCache,
  ) {
    const newNode = new this(cv, props, metadata) as InstanceType<TReturnable>;
    await newNode.beforeCreate();
    await newNode.save();
    await newNode.afterCreate();
    logger.debug(`Created ${newNode}`);
    cache?.set(newNode.metadata.bfGid, newNode);

    // Store in the static map
    this.inMemoryNodes.set(
      newNode.metadata.bfGid,
      newNode,
    );

    return newNode;
  }

  /**
   * Find a node by ID (throws error if not found)
   */
  static override findX<
    TProps extends BfNodeBaseProps,
    TReturnable extends typeof BfNodeBase<TProps>,
  >(
    _cv: BfCurrentViewer,
    id: BfGid,
    cache?: BfNodeCache,
  ) {
    // Check cache first
    const cachedItem = cache?.get(id);
    if (cachedItem) {
      return Promise.resolve(cachedItem) as Promise<InstanceType<TReturnable>>;
    }

    // Look up in the in-memory store
    const node = this.inMemoryNodes.get(id);

    if (!node) {
      throw new BfErrorNodeNotFound(`Node with ID ${id} not found`);
    }

    if (cache) {
      cache.set(id, node);
    }

    return Promise.resolve(node) as Promise<InstanceType<TReturnable>>;
  }

  /**
   * Query nodes based on metadata, props, or IDs
   */
  static override query<
    TProps extends BfNodeBaseProps,
    TReturnable extends typeof BfNodeBase<TProps>,
  >(
    _cv: BfCurrentViewer,
    metadata: Partial<BfMetadataBase> = {},
    props: Partial<TProps> = {},
    bfGids: Array<BfGid> = [],
    cache?: BfNodeCache,
  ) {
    const result: Array<InstanceType<TReturnable>> = [];

    for (const node of this.inMemoryNodes.values()) {
      // Skip if not the correct class type
      if (node.constructor.name !== this.name) {
        continue;
      }

      // Filter by GIDs if provided
      if (bfGids.length > 0 && !bfGids.includes(node.metadata.bfGid)) {
        continue;
      }

      // Filter by metadata if provided
      const metadataMatches = Object.entries(metadata).every(([key, value]) => {
        return node.metadata[key as keyof typeof node.metadata] === value;
      });

      if (!metadataMatches) {
        continue;
      }

      // Filter by props if provided
      const propsMatches = Object.entries(props).every(([key, value]) => {
        return node.props[key as keyof typeof node.props] === value;
      });

      if (!propsMatches) {
        continue;
      }

      // Add to result
      result.push(node as InstanceType<TReturnable>);

      // Add to cache if provided
      if (cache) {
        cache.set(node.metadata.bfGid, node as InstanceType<TReturnable>);
      }
    }

    return Promise.resolve(result as Array<InstanceType<TReturnable>>);
  }

  /**
   * Save the node to memory
   */
  override save(): Promise<this> {
    // Store in the static map
    (this.constructor as typeof BfNodeInMemory).inMemoryNodes.set(
      this.metadata.bfGid,
      this as unknown as BfNodeInMemory,
    );
    return Promise.resolve(this);
  }

  /**
   * Delete the node from memory
   */
  override delete(): Promise<boolean> {
    const result = (this.constructor as typeof BfNodeInMemory).inMemoryNodes
      .delete(
        this.metadata.bfGid,
      );
    return Promise.resolve(result);
  }

  /**
   * Load the node from memory (no-op for in-memory implementation)
   */
  override load(): Promise<this> {
    // For in-memory implementation, nothing needs to be loaded
    return Promise.resolve(this);
  }

  /**
   * Gets all in-memory nodes
   */
  static getAllInMemoryNodes(): BfNodeInMemory[] {
    return Array.from(this.inMemoryNodes.values());
  }

  /**
   * Clears all in-memory nodes
   */
  static clearInMemoryNodes(): void {
    this.inMemoryNodes.clear();
  }
}
