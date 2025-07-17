import {
  createIsographEnvironment,
  createIsographStore,
} from "@isograph/react";
import { getLogger } from "@bfmono/packages/logger/logger.ts";

const logger = getLogger(import.meta);

async function makeClientNetworkRequest<T>(
  queryText: string,
  variables: unknown,
): Promise<T> {
  const response = await fetch("/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: queryText, variables }),
  });

  const json = await response.json();

  if (response.ok) {
    return json;
  } else {
    throw new Error("NetworkError", {
      cause: json,
    });
  }
}

export function createClientEnvironment() {
  const store = createIsographStore();
  return createIsographEnvironment(
    store,
    makeClientNetworkRequest,
    null,
    logger.debug,
  );
}
