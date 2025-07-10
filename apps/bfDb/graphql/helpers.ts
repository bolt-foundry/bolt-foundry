import {
  type Connection,
  type ConnectionArguments,
  connectionFromArray,
} from "graphql-relay";
import type { JSONValue } from "@bfmono/apps/bfDb/bfDb.ts";
import type { BfNode } from "@bfmono/apps/bfDb/classes/BfNode.ts";

export type GraphqlNode<
  T extends Record<string, JSONValue> = Record<string, JSONValue>,
> = T & {
  id: string;
  __typename: string;
};
/**
 * Convert a BfNodeBase instance into the standard GraphQL representation
 * (id, __typename, props + computed getters).
 */
export function toGraphqlFromNode(node: BfNode): GraphqlNode {
  const descriptors = Object.getOwnPropertyDescriptors(node as object);
  const skip = new Set(["metadata", "cv", "props"]);

  const getters = Object.entries(descriptors)
    .filter(([k, d]) => typeof d.get === "function" && !skip.has(k))
    // deno-lint-ignore no-explicit-any
    .map(([k]) => [k, (node as any)[k]]);

  return {
    // deno-lint-ignore no-explicit-any
    ...(node as any).props,
    ...Object.fromEntries(getters),
    // deno-lint-ignore no-explicit-any
    id: (node as any).metadata.bfGid,
    __typename: node.__typename,
  };
}

/**
 * Build a Relay‑style Connection from an array of GraphQL‑ready nodes.
 */
export function connectionFromNodes<N>(
  graphqlNodes: Array<N>,
  args: ConnectionArguments,
): Connection<N> {
  // deno-lint-ignore no-explicit-any
  return connectionFromArray(graphqlNodes as Array<any>, args) as Connection<N>;
}
