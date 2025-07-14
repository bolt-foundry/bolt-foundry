import { GraphQLNode } from "./GraphQLNode.ts";
import type { FieldBuilder } from "@bfmono/apps/bfDb/builders/bfDb/makeFieldBuilder.ts";
import { GraphQLInterface } from "@bfmono/apps/bfDb/graphql/decorators.ts";

import type { BfGid } from "@bfmono/lib/types.ts";
import type { GraphqlNode } from "@bfmono/apps/bfDb/graphql/helpers.ts";
import type { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { BfErrorNotImplemented } from "@bfmono/lib/BfError.ts";
import { storage } from "@bfmono/apps/bfDb/storage/storage.ts";
import type { JSONValue } from "@bfmono/apps/bfDb/bfDb.ts";
import { BfErrorNodeNotFound } from "@bfmono/apps/bfDb/classes/BfErrorsBfNode.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { generateUUID } from "@bfmono/lib/generateUUID.ts";
import type {
  FieldSpec,
  RelationSpec,
} from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
import { makeBfDbSpec } from "@bfmono/apps/bfDb/builders/bfDb/makeBfDbSpec.ts";

const logger = getLogger(import.meta);

export type ConcreteBfNodeBaseCtor<
  TProps extends Record<string, JSONValue>,
> = new (
  cv: CurrentViewer,
  props: TProps,
  metadata?: Partial<BfMetadata>,
) => BfNode<TProps>;

export type BfNodeMetadata = {
  /** Global ID */
  bfGid: BfGid;
  bfOid: BfGid;
  className: string;
  sortValue: number;
  bfCid: BfGid;
  createdAt: Date;
  lastUpdated: Date;
};

export type PropsBase = Record<string, JSONValue>;

export type BfEdgeMetadata = BfNodeMetadata & {
  bfSid: BfGid;
  bfSClassName: string;
  bfTid: BfGid;
  bfTClassName: string;
};

export type BfNodeCache<
  TProps extends PropsBase,
  T extends BfNode<TProps> = BfNode<TProps>,
> = Map<
  BfGid | string,
  T
>;

export type BfMetadata = BfNodeMetadata | BfEdgeMetadata;

type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : S extends { kind: "json" } ? JSONValue
  : never;

// deno-lint-ignore no-explicit-any
export type AnyBfNodeCtor<T extends BfNode<any> = BfNode<any>> = abstract new (
  // deno-lint-ignore no-explicit-any
  ...args: any
) => T;

type PropsFromFieldSpec<F extends Record<string, FieldSpec>> = {
  [K in keyof F]: FieldValue<F[K]>;
};
export type InferProps<T extends AnyBfNodeCtor> = T extends
  { bfNodeSpec: { fields: infer F extends Record<string, FieldSpec> } }
  ? PropsFromFieldSpec<F>
  : never;

@GraphQLInterface({
  name: "BfNode",
  description: "Base interface for all Bolt Foundry database nodes",
})
// deno-lint-ignore ban-types
export abstract class BfNode<TProps extends PropsBase = {}>
  extends GraphQLNode {
  protected _savedProps: TProps;
  protected _metadata: BfMetadata;
  readonly currentViewer: CurrentViewer;
  // We inherit the base gqlSpec from GraphQLNode with the id field
  // Define the GraphQL spec first to avoid a linting error
  static override gqlSpec = this.defineGqlNode((gql) => gql.nonNull.id("id"));
  static bfNodeSpec = this.defineBfNode((i) => i);
  static defineBfNode<
    F extends Record<string, FieldSpec>,
    R extends Record<string, RelationSpec> = Record<string, RelationSpec>,
  >(
    builder: (
      // deno-lint-ignore ban-types
      f: FieldBuilder<{}, {}>,
    ) => FieldBuilder<F, R>,
  ): { fields: F; relations: R } {
    return makeBfDbSpec<F, R>(builder);
  }

  static generateSortValue() {
    return Date.now();
  }

  static generateMetadata<
    TProps extends PropsBase,
    TThis extends typeof BfNode<TProps>,
  >(
    this: TThis,
    cv: CurrentViewer,
    metadata?: Partial<BfMetadata>,
  ): BfMetadata {
    const bfGid = generateUUID() as BfGid;
    const now = new Date();
    const defaults: BfMetadata = {
      bfGid: bfGid,
      bfOid: cv.orgBfOid,
      className: this.name,
      sortValue: this.generateSortValue(),
      bfCid: cv.personBfGid,
      createdAt: now,
      lastUpdated: now,
    };
    return { ...defaults, ...metadata };
  }

  static async query<
    TProps extends Record<string, JSONValue>,
    TThis extends typeof BfNode<TProps>,
  >(
    this: TThis,
    cv: CurrentViewer,
    metadata: Partial<BfMetadata>,
    props: Partial<TProps>,
    bfGids: Array<BfGid>,
    cache?: BfNodeCache<TProps>,
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
      const Ctor = this as unknown as ConcreteBfNodeBaseCtor<TProps>;
      const instance = new Ctor(
        cv,
        item.props as TProps,
        item.metadata,
      );
      cache?.set(item.metadata.bfGid, instance);
      return instance as InstanceType<TThis>;
    });
  }

  static override async find<
    TProps extends PropsBase,
    TThis extends typeof BfNode<TProps>,
  >(
    this: TThis,
    cv: CurrentViewer,
    id: BfGid,
    cache?: BfNodeCache<TProps>,
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

  static override async findX<
    TProps extends PropsBase,
    TThis extends typeof BfNode<TProps>,
  >(
    this: TThis,
    cv: CurrentViewer,
    id: BfGid,
    cache?: BfNodeCache<TProps>,
  ) {
    logger.debug(`findX: ${this.name} ${id} ${cv}`);
    const itemFromCache = cache?.get(id);
    if (itemFromCache) {
      return itemFromCache as InstanceType<TThis>;
    }
    const itemFromDb = await storage.get(cv.orgBfOid, id);
    if (!itemFromDb) {
      logger.debug("couldn't find item", cv.orgBfOid, id);
      throw new BfErrorNodeNotFound();
    }
    logger.debug(`Found ${this.name} with id ${id}`);
    const Ctor = this as unknown as ConcreteBfNodeBaseCtor<TProps>;
    const item = new Ctor(
      cv,
      itemFromDb.props as TProps,
      itemFromDb.metadata as BfMetadata,
    );
    cache?.set(id, item);
    return item as InstanceType<TThis>;
  }

  static async __DANGEROUS__createUnattached<
    TProps extends PropsBase,
    TThis extends typeof BfNode<TProps>,
  >(
    this: TThis,
    cv: CurrentViewer,
    props: TProps,
    metadata?: Partial<BfMetadata>,
    cache?: BfNodeCache<TProps>,
  ): Promise<InstanceType<TThis>> {
    logger.debug(
      `Creating unattached ${this.name} with props ${JSON.stringify(props)}`,
    );
    // indirection is because we're "newing" an abstract class, but it's actually a concrete subclass
    const Ctor = this as unknown as ConcreteBfNodeBaseCtor<TProps>;
    const newNode = new Ctor(cv, props, metadata) as InstanceType<TThis>;
    await newNode.beforeCreate();
    await newNode.save();
    await newNode.afterCreate();
    logger.debug(`Created ${newNode}`);
    cache?.set(newNode.metadata.bfGid, newNode);
    return newNode;
  }

  constructor(
    currentViewer: CurrentViewer,
    protected _props: TProps,
    metadata?: Partial<BfMetadata>,
  ) {
    super();
    this._savedProps = { ..._props };
    this._metadata = (this.constructor as typeof BfNode).generateMetadata(
      currentViewer,
      metadata,
    );
    this.currentViewer = currentViewer;
  }

  get props(): TProps {
    return this._props;
  }

  set props(newProps: Partial<TProps>) {
    this._props = { ...this._props, ...newProps };
  }

  get metadata(): BfMetadata {
    return this._metadata;
  }

  get cv(): CurrentViewer {
    return this.currentViewer;
  }

  isDirty() {
    return JSON.stringify(this._props) !== JSON.stringify(this._savedProps);
  }

  /**
   * Implement the id getter required by the Node interface.
   * Returns the bfGid from the node's metadata.
   * If metadata or bfGid is missing, returns undefined.
   * Note: In practice, this should never happen as metadata with bfGid
   * is always initialized in the constructor.
   */
  override get id(): string {
    return this.metadata?.bfGid;
  }

  override toGraphql(): GraphqlNode {
    const descriptors = Object.getOwnPropertyDescriptors(this);
    const skip = new Set(["metadata", "cv", "props"]);

    const getters = Object.entries(descriptors)
      .filter(([k, d]) => typeof d.get === "function" && !skip.has(k))
      // deno-lint-ignore no-explicit-any
      .map(([k]) => [k, (this as any)[k]]);

    return {
      // deno-lint-ignore no-explicit-any
      ...(this as any).props,
      ...Object.fromEntries(getters),
      // id is already provided via the getter
      __typename: this.__typename,
    };
  }

  override toString() {
    return `${this.constructor.name}#${this.metadata.bfGid}⚡️${this.metadata.bfOid}`;
  }

  async save() {
    this.metadata.lastUpdated = new Date();
    logger.debug(`Saving ${this}`, this.props, this.metadata);
    await storage.put(this.props, this.metadata);
    this._savedProps = this._props;
    return this;
  }

  delete(): Promise<boolean> {
    throw new BfErrorNotImplemented();
  }

  async load(): Promise<this> {
    const item = await storage.get(this.cv.orgBfOid, this.metadata.bfGid);
    if (!item) {
      throw new BfErrorNodeNotFound();
    }
    this._props = item.props as TProps;
    this._savedProps = this._props;
    this._metadata = item.metadata;
    return this;
  }

  async createTargetNode<TProps extends PropsBase>(
    TargetNodeClass: typeof BfNode<TProps>,
    props: TProps,
    options?: {
      role?: string;
      metadata?: Partial<BfMetadata>;
    },
  ): Promise<InstanceType<typeof TargetNodeClass>> {
    const targetNode = await TargetNodeClass.__DANGEROUS__createUnattached(
      this.cv,
      props,
      options?.metadata,
    );

    await targetNode.save();

    const { BfEdge } = await import("@bfmono/apps/bfDb/nodeTypes/BfEdge.ts");
    await BfEdge.createBetweenNodes(
      this.cv,
      this,
      targetNode,
      { role: options?.role || "" },
    );

    return targetNode;
  }

  protected beforeCreate(): Promise<void> | void {}
  protected afterCreate(): Promise<void> | void {}
}
