import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export class Card extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .nonNull.string("title")
      .nonNull.string("kind") // persona, behavior, tool
      .string("transition") // transition text before the card content
      .nonNull.string("text") // main content
      .nonNull.id("boltId") // which bolt this card belongs to
      .int("order") // ordering within the bolt
      .string("createdAt")
      .string("updatedAt")
  );
}