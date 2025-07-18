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

function makeMockedNetworkRequest<T>(
  _request: Request,
  queryText: string,
  variables: unknown,
): Promise<T> {
  logger.debug("Mock GraphQL request (server):", { queryText, variables });

  // Mock GraphQL response for now - same as client
  const mockResponse = {
    data: {
      __typename: "Query",
      // Mock data for EntrypointHome
      EntrypointHome: {
        Home: {
          __typename: "HomeComponent",
        },
      },
      // Mock currentViewer data for testing authentication UI
      currentViewer: {
        __typename: "CurrentViewerLoggedOut",
        id: "mock-viewer",
        orgBfOid: null,
        personBfGid: null,
      },
    },
  };

  logger.debug("Mock GraphQL response (server):", mockResponse);
  return Promise.resolve(mockResponse as T);
}

export function getIsographEnvironment(request: Request) {
  const store = createIsographStore();

  async function networkRequestWrapper<T>(
    queryText: string,
    variables: unknown,
  ): Promise<T> {
    return await makeRealNetworkRequest(request, queryText, variables); // Use real GraphQL server
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
