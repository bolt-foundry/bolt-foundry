import { BfErrorNodeNotFound } from "apps/bfDb/classes/BfErrorNode.ts";
import {
  type BfMetadataBase,
  BfNodeBase,
  type BfNodeBaseProps,
  type BfNodeCache,
} from "apps/bfDb/classes/BfNodeBase.ts";
import type { BfCurrentViewer } from "apps/bfDb/classes/BfCurrentViewer.ts";
import type { BfGid } from "apps/bfDb/classes/BfNodeIds.ts";
import { getLogger } from "packages/logger/logger.ts";
import {
  type Connection,
  type ConnectionArguments,
  connectionFromArray,
} from "graphql-relay";
import type { GraphqlNode } from "apps/bfDb/graphql/helpers.ts";
import type { BfEdgeBaseProps } from "apps/bfDb/classes/BfEdgeBase.ts";

const logger = getLogger(import.meta);

export type BfNodeInMemoryProps = BfNodeBaseProps;
export type BfMetadataNodeInMemory = BfMetadataBase;

/**
 * Simple in‑memory implementation of `BfNodeBase`.
 * The static generics mirror the base‑class signatures so the compiler
 * recognises the overrides as compatible.
 */
export class BfNodeInMemory<
  TProps extends BfNodeInMemoryProps = BfNodeInMemoryProps,
  TMetadata extends BfMetadataNodeInMemory = BfMetadataNodeInMemory,
> extends BfNodeBase<TProps, TMetadata> {
  /** per‑class in‑memory store */
  private static inMemoryNodes: Map<string, BfNodeInMemory> = new Map();

  override readonly relatedEdge: string = "apps/bfDb/coreModels/BfEdge.ts";

  /* ------------------------------------------------------------------ */
  /*  Base‑class static overrides                                       */
  /* ------------------------------------------------------------------ */

  /**
   * Create – without persistence side‑effects – a detached node instance.
   * Mirrors the base‑class generic signature so TypeScript accepts the
   * override.
   */
  static override async __DANGEROUS__createUnattached<
    TProps extends BfNodeBaseProps,
    TMetadata extends BfMetadataBase,
    TThis extends typeof BfNodeBase<TProps, TMetadata>,
  >(
    this: TThis,
    cv: BfCurrentViewer,
    props: TProps,
    metadata: Partial<TMetadata> = {},
    cache?: BfNodeCache,
  ): Promise<InstanceType<TThis>> {
    // `this` is the concrete subclass constructor that called us
    const NewCtor = this as unknown as {
      new (
        cv: BfCurrentViewer,
        props: TProps,
        metadata?: Partial<TMetadata>,
      ): InstanceType<TThis>;
    };

    const newNode = new NewCtor(cv, props, metadata);

    await newNode.beforeCreate();
    await newNode.save();
    await newNode.afterCreate();

    cache?.set(newNode.metadata.bfGid, newNode);
    (this as unknown as typeof BfNodeInMemory).inMemoryNodes.set(
      newNode.metadata.bfGid,
      newNode as unknown as BfNodeInMemory,
    );

    logger.debug(`Created ${newNode}`);
    return newNode;
  }

  /**
   * Lookup by GID – must conform exactly to the base signature.
   */
  static override findX<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    this: TThis,
    _cv: BfCurrentViewer,
    id: BfGid,
    cache?: BfNodeCache,
  ): Promise<InstanceType<TThis>> {
    const cached = cache?.get(id) as InstanceType<TThis> | undefined;
    if (cached) return Promise.resolve(cached);

    const node = (this as unknown as typeof BfNodeInMemory).inMemoryNodes.get(
      id,
    );
    if (!node) throw new BfErrorNodeNotFound(`Node with ID ${id} not found`);

    const typedNode = node as unknown as InstanceType<TThis>;
    cache?.set(id, typedNode);
    return Promise.resolve(typedNode);
  }

  /**
   * Basic filter query across the in‑memory store.
   */
  static override query<
    TProps extends BfNodeBaseProps,
    TThis extends typeof BfNodeBase<TProps>,
  >(
    this: TThis,
    _cv: BfCurrentViewer,
    metadata: Partial<BfMetadataBase> = {},
    props: Partial<TProps> = {},
    bfGids: Array<BfGid> = [],
    cache?: BfNodeCache,
  ): Promise<Array<InstanceType<TThis>>> {
    const results: Array<InstanceType<TThis>> = [];

    for (
      const node of (this as unknown as typeof BfNodeInMemory).inMemoryNodes
        .values()
    ) {
      if (node.constructor.name !== this.name) continue;
      if (bfGids.length && !bfGids.includes(node.metadata.bfGid)) continue;

      // metadata filter
      const metaOk = Object.entries(metadata).every(
        ([k, v]) => (node.metadata as Record<string, unknown>)[k] === v,
      );
      if (!metaOk) continue;

      // props filter
      const propsOk = Object.entries(props).every(
        ([k, v]) => (node.props as Record<string, unknown>)[k] === v,
      );
      if (!propsOk) continue;

      const typedNode = node as unknown as InstanceType<TThis>;
      results.push(typedNode);
      cache?.set(node.metadata.bfGid, typedNode);
    }

    return Promise.resolve(results);
  }

  /* ------------------------------------------------------------------ */
  /*  Instance methods                                                  */
  /* ------------------------------------------------------------------ */

  override save(): Promise<this> {
    (this.constructor as unknown as typeof BfNodeInMemory).inMemoryNodes.set(
      this.metadata.bfGid,
      this as unknown as BfNodeInMemory,
    );
    return Promise.resolve(this);
  }

  override delete(): Promise<boolean> {
    const removed = (this.constructor as unknown as typeof BfNodeInMemory)
      .inMemoryNodes.delete(this.metadata.bfGid);
    return Promise.resolve(removed);
  }

  override load(): Promise<this> {
    // no‑op – everything is already in memory
    return Promise.resolve(this);
  }

  /**
   * Convenience: query targets and expose as a Relay connection.
   */
  override async queryTargetsConnectionForGraphql<
    TTargetProps extends BfNodeBaseProps,
    TTargetClass extends typeof BfNodeBase<TTargetProps>,
  >(
    TargetClass: TTargetClass,
    args: ConnectionArguments,
    props: Partial<TTargetProps> = {},
    edgeProps: Partial<BfEdgeBaseProps> = {},
    cache?: BfNodeCache,
  ): Promise<Connection<GraphqlNode>> {
    const targets = await this.queryTargets(
      TargetClass,
      props,
      edgeProps,
      cache,
    );
    const gnodes = targets.map((n) => n.toGraphql());
    return connectionFromArray(gnodes, args) as Connection<GraphqlNode>;
  }

  /* ------------------------------------------------------------------ */
  /*  Test helpers                                                      */
  /* ------------------------------------------------------------------ */

  static getAllInMemoryNodes(): BfNodeInMemory[] {
    return Array.from(this.inMemoryNodes.values());
  }

  static clearInMemoryNodes(): void {
    this.inMemoryNodes.clear();
  }
}
