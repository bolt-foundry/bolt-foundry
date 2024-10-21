import { yoga } from "packages/graphql/graphql.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

import { Environment, Network, RecordSource, Store } from "relay-runtime"
import type { Maybe } from "packages/maybe.ts";

export function getEnvironment() {
  // Define a function that fetches the results of an operation (query/mutation/etc)
  // and returns its results as a Promise:
  function fetchQuery(
    operation: { text: Maybe<string> },
    variables: unknown,
  ) {
    const response = (yoga.fetch(
      new URL("/graphql", import.meta.url),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: operation.text, // GraphQL text from input
          variables,
        }),
      },
      {},
    )).then((response: { json: () => unknown }) => {
      return response.json();
    });
    return response;
  }
  // Create a network layer from the fetch function
  const network = Network.create(fetchQuery);
  const store = new Store(new RecordSource());
  const environment = new Environment({
    network,
    requiredFieldLogger: logger.error,
    store,
  });
  return environment;
}
