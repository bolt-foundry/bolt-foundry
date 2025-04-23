import { BfPerson } from "apps/bfDb/models/BfPerson.ts";
import { BfOrganization } from "apps/bfDb/models/BfOrganization.ts";
import { getLogger } from "packages/logger/logger.ts";
import { defineGqlNode } from "apps/bfDb/graphql/builder/builder.ts";
import { GraphQLObjectBase } from "apps/bfDb/graphql/GraphQLObjectBase.ts";

const _logger = getLogger(import.meta);

/** GraphQL-visible singleton representing whoever is making the request. */
export class CurrentViewer extends GraphQLObjectBase {
  static override gqlSpec = defineGqlNode((field) => {
    field.boolean("isLoggedIn");
  });
  get isLoggedIn() {
    return false;
  }
}

export class CurrentViewerLoggedIn extends CurrentViewer {
  static override gqlSpec = defineGqlNode((field, relation) => {
    field.string("name");
    field.string("email");
    relation.one("person", () => BfPerson);
    relation.one("organization", () => BfOrganization);
  });
  override get isLoggedIn() {
    return true;
  }
  /* ------------------------------------------------------------------ */
  /*  Default field resolvers                                           */
  /* ------------------------------------------------------------------ */

  /** NB: the instance already *is* the runtime BfCurrentViewer */
  async person() {
  }

  async organization() {
  }
}

export class CurrentViewerLoggedOut extends CurrentViewer {
  static override gqlSpec = defineGqlNode(() => {});

  static create() {
    return new this();
  }
}
