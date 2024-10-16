import { GraphqlWs, RelayRuntime } from "aws/client/deps.ts";
import { createLogger } from "aws/logs/mod.ts";
const log = createLogger("relay-environment", "debug");
const logError = createLogger("relay-environment", "error");

const { Environment, Network, RecordSource, Store, Observable } = RelayRuntime;

let wsClient: GraphqlWs.Client;

// @ts-expect-error not typed
const subscribe = (operation, variables) => {
  return Observable.create<RelayRuntime.GraphQLResponse>((sink) => {
    if (typeof Deno === "undefined" && !wsClient) {
      log("Creating WS client");
      // @ts-expect-error global environment isn't typed
      let url = `wss://${globalThis.__ENVIRONMENT__.WS_DOMAIN_NAME}/`;
      const parsedCookie = decodeURIComponent(document.cookie);
      const devTokenCookie = parsedCookie
        .split(";")
        .find((c) => c.trim().startsWith("BF_DevOnlyAccessToken"));

      const idTokenCookie = parsedCookie
        .split(";")
        .find((c) => c.trim().startsWith("BF_DevOnlyIdToken"));

      if (devTokenCookie && idTokenCookie) {
        const accessToken = devTokenCookie.split("=")[1];
        const idToken = idTokenCookie.split("=")[1];
        url += `?access_token=${accessToken}&id_token=${idToken}`;
      }
      wsClient = GraphqlWs.createClient({
        url,
        lazy: false,
      });
    }

    if (wsClient != null) {
      log("WS client exists, subscribing");
      return wsClient.subscribe(
        {
          operationName: operation.name,
          query: operation.text,
          variables,
        },
        sink,
      );
    }
    log("WS client not created yet");
  });
};

class CustomError extends Error {
  code?: string;

  constructor(message?: string, code?: string) {
    super(message); // Pass the message to the Error constructor.
    this.code = code;
  }
}

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
async function fetchQuery(
  // @ts-expect-error not typed
  operation,
  variables: unknown,
  _cacheConfig: unknown,
  _uploadables: unknown,
) {
  const response = await fetch(
    new URL("/aws-graphql", import.meta.url),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: operation.text,
        variables,
      }),
    },
  );
  console.log(response)
  const returnResponse = await response.json();
  if (returnResponse.errors) {
    logError(returnResponse.errors);
    const error = new CustomError(
      `GraphQL Error: ${returnResponse.errors[0].message}`,
    );
    error.code = returnResponse.errors[0].extensions?.code;
    throw error;
  }
  return returnResponse as RelayRuntime.GraphQLResponse;
}

// Create a network layer from the fetch function
const network = Network.create(fetchQuery, subscribe);
const store = new Store(new RecordSource());

const environment = new Environment({
  network,
  store,
  // deno-lint-ignore no-console
  requiredFieldLogger: console.error,
});

export default environment;
