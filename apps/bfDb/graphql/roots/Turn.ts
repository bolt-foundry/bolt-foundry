import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export class Turn extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .nonNull.string("speaker") // assistant, user
      .nonNull.string("message") // the content of the turn
      .nonNull.id("boltId") // which bolt this turn belongs to
      .int("order") // ordering within the bolt
      .string("createdAt")
      .string("updatedAt")
  );
}