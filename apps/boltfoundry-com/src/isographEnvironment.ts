import {
  createIsographEnvironment,
  createIsographStore,
} from "@isograph/react";

export function getEnvironment() {
  if (globalThis.__ISOGRAPH_ENVIRONMENT__) {
    return globalThis.__ISOGRAPH_ENVIRONMENT__;
  }

  function makeNetworkRequest<T>(
    queryText: string,
    variables: unknown,
  ): Promise<T> {
    return fetch("/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: queryText, variables }),
    }).then(async (response) => {
      const json = await response.json();
      if (response.ok) return json;
      throw new Error("NetworkError", { cause: json });
    });
  }

  globalThis.__ISOGRAPH_STORE__ ??= createIsographStore();
  return globalThis.__ISOGRAPH_ENVIRONMENT__ ??= createIsographEnvironment(
    globalThis.__ISOGRAPH_STORE__,
    makeNetworkRequest,
    null,
    console.debug,
  );
}
