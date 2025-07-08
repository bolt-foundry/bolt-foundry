import { createYoga } from "graphql-yoga";
import { makeSchema } from "nexus";
import { getSchemaOptions } from "../../graphql/schemaConfig.ts";

// Create the GraphQL server instance
export const createGraphQLServer = async (isDev: boolean) => {
  // Generate the schema using our loadGqlTypes
  const schemaOptions = await getSchemaOptions();
  const schema = makeSchema({
    ...schemaOptions,
    types: { ...schemaOptions.types },
    outputs: false, // Don't generate files during server startup
  });

  return createYoga({
    schema,
    graphiql: isDev, // Enable GraphiQL only in dev mode
    landingPage: false,
    maskedErrors: !isDev, // Show detailed errors only in dev mode
  });
};
