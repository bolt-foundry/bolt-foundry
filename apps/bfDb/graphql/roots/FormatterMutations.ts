import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";
import { getLogger } from "packages/logger/logger.ts";
import { generateUUID } from "lib/generateUUID.ts";

const logger = getLogger(import.meta);

export class FormatterMutations extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .mutation("createBolt", {
        args: (a) =>
          a
            .nonNull.string("name")
            .string("description")
            .nonNull.string("originalPrompt"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success")
            .string("id"),
        resolve(_src, { name, _description, originalPrompt }) {
          const boltId = generateUUID();
          logger.info("Creating bolt", { name, originalPrompt, boltId });
          return {
            success: true,
            message: `Bolt "${name}" created successfully`,
            id: boltId,
          };
        },
      })
      .mutation("updateBolt", {
        args: (a) =>
          a
            .nonNull.id("id")
            .string("name")
            .string("description")
            .string("status"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id, name, _description, _status }) {
          logger.info("Updating bolt", { id, name });
          return {
            success: true,
            message: `Bolt ${id} updated successfully`,
          };
        },
      })
      .mutation("addCard", {
        args: (a) =>
          a
            .nonNull.id("boltId")
            .nonNull.string("title")
            .nonNull.string("kind")
            .nonNull.string("text")
            .string("transition")
            .int("order"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { boltId, title, kind, _text, _transition, _order }) {
          logger.info("Adding card", { boltId, title, kind });
          return {
            success: true,
            message: `Card "${title}" added successfully`,
          };
        },
      })
      .mutation("updateCard", {
        args: (a) =>
          a
            .nonNull.id("id")
            .string("title")
            .string("text")
            .string("transition")
            .int("order"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id, title, _text, _transition, _order }) {
          logger.info("Updating card", { id, title });
          return {
            success: true,
            message: `Card ${id} updated successfully`,
          };
        },
      })
      .mutation("deleteCard", {
        args: (a) => a.nonNull.id("id"),
        returns: (r) => 
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id }) {
          logger.info("Deleting card", { id });
          return {
            success: true,
            message: `Card ${id} deleted successfully`,
          };
        },
      })
      .mutation("addVariable", {
        args: (a) =>
          a
            .nonNull.id("boltId")
            .nonNull.string("name")
            .string("description")
            .string("defaultValue")
            .int("order"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { boltId, name, _description, _defaultValue, _order }) {
          logger.info("Adding variable", { boltId, name });
          return {
            success: true,
            message: `Variable "${name}" added successfully`,
          };
        },
      })
      .mutation("updateVariable", {
        args: (a) =>
          a
            .nonNull.id("id")
            .string("name")
            .string("description")
            .string("defaultValue")
            .int("order"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id, name, _description, _defaultValue, _order }) {
          logger.info("Updating variable", { id, name });
          return {
            success: true,
            message: `Variable ${id} updated successfully`,
          };
        },
      })
      .mutation("deleteVariable", {
        args: (a) => a.nonNull.id("id"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id }) {
          logger.info("Deleting variable", { id });
          return {
            success: true,
            message: `Variable ${id} deleted successfully`,
          };
        },
      })
      .mutation("addTurn", {
        args: (a) =>
          a
            .nonNull.id("boltId")
            .nonNull.string("speaker")
            .nonNull.string("message")
            .int("order"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { boltId, speaker, _message, _order }) {
          logger.info("Adding turn", { boltId, speaker });
          return {
            success: true,
            message: `Turn from ${speaker} added successfully`,
          };
        },
      })
      .mutation("updateTurn", {
        args: (a) =>
          a
            .nonNull.id("id")
            .string("speaker")
            .string("message")
            .int("order"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id, speaker, _message, _order }) {
          logger.info("Updating turn", { id, speaker });
          return {
            success: true,
            message: `Turn ${id} updated successfully`,
          };
        },
      })
      .mutation("deleteTurn", {
        args: (a) => a.nonNull.id("id"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        resolve(_src, { id }) {
          logger.info("Deleting turn", { id });
          return {
            success: true,
            message: `Turn ${id} deleted successfully`,
          };
        },
      })
  );
}