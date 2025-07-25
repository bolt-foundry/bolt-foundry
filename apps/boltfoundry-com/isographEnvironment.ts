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
    makeRealNetworkRequest, // Using real GraphQL requests
    null,
    logger.debug,
  );
}
