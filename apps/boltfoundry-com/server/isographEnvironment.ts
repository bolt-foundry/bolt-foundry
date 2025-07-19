import {
  createIsographEnvironment,
  createIsographStore,
} from "@isograph/react";
import { yoga } from "@bfmono/apps/bfDb/graphql/graphqlServer.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { createContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";

const logger = getLogger(import.meta);

async function makeRealNetworkRequest<T>(
  request: Request,
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

export function getIsographEnvironment(request: Request) {
  const store = createIsographStore();

  async function networkRequestWrapper<T>(
    queryText: string,
    variables: unknown,
  ): Promise<T> {
    // Use yoga directly for server-side rendering instead of HTTP requests
    using ctx = await createContext(request);

    const response = await yoga.fetch(
      new Request("http://localhost/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: queryText, variables }),
      }),
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
    networkRequestWrapper,
    null,
    logger.debug,
  );
}

export function getRealIsographEnvironment(request: Request) {
  const store = createIsographStore();

  async function networkRequestWrapper<T>(
    queryText: string,
    variables: unknown,
  ): Promise<T> {
    return await makeRealNetworkRequest(request, queryText, variables); // Real GraphQL requests
  }

  return createIsographEnvironment(
    store,
    networkRequestWrapper,
    null,
    logger.debug,
  );
}
