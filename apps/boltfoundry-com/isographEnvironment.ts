import {
  createIsographEnvironment,
  createIsographStore,
} from "@isograph/react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

function makeRealNetworkRequest<T>(
  queryText: string,
  variables: unknown,
): Promise<T> {
  const promise = fetch(
    "/graphql",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: queryText, variables }),
    },
  ).then(async (response) => {
    const json = await response.json();

    if (response.ok) {
      return json;
    } else {
      throw new Error("NetworkError", {
        cause: json,
      });
    }
  });
  return promise;
}

function makeMockedNetworkRequest<T>(
  queryText: string,
  variables: unknown,
): Promise<T> {
  logger.debug("Mock GraphQL request:", { queryText, variables });

  // Mock GraphQL response for now
  const mockResponse = {
    data: {
      __typename: "Query",
      // Mock data for EntrypointHome
      EntrypointHome: {
        Home: {
          __typename: "HomeComponent",
        },
      },
    },
  };

  logger.debug("Mock GraphQL response:", mockResponse);
  return Promise.resolve(mockResponse as T);
}

export function getEnvironment() {
  // @ts-expect-error Not typed on the window yet
  if (globalThis.__ISOGRAPH_ENVIRONMENT__) {
    // @ts-expect-error Not typed on the window yet
    return globalThis.__ISOGRAPH_ENVIRONMENT__;
  }

  // @ts-expect-error Not typed on the window yet
  globalThis.__ISOGRAPH_STORE__ ??= createIsographStore();
  // @ts-expect-error Not typed on the window yet
  return globalThis.__ISOGRAPH_ENVIRONMENT__ ??= createIsographEnvironment(
    // @ts-expect-error Not typed on the window yet
    globalThis.__ISOGRAPH_STORE__,
    makeMockedNetworkRequest, // Using mocked version for now
    null,
    logger.debug,
  );
}

export function getRealEnvironment() {
  // @ts-expect-error Not typed on the window yet
  if (globalThis.__ISOGRAPH_ENVIRONMENT__) {
    // @ts-expect-error Not typed on the window yet
    return globalThis.__ISOGRAPH_ENVIRONMENT__;
  }

  // @ts-expect-error Not typed on the window yet
  globalThis.__ISOGRAPH_STORE__ ??= createIsographStore();
  // @ts-expect-error Not typed on the window yet
  return globalThis.__ISOGRAPH_ENVIRONMENT__ ??= createIsographEnvironment(
    // @ts-expect-error Not typed on the window yet
    globalThis.__ISOGRAPH_STORE__,
    makeRealNetworkRequest, // Real GraphQL requests
    null,
    logger.debug,
  );
}
