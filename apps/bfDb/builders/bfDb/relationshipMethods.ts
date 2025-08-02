// Type System Foundation for Automatic Relationship Methods

// Import existing types from bfDb
import type {
  AnyBfNodeCtor,
  InferProps,
  PropsBase,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { RelationSpec } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
import type { BfGid } from "@bfmono/lib/types.ts";
import type { JSONValue } from "@bfmono/apps/bfDb/bfDb.ts";

// Reuse UnionToIntersection from std library
type UnionToIntersection<T> =
  (T extends unknown ? (args: T) => unknown : never) extends
    (args: infer R) => unknown ? R : never;

// Extract relation names from bfNodeSpec (static property)
type RelationNames<T extends AnyBfNodeCtor> = T extends
  { bfNodeSpec: { relations: infer R } } ? keyof R
  : never;

// Get the target type for a specific relation
type RelationTarget<T extends AnyBfNodeCtor, K extends string> = T extends
  { bfNodeSpec: { relations: Record<K, RelationSpec> } }
  ? T["bfNodeSpec"]["relations"][K] extends { target: () => infer Target }
    ? Target extends AnyBfNodeCtor ? Target : never
  : never
  : never;

// Detect relationship cardinality
type RelationCardinality<T extends AnyBfNodeCtor, K extends string> = T extends
  { bfNodeSpec: { relations: Record<K, infer R> } }
  ? R extends { cardinality: infer C } ? C : "one"
  : never;

// Generate method signatures for .one() relationships
type OneRelationshipMethods<T extends AnyBfNodeCtor> = UnionToIntersection<
  {
    [K in RelationNames<T>]: RelationCardinality<T, K> extends "one" ?
        & {
          [P in K as `find${Capitalize<P>}`]: () => Promise<
            InstanceType<RelationTarget<T, P>> | null
          >;
        }
        & {
          [P in K as `findX${Capitalize<P>}`]: () => Promise<
            InstanceType<RelationTarget<T, P>>
          >;
        }
        & {
          [P in K as `create${Capitalize<P>}`]: (
            props: InferProps<RelationTarget<T, P>>,
          ) => Promise<InstanceType<RelationTarget<T, P>>>;
        }
        & {
          [P in K as `unlink${Capitalize<P>}`]: () => Promise<void>;
        }
        & {
          [P in K as `delete${Capitalize<P>}`]: () => Promise<void>;
        }
      : never;
  }[RelationNames<T>]
>;

// Query and connection types for .many() relationships
type QueryArgs<T extends AnyBfNodeCtor> = {
  where?: Partial<InferProps<T>>;
  orderBy?: { [K in keyof InferProps<T>]?: "asc" | "desc" };
  limit?: number;
  offset?: number;
};

type ConnectionArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  where?: Partial<PropsBase>; // Same as QueryArgs where clause
};

// Connection type for GraphQL-style pagination
type Connection<T> = {
  edges: Array<{ node: T; cursor: string }>;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
};

// Generate method signatures for .many() relationships
type ManyRelationshipMethods<T extends AnyBfNodeCtor> = UnionToIntersection<
  {
    [K in RelationNames<T>]: RelationCardinality<T, K> extends "many" ?
        & {
          [P in K as `findAll${Capitalize<P>}`]: () => Promise<
            Array<InstanceType<RelationTarget<T, P>>>
          >;
        }
        & {
          [P in K as `query${Capitalize<P>}`]: (
            args: QueryArgs<RelationTarget<T, P>>,
          ) => Promise<Array<InstanceType<RelationTarget<T, P>>>>;
        }
        & {
          [P in K as `connectionFor${Capitalize<P>}`]: (
            args: ConnectionArgs,
          ) => Promise<Connection<InstanceType<RelationTarget<T, P>>>>;
        }
        & {
          [P in K as `create${Capitalize<P>}`]: (
            props: InferProps<RelationTarget<T, P>>,
          ) => Promise<InstanceType<RelationTarget<T, P>>>;
        }
        & {
          [P in K as `add${Capitalize<P>}`]: (
            node: InstanceType<RelationTarget<T, P>>,
          ) => Promise<void>;
        }
        & {
          [P in K as `remove${Capitalize<P>}`]: (
            node: InstanceType<RelationTarget<T, P>>,
          ) => Promise<void>;
        }
        & {
          [P in K as `delete${Capitalize<P>}`]: (
            node: InstanceType<RelationTarget<T, P>>,
          ) => Promise<void>;
        }
        // Batch operations for Phase 7
        & {
          [P in K as `addMany${Capitalize<P>}`]: (
            nodes: Array<InstanceType<RelationTarget<T, P>>>,
          ) => Promise<void>;
        }
        & {
          [P in K as `removeMany${Capitalize<P>}`]: (
            nodes: Array<InstanceType<RelationTarget<T, P>>>,
          ) => Promise<void>;
        }
        & {
          [P in K as `createMany${Capitalize<P>}`]: (
            propsArray: Array<InferProps<RelationTarget<T, P>>>,
          ) => Promise<Array<InstanceType<RelationTarget<T, P>>>>;
        }
        // Async iteration for Phase 7
        & {
          [P in K as `iterate${Capitalize<P>}`]: () => AsyncIterableIterator<
            InstanceType<RelationTarget<T, P>>
          >;
        }
      : never;
  }[RelationNames<T>]
