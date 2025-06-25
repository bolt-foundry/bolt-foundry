import { createYoga } from "graphql-yoga";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";

// Create a simple hello world schema
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      hello: {
        type: GraphQLString,
        resolve: () => "Hello from aibff GUI!",
      },
    },
  }),
});

// Create the Yoga server instance
export const createGraphQLServer = (isDev: boolean) => {
  return createYoga({
    schema,
    graphiql: isDev, // Enable GraphiQL only in dev mode
    landingPage: false,
    maskedErrors: !isDev, // Show detailed errors only in dev mode
  });
};
