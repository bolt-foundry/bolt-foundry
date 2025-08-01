/**
 * Type definitions and utilities for generating typed relationship methods
 * based on bfNodeSpec relations.
 *
 * This system will generate methods like:
 * - findBfGrader() / findBfSample()
 * - createBfGrader() / createBfSample()
 * - deleteBfGrader() / deleteBfSample()
 */

import type { AnyBfNodeCtor, RelationSpec } from "./types.ts";

/**
 * Type that extracts relation names from a node's bfNodeSpec
 */
export type RelationNames<T extends AnyBfNodeCtor> = T extends {
  bfNodeSpec: { relations: infer R };
} ? keyof R
  : never;

/**
 * Type that gets the target type for a specific relation
 */
export type RelationTarget<
  T extends AnyBfNodeCtor,
  R extends RelationNames<T>,
> = T extends { bfNodeSpec: { relations: infer Relations } }
  ? Relations extends Record<string, RelationSpec>
    ? Relations[R] extends
      { target: () => infer Target | Promise<infer Target> }
      ? Target extends AnyBfNodeCtor ? Target : never
    : never
  : never
  : never;

/**
 * Interface for generated relationship methods on a BfNode instance
 *
 * For each relation defined in bfNodeSpec, this generates:
 * - find{RelationName}(): Find the related node
 * - create{RelationName}(): Create and link a new related node
 * - delete{RelationName}(): Remove the relationship (and optionally the node)
 */
export type RelationshipMethods<T extends AnyBfNodeCtor> =
  & {
    [K in RelationNames<T> as `find${Capitalize<string & K>}`]: () => Promise<
      InstanceType<RelationTarget<T, K>> | null
    >;
  }
  & {
    [K in RelationNames<T> as `create${Capitalize<string & K>}`]: (
      props: RelationTarget<T, K> extends { bfNodeSpec: { fields: infer F } }
        ? { [P in keyof F]: import("./types.ts").FieldValue<F[P]> }
        : never,
    ) => Promise<InstanceType<RelationTarget<T, K>>>;
  }
  & {
    [K in RelationNames<T> as `delete${Capitalize<string & K>}`]: (
      options?: { deleteNode?: boolean },
    ) => Promise<void>;
  };

/**
 * Capitalizes the first letter of a string
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Generates relationship methods for a BfNode class based on its bfNodeSpec relations
 *
 * @param nodeClass The BfNode class to generate methods for
 * @param instance The instance to attach methods to
 */
export function generateRelationshipMethods<T extends AnyBfNodeCtor>(
  nodeClass: T,
  instance: InstanceType<T>,
): void {
  const spec = (nodeClass as AnyBfNodeCtor & {
    bfNodeSpec?: { relations?: Record<string, RelationSpec> };
  }).bfNodeSpec;
  if (!spec?.relations) return;

  for (const [relationName, relationSpec] of Object.entries(spec.relations)) {
    const relation = relationSpec as RelationSpec;
    const methodBaseName = capitalize(relationName);

    // Generate find method
    (instance as Record<string, unknown>)[`find${methodBaseName}`] =
      async function (this: typeof instance) {
        // For "one" relationships, query for the single related node
        if (relation.cardinality === "one") {
          // Need to determine if this is an outgoing or incoming relationship
          // For now, we'll try querySourceInstances first (assuming the related node points to this one)
          const TargetClass = await relation.target();
          let results = await this.querySourceInstances(
            TargetClass,
            {},
            {},
          );

          // If no results, try the other direction
          if (results.length === 0) {
            results = await this.queryTargetInstances(
              TargetClass,
              {},
              {},
            );
          }

          return results[0] || null;
        }
        // For "many" relationships (when implemented), return all
        throw new Error("Many relationships not yet implemented");
      };

    // Generate create method
    (instance as Record<string, unknown>)[`create${methodBaseName}`] =
      async function (this: typeof instance, props: Record<string, unknown>) {
        const TargetClass = await relation.target();
        const role = relation.props?.role || "";
        return this.createTargetNode(TargetClass, props, { role });
      };

    // Generate delete method
    (instance as Record<string, unknown>)[`delete${methodBaseName}`] =
      async function (
        this: typeof instance,
        options?: { deleteNode?: boolean },
      ) {
        const related = await this[`find${methodBaseName}`]();
        if (!related) return;

        // Import BfEdge to query and delete edges
        const { BfEdge } = await import(
          "@bfmono/apps/bfDb/nodeTypes/BfEdge.ts"
        );

        // Query for edges in both directions (since we don't know which way the edge points)
        const edgesFromThis = await BfEdge.query(
          this.currentViewer,
          {
            bfSid: this.metadata.bfGid,
            bfTid: related.metadata.bfGid,
            bfOid: this.currentViewer.orgBfOid,
          },
          {},
          [],
        );

        const edgesToThis = await BfEdge.query(
          this.currentViewer,
          {
            bfSid: related.metadata.bfGid,
            bfTid: this.metadata.bfGid,
            bfOid: this.currentViewer.orgBfOid,
          },
          {},
          [],
        );

        const edges = [...edgesFromThis, ...edgesToThis];

        // Delete all edges
        for (const edge of edges) {
          await edge.delete();
        }

        // Optionally delete the node itself
        if (options?.deleteNode) {
          await related.delete();
        }
      };
  }
}

/**
 * Example of how the types would work:
 *
 * class BfGraderResult extends BfNode {
 *   static bfNodeSpec = this.defineBfNode((f) =>
 *     f.one("bfGrader", () => BfGrader)
 *      .one("bfSample", () => BfSample)
 *   );
 * }
 *
 * // Generated methods on BfGraderResult instances:
 * graderResult.findBfGrader() // returns Promise<BfGrader | null>
 * graderResult.createBfGrader({ graderText: "..." }) // returns Promise<BfGrader>
 * graderResult.deleteBfGrader({ deleteNode: true }) // returns Promise<void>
 *
 * graderResult.findBfSample() // returns Promise<BfSample | null>
 * graderResult.createBfSample({ name: "...", ... }) // returns Promise<BfSample>
 * graderResult.deleteBfSample() // returns Promise<void>
 */
