import {
  createIsographEnvironment,
  createIsographStore,
} from "@isograph/react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { yoga } from "@bfmono/apps/bfDb/graphql/graphqlServer.ts";
import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";

const logger = getLogger(import.meta);

async function makeServerNetworkRequest<T>(
  queryText: string,
  variables: unknown,
): Promise<T> {
  // Create a mock request for the GraphQL context
  const request = new Request("http://localhost/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: queryText, variables }),
  });

  using ctx = await createContext(request);
  // @ts-expect-error yoga types
  const response = await yoga.handleRequest(request, ctx);
  const json = await response.json();

  if (response.ok) {
    return json;
  } else {
    throw new Error("NetworkError", {
      cause: json,
    });
  }
}

export function createServerEnvironment() {
  const store = createIsographStore();
  return createIsographEnvironment(
    store,
    makeServerNetworkRequest,
    null,
    logger.debug,
  );
}
