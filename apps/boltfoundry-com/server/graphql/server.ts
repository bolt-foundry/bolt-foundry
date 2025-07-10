import { createYoga } from "graphql-yoga";
import { schema } from "./schema.ts";

export const yoga = createYoga({
  schema,
  graphqlEndpoint: "/graphql",
  context: async ({ request }) => {
    return {
      request,
    };
  },
});