>;

// Combine both relationship types
export type RelationshipMethods<T extends AnyBfNodeCtor> =
  & OneRelationshipMethods<T>
  & ManyRelationshipMethods<T>;

// Combine with base type - return type for findX, create, etc.
export type WithRelationships<T extends AnyBfNodeCtor> =
  & InstanceType<T>
  & RelationshipMethods<T>;

// Export individual types for testing
export type {
  ConnectionArgs,
  ManyRelationshipMethods,
  OneRelationshipMethods,
  QueryArgs,
  RelationCardinality,
  RelationNames,
  RelationTarget,
  UnionToIntersection,
};

// Runtime method generation
import type {
  BfEdgeMetadata,
  BfNode,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { NotFoundError } from "@bfmono/packages/bolt-foundry/lib/BfError.ts";

/**
 * Generates relationship methods on a BfNode instance based on its spec
 */
export function generateRelationshipMethods(node: BfNode): void {
  const nodeClass = node.constructor as AnyBfNodeCtor;
  const spec = (nodeClass as AnyBfNodeCtor & {
    bfNodeSpec?: { relations?: Record<string, unknown> };
  }).bfNodeSpec;

  if (!spec?.relations) {
    return;
  }

  for (const [relationName, relationSpec] of Object.entries(spec.relations)) {
    const typedRelationSpec = relationSpec as RelationSpec;
    if (typedRelationSpec.cardinality === "one") {
      generateOneRelationshipMethods(node, relationName, typedRelationSpec);
    } else if (typedRelationSpec.cardinality === "many") {
      generateManyRelationshipMethods(node, relationName, typedRelationSpec);
    }
  }
}

/**
 * Generates methods for a .one() relationship
 */
function generateOneRelationshipMethods(
  node: BfNode,
  relationName: string,
  relationSpec: RelationSpec,
): void {
  const capitalizedName = capitalize(relationName);

  // Handle both sync and async target resolution
  const getTargetClass = async () => {
    const targetResult = relationSpec.target();
    return await Promise.resolve(targetResult);
  };

  // find{RelationName}() - Find the related node (returns null if not found)
  Object.defineProperty(node, `find${capitalizedName}`, {
    value: async function () {
      const edges = await node.findEdges({
        direction: "out",
        label: relationName,
      });

      if (edges.length === 0) {
        return null;
      }

      const targetClass = await getTargetClass();
      const targetId = (edges[0].metadata as BfEdgeMetadata).bfTid;
      return await (targetClass as typeof BfNode).find(
        (node as BfNode).currentViewer,
        targetId,
      );
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // findX{RelationName}() - Find the related node (throws if not found)
  Object.defineProperty(node, `findX${capitalizedName}`, {
    value: async function () {
      const result =
        await (node as BfNode & Record<string, () => Promise<unknown>>)
          [`find${capitalizedName}`]();
      if (!result) {
        throw new NotFoundError(
          `${capitalizedName} not found for ${node.constructor.name} ${node.id}`,
        );
      }
      return result;
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // create{RelationName}(props) - Create and link a new related node
  Object.defineProperty(node, `create${capitalizedName}`, {
    value: async function (props: Record<string, unknown>) {
      const cv = (node as BfNode & { currentViewer?: unknown }).currentViewer;
      const targetClass = await getTargetClass();
      const newNode = await (targetClass as AnyBfNodeCtor & {
        __DANGEROUS__createUnattached: (
          cv: unknown,
          props: Record<string, unknown>,
        ) => Promise<unknown>;
      }).__DANGEROUS__createUnattached(
        cv,
        props,
      );

      await node.createEdge({
        targetId: (newNode as BfNode).id as BfGid,
        label: relationName,
        props: {},
      });

      return newNode;
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // unlink{RelationName}() - Remove the relationship (edge only)
  Object.defineProperty(node, `unlink${capitalizedName}`, {
    value: async function () {
      const edges = await node.findEdges({
        direction: "out",
        label: relationName,
      });

      for (const edge of edges) {
        // BfEdge extends BfNode, so we can use the delete method
        await edge.delete();
      }
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // delete{RelationName}() - Delete the related node and relationship
  Object.defineProperty(node, `delete${capitalizedName}`, {
    value: async function () {
      const _cv = (node as BfNode & { currentViewer?: unknown }).currentViewer;
      const relatedNode =
        await (node as BfNode & Record<string, () => Promise<unknown>>)
          [`find${capitalizedName}`]();

      if (relatedNode) {
        // Delete the edge first
        await (node as BfNode & Record<string, () => Promise<void>>)
          [`unlink${capitalizedName}`]();
        // Then delete the node
        await (relatedNode as BfNode).delete();
      }
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

/**
 * Generates methods for a .many() relationship
 */
function generateManyRelationshipMethods(
  node: BfNode,
  relationName: string,
  relationSpec: RelationSpec,
): void {
  const capitalizedName = capitalize(relationName);

  // Handle both sync and async target resolution
  const getTargetClass = async () => {
    const targetResult = relationSpec.target();
    return await Promise.resolve(targetResult);
  };

  // findAll{RelationName}() - Find all related nodes
  Object.defineProperty(node, `findAll${capitalizedName}`, {
    value: async function () {
      const targetClass = await getTargetClass();
      return await node.queryTargetInstances(
        targetClass as typeof BfNode,
        {},
        {},
        undefined,
        {
          role: relationName,
        },
      );
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // query{RelationName}(args) - Query related nodes with filtering
  Object.defineProperty(node, `query${capitalizedName}`, {
    value: async function (args: {
      where?: Record<string, unknown>;
      orderBy?: Record<string, "asc" | "desc">;
      limit?: number;
      offset?: number;
    }) {
      const targetClass = await getTargetClass();
      let results = await node.queryTargetInstances(
        targetClass as typeof BfNode,
        args.where as Partial<PropsBase> || {},
        {},
        undefined,
        { role: relationName },
      );

      // Apply ordering
      if (args.orderBy) {
        const orderByEntries = Object.entries(args.orderBy);
        results.sort((a, b) => {
          for (const [field, direction] of orderByEntries) {
            const aVal = (a as BfNode<Record<string, JSONValue>>).props[field];
            const bVal = (b as BfNode<Record<string, JSONValue>>).props[field];
            if (aVal !== bVal) {
              const cmp = String(aVal).localeCompare(String(bVal));
              return direction === "asc" ? cmp : -cmp;
            }
          }
          return 0;
        });
      }

      // Apply pagination
      if (args.offset) {
        results = results.slice(args.offset);
      }
      if (args.limit) {
        results = results.slice(0, args.limit);
      }

      return results;
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // connectionFor{RelationName}(args) - GraphQL connection
  Object.defineProperty(node, `connectionFor${capitalizedName}`, {
    value: async function (args: {
      first?: number;
      after?: string;
      last?: number;
      before?: string;
      where?: Record<string, unknown>;
    }) {
      const targetClass = await getTargetClass();
      const allNodes = await node.queryTargetInstances(
        targetClass as typeof BfNode,
        args.where as Partial<PropsBase> || {},
        {},
        undefined,
        { role: relationName },
      );

      const connection = (targetClass as typeof BfNode).connection(
        allNodes,
        args,
      );

      // Add totalCount to the connection
      return {
        ...connection,
        totalCount: allNodes.length,
      };
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // create{RelationName}(props) - Create and link a new node
  Object.defineProperty(node, `create${capitalizedName}`, {
    value: async function (props: Record<string, unknown>) {
      const cv = (node as BfNode & { currentViewer?: unknown }).currentViewer;
      const targetClass = await getTargetClass();
      const newNode = await (targetClass as AnyBfNodeCtor & {
        __DANGEROUS__createUnattached: (
          cv: unknown,
          props: Record<string, unknown>,
        ) => Promise<unknown>;
      }).__DANGEROUS__createUnattached(
        cv,
        props,
      );

      await node.createEdge({
        targetId: (newNode as BfNode).id as BfGid,
        label: relationName,
        props: {},
      });

      return newNode;
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // add{RelationName}(node) - Link an existing node
  Object.defineProperty(node, `add${capitalizedName}`, {
    value: async function (targetNode: BfNode) {
      const existingEdges = await node.findEdges({
        direction: "out",
        label: relationName,
        targetId: targetNode.id as BfGid,
      });

      if (existingEdges.length === 0) {
        await node.createEdge({
          targetId: targetNode.id as BfGid,
          label: relationName,
          props: {},
        });
      }
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // remove{RelationName}(node) - Remove from collection (edge only)
  Object.defineProperty(node, `remove${capitalizedName}`, {
    value: async function (targetNode: BfNode) {
      const edges = await node.findEdges({
        direction: "out",
        label: relationName,
        targetId: targetNode.id as BfGid,
      });

      for (const edge of edges) {
        await edge.delete();
      }
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // delete{RelationName}(node) - Delete node and remove from collection
  Object.defineProperty(node, `delete${capitalizedName}`, {
    value: async function (targetNode: BfNode) {
      // First remove the edge
      await (node as BfNode & Record<string, (n: BfNode) => Promise<void>>)
        [`remove${capitalizedName}`](targetNode);

      // Then delete the node
      await targetNode.delete();
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // Phase 7: Batch operations

  // addMany{RelationName}(nodes) - Link multiple existing nodes
  Object.defineProperty(node, `addMany${capitalizedName}`, {
    value: async function (nodes: Array<BfNode>) {
      await node.createEdges(nodes.map((n) => ({
        targetId: n.id as BfGid,
        label: relationName,
        props: {},
      })));
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // removeMany{RelationName}(nodes) - Remove multiple nodes from collection
  Object.defineProperty(node, `removeMany${capitalizedName}`, {
    value: async function (nodes: Array<BfNode>) {
      const edgeIds = [];
      for (const targetNode of nodes) {
        const edges = await node.findEdges({
          direction: "out",
          label: relationName,
          targetId: targetNode.id as BfGid,
        });
        edgeIds.push(...edges.map((e) => e.id as BfGid));
      }
      await node.deleteEdges(edgeIds as Array<BfGid>);
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // createMany{RelationName}(propsArray) - Create multiple nodes and link them
  Object.defineProperty(node, `createMany${capitalizedName}`, {
    value: async function (propsArray: Array<Record<string, unknown>>) {
      // TODO: Implement batch creation for atomicity
      // const cv = (node as any).currentViewer;
      // const newNodes = await targetClass.createMany(cv, propsArray);
      // await node.createEdges(cv, newNodes.map(n => ({
      //   targetId: n.id,
      //   label: relationName,
      //   props: {},
      // })));
      // return newNodes;

      // Temporary implementation: call create for each set of props
      const createdNodes = [];
      for (const props of propsArray) {
        const newNode = await (node as
          & BfNode
          & Record<string, (p: Record<string, unknown>) => Promise<BfNode>>)
          [`create${capitalizedName}`](props);
        createdNodes.push(newNode);
      }
      return createdNodes;
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // iterate{RelationName}() - Async iterator for memory-efficient processing
  Object.defineProperty(node, `iterate${capitalizedName}`, {
    value: async function* () {
      // TODO: Implement cursor-based iteration when available
      // const cv = (node as any).currentViewer;
      // let cursor = null;
      // const batchSize = 100;
      //
      // while (true) {
      //   const batch = await node.queryTargetInstances(
      //     targetClass,
      //     {},
      //     { role: relationName, cursor, limit: batchSize }
      //   );
      //
      //   if (batch.length === 0) break;
      //
      //   for (const item of batch) {
      //     yield item;
      //   }
      //
      //   if (batch.length < batchSize) break;
      //   cursor = batch[batch.length - 1].id;
      // }

      // Temporary implementation: yield all items from findAll
      const allItems =
        await (node as BfNode & Record<string, () => Promise<Array<unknown>>>)
          [`findAll${capitalizedName}`]();
      for (const item of allItems) {
        yield item;
      }
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

/**
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
