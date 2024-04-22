import { cookie, GraphQLYoga } from "packages/graphql/deps.ts";
import { schema } from "packages/graphql/schema.ts";
import { getLogger } from "deps.ts";
import {
  BfCurrentViewer,
  BfCurrentViewerAccessToken,
  BfCurrentViewerAnon,
} from "packages/bfDb/classes/BfCurrentViewer.ts";
// import { startupBackend } from "packages/events/mod.ts";
import { BfAccount } from "packages/bfDb/models/BfAccount.ts";
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
  graphiql: true,
  schema,
});

export async function handler(request: Request): Promise<Response> {
  const cookies = cookie.getCookies(request.headers);
  const accessToken = cookies.BF_AT;
  const refreshToken = cookies.BF_RT;
  const responseHeaders = new Headers();

  let bfCurrentViewer = await BfCurrentViewerAccessToken.create(
    import.meta,
    accessToken,
  );
  // startupBackend();
  if (bfCurrentViewer instanceof BfCurrentViewerAnon && refreshToken) {
    logger.debug("Found refresh token, refreshing access token");
    try {
      const nextAccessToken = await BfAccount.getRefreshedAccessToken(
        import.meta,
        refreshToken,
      );
      responseHeaders.append(
        "Set-Cookie",
        `BF_AT=${nextAccessToken}; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
      bfCurrentViewer = await BfCurrentViewerAccessToken.create(
        import.meta,
        nextAccessToken,
      );
    } catch {
      logger.error("couldnt refresh access token");
      responseHeaders.append(
        "Set-Cookie",
        `BF_AT=; HttpOnly; Path=/; Secure; SameSite=Strict`,
      );
    }
  }
  const ctx: GraphQLContext = {
    bfCurrentViewer,
    responseHeaders,
  };
  const yogaResponse = await yoga(request, ctx);
  logger.debug("headers", responseHeaders);
  for (const [key, value] of responseHeaders.entries()) {
    yogaResponse.headers.append(key, value);
  }

  logger.debug("yoga response", yogaResponse);
  return yogaResponse;
}
