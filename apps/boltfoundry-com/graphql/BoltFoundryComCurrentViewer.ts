/**
 * BoltFoundry.com specific viewer object for GraphQL
 *
 * This is a simple GraphQL object that provides blog and document query methods
 * for the boltfoundry-com application. It's completely separate from the
 * authentication CurrentViewer system.
 */

import { GraphQLObjectBase } from "@bfmono/apps/bfDb/graphql/GraphQLObjectBase.ts";

export class BoltFoundryComCurrentViewer extends GraphQLObjectBase {
  constructor() {
    super("boltfoundry-com-viewer");
  }

  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .string("id")
  );

  override toGraphql() {
    return {
      __typename: "BoltFoundryComCurrentViewer",
      id: this.id,
    };
  }
}
