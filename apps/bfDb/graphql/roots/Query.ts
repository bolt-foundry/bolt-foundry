import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { systemQueries } from "@bfmono/apps/bfDb/graphql/queries/systemQueries.ts";

/**
 * Query root class that demonstrates fragment composition
 *
 * This class now uses the fragment composition system to build the Query root
 * from modular fragments, while maintaining the exact same schema output
 * for backward compatibility.
 */
export class Query extends GraphQLObjectBase {
  /**
   * Legacy implementation - maintains exact same schema output
   * Uses fragments internally but composes them into the same structure
   */
  static override gqlSpec = (() => {
    // Merge all query fragments into a single spec
    const mergedSpec = {
      fields: {},
      relations: {},
      connections: {},
      mutations: {},
    };

    // Merge system queries
    Object.assign(mergedSpec.fields, systemQueries.spec.fields);
    Object.assign(mergedSpec.relations, systemQueries.spec.relations);
    if (systemQueries.spec.connections) {
      Object.assign(mergedSpec.connections, systemQueries.spec.connections);
    }

    return mergedSpec;
  })();

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
