import { GraphQLObjectBase } from "../GraphQLObjectBase.ts";

export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .boolean("ok")
      // TODO: Add query operations after .object() method is implemented
      /*
      .object("bolt", () => Bolt, {
        args: (a) => a.nonNull.id("id"),
        resolve: async (_src, { id }) => {
          logger.info("Fetching bolt", { id });
          // Stubbed implementation - return mock data
          return {
            __typename: "Bolt",
            id,
            name: "Mock Bolt",
            description: "A mock bolt for testing",
            status: "draft",
            originalPrompt: "Help me with my task",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      })
      .object("bolts", () => Bolt, {
        args: (a) => a.int("limit").int("offset"),
        resolve: async (_src, { limit = 10, offset = 0 }) => {
          logger.info("Fetching bolts", { limit, offset });
          // Stubbed implementation - return mock data
          const mockBolts = [
            {
              __typename: "Bolt",
              id: "1234",
              name: "Original prompt",
              description: "Initial user prompt",
              status: "draft",
              originalPrompt: "Help me with my task",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Bolt",
              id: "5678", 
              name: "Initial bolt",
              description: "Formatted version of original prompt",
              status: "draft",
              originalPrompt: "Help me with my task using best practices",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          return mockBolts[0]; // Return first bolt for now
        },
      })
      // Card queries
      .object("card", () => Card, {
        args: (a) => a.nonNull.id("id"),
        resolve: async (_src, { id }) => {
          logger.info("Fetching card", { id });
          return {
            __typename: "Card",
            id,
            title: "Mock Card",
            kind: "persona",
            transition: null,
            text: "Mock card content",
            boltId: "mock-bolt",
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      })
      .object("cardsByBolt", () => Card, {
        args: (a) => a.nonNull.id("boltId"),
        resolve: async (_src, { boltId }) => {
          logger.info("Fetching cards by bolt", { boltId });
          // Stubbed implementation - return mock cards
          const mockCards = [
            {
              __typename: "Card",
              id: "card-1",
              title: "Intro",
              kind: "persona",
              transition: null,
              text: "This is the intro card",
              boltId,
              order: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Card",
              id: "card-2", 
              title: "Assistant Persona",
              kind: "persona",
              transition: "This is the assistant persona card",
              text: "You are a helpful assistant.",
              boltId,
              order: 2,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Card",
              id: "card-3",
              title: "User Persona", 
              kind: "persona",
              transition: "This is the user persona card",
              text: "You are a user.",
              boltId,
              order: 3,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Card",
              id: "card-4",
              title: "Behavior name",
              kind: "behavior",
              transition: "This is the behavior card",
              text: "You are helpful, creative, clever, and very friendly.",
              boltId,
              order: 4,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Card",
              id: "card-5",
              title: "confirm_fax_number",
              kind: "tool",
              transition: null,
              text: "Use this function to collect the phone number and verify it to use to send a fax.",
              boltId,
              order: 5,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          return mockCards[0]; // Return first card for now
        },
      })
      // Variable queries
      .object("variable", () => Variable, {
        args: (a) => a.nonNull.id("id"),
        resolve: async (_src, { id }) => {
          logger.info("Fetching variable", { id });
          return {
            __typename: "Variable",
            id,
            name: "mock_variable",
            description: "A mock variable",
            defaultValue: "mock value",
            boltId: "mock-bolt",
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      })
      .object("variablesByBolt", () => Variable, {
        args: (a) => a.nonNull.id("boltId"),
        resolve: async (_src, { boltId }) => {
          logger.info("Fetching variables by bolt", { boltId });
          // Stubbed implementation - return mock variables
          const mockVariables = [
            {
              __typename: "Variable",
              id: "var-1",
              name: "post_description",
              description: "Description of the post",
              defaultValue: "This is a post",
              boltId,
              order: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Variable",
              id: "var-2",
              name: "post_platform",
              description: "Platform of the post", 
              defaultValue: "Facebook",
              boltId,
              order: 2,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          return mockVariables[0]; // Return first variable for now
        },
      })
      // Turn queries
      .object("turn", () => Turn, {
        args: (a) => a.nonNull.id("id"),
        resolve: async (_src, { id }) => {
          logger.info("Fetching turn", { id });
          return {
            __typename: "Turn",
            id,
            speaker: "assistant",
            message: "Mock turn message",
            boltId: "mock-bolt",
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      })
      .object("turnsByBolt", () => Turn, {
        args: (a) => a.nonNull.id("boltId"),
        resolve: async (_src, { boltId }) => {
          logger.info("Fetching turns by bolt", { boltId });
          // Stubbed implementation - return mock turns
          const mockTurns = [
            {
              __typename: "Turn",
              id: "turn-1",
              speaker: "assistant",
              message: "This is the assistant turn",
              boltId,
              order: 1,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            {
              __typename: "Turn",
              id: "turn-2",
              speaker: "user",
              message: "This is the user turn",
              boltId,
              order: 2,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ];
          return mockTurns[0]; // Return first turn for now
        },
      })
      */
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
