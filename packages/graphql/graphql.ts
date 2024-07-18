import { GraphQLYoga } from "packages/graphql/deps.ts";
import { schema } from "packages/graphql/schema.ts";
import { getLogger } from "deps.ts";
import { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
// import { startupBackend } from "packages/events/mod.ts";
import { getContextFromRequest } from "packages/bfDb/getCurrentViewer.ts";
const logger = getLogger(import.meta);

const { createYoga } = GraphQLYoga;

export type GraphQLServerContext = Record<string, unknown>;

export type GraphQLUserContext = {
  bfCurrentViewer: BfCurrentViewer;
  responseHeaders: Headers;
};

export type GraphQLContext = GraphQLUserContext & GraphQLServerContext;

export const yoga = createYoga<GraphQLServerContext, GraphQLUserContext>({
  graphqlEndpoint: "/graphql",
  graphiql: Deno.env.get("BF_ENV") === "DEVELOPMENT",
  schema,
});

export async function handler(request: Request): Promise<Response> {
  const ctx = await getContextFromRequest(request);

  const yogaResponse = await yoga(request, ctx);
  logger.trace("headers", ctx.responseHeaders);
  for (const [key, value] of ctx.responseHeaders.entries()) {
    yogaResponse.headers.append(key, value);
  }

  logger.trace("yoga response", yogaResponse);
  return yogaResponse;
}
