import {
  createIsographEnvironment,
  createIsographStore,
} from "@isograph/react";
// import { getContextFromRequest } from "apps/bfDb/getCurrentViewer.ts";
import { yoga } from "@bfmono/apps/bfDb/graphql/graphqlServer.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
const logger = getLogger(import.meta);

export function getIsographEnvironment(request: Request) {
  const store = createIsographStore();

  async function makeNetworkRequest<T>(
    queryText: string,
    variables: unknown,
  ): Promise<T> {
    using ctx = await createContext(request);

    const response = await yoga.fetch(
      new URL("/graphql", import.meta.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryText, variables }),
      },
      ctx,
    );
    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      throw new Error("NetworkError", {
        cause: json,
      });
    }
  }
  return createIsographEnvironment(
    store,
    makeNetworkRequest,
    null,
    logger.debug,
  );
}
