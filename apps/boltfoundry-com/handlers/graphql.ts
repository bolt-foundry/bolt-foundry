import { yoga } from "@bfmono/apps/bfDb/graphql/graphqlServer.ts";
import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function handleGraphQLRequest(
  request: Request,
): Promise<Response> {
  try {
    // Create GraphQL context from the request
    using ctx = await createContext(request);

    // Forward the request to the bfDb GraphQL server
    const response = await yoga.fetch(request, ctx);

    logger.debug("GraphQL request handled successfully");
    return response;
  } catch (error) {
    logger.error("GraphQL request failed:", error);
    return new Response(
      JSON.stringify({
        errors: [{ message: "Internal GraphQL server error" }],
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
