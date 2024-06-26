import { Maybe, RelayRuntime } from "aws/client/deps.ts";
// import type { Person } from "aws/graphql/models/Person.ts";

const { Environment, Network, RecordSource, Store } = RelayRuntime;

export default function getEnvironment(currentViewer = {}) {
  // // Define a function that fetches the results of an operation (query/mutation/etc)
  // // and returns its results as a Promise:
  function fetchQuery(
    operation: { text: Maybe<string> },
    variables: unknown,
  ) {
    const response = (fetch(
      new URL("/og-graphql", "https://boltfoundry.com"),
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
    )).then((response: { json: () => unknown }) => {
      return response.json();
    });
    return response;
  }
  // // Create a network layer from the fetch function
  const network = Network.create(fetchQuery);
  const store = new Store(new RecordSource());
  const environment = new Environment({
    network,
    // deno-lint-ignore no-console
    requiredFieldLogger: console.error,
    store,
  });
  return environment;
}
