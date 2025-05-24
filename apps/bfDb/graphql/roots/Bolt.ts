import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export class Bolt extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .nonNull.string("name")
      .string("description")
      .nonNull.string("status") // draft, published, archived
      .string("originalPrompt")
      .string("createdAt")
      .string("updatedAt")
  );
}