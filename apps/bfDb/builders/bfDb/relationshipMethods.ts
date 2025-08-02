// Type System Foundation for Automatic Relationship Methods

// Import existing types from bfDb
import type {
  AnyBfNodeCtor,
  InferProps,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { RelationSpec } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";

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
  where?: Record<string, unknown>; // Same as QueryArgs where clause
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
import type { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";
import { BfErrorNotFound } from "@bfmono/lib/BfError.ts";

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
      // TODO: Implement in Phase 5-6
      // generateManyRelationshipMethods(node, relationName, typedRelationSpec);
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
  const targetClass = relationSpec.target();

  // find{RelationName}() - Find the related node (returns null if not found)
  Object.defineProperty(node, `find${capitalizedName}`, {
    value: function () {
      // TODO: Implement findEdges method on BfNode
      // const cv = (node as any).currentViewer;
      // const edges = await node.findEdges(cv, {
      //   direction: "out",
      //   label: relationName,
      // });
      //
      // if (edges.length === 0) {
      //   return null;
      // }
      //
      // const targetId = edges[0].targetId;
      // return await targetClass.find(cv, targetId);

      // Temporary stub implementation
      return null;
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
        throw new BfErrorNotFound(
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
      const newNode = await (targetClass as AnyBfNodeCtor & {
        __DANGEROUS__createUnattached: (
          cv: unknown,
          props: Record<string, unknown>,
        ) => Promise<unknown>;
      }).__DANGEROUS__createUnattached(
        cv,
        props,
      );

      // TODO: Implement createEdge method on BfNode
      // await node.createEdge(cv, {
      //   targetId: newNode.id,
      //   label: relationName,
      //   props: {},
      // });

      return newNode;
    },
    writable: false,
    enumerable: false,
    configurable: true,
  });

  // unlink{RelationName}() - Remove the relationship (edge only)
  Object.defineProperty(node, `unlink${capitalizedName}`, {
    value: async function () {
      // TODO: Implement findEdges method on BfNode
      // const cv = (node as any).currentViewer;
      // const edges = await node.findEdges(cv, {
      //   direction: "out",
      //   label: relationName,
      // });
      //
      // for (const edge of edges) {
      //   // BfEdge extends BfNode, so we can use the delete method
      //   await (edge as BfNode).delete();
      // }

      // Temporary stub implementation
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
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
