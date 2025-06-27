import { createYoga } from "graphql-yoga";
import { makeSchema } from "nexus";
import { getSchemaOptions } from "./schemaConfig.ts";

// Create Nexus schema
export const schema = await makeSchema(await getSchemaOptions());

// Create Yoga server instance
export const createGraphQLServer = (isDev: boolean) => {
  return createYoga({
    schema,
    graphiql: isDev, // Enable GraphiQL only in dev mode
    landingPage: false,
    maskedErrors: !isDev, // Show detailed errors only in dev mode
  });
};