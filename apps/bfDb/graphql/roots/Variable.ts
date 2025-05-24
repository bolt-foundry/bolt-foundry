import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export class Variable extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .nonNull.string("name")
      .string("description")
      .string("defaultValue")
      .nonNull.id("boltId") // which bolt this variable belongs to
      .int("order") // ordering within the bolt
      .string("createdAt")
      .string("updatedAt")
  );
}