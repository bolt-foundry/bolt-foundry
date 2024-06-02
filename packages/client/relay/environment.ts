import { RelayRuntime } from "deps.ts";
import { GraphqlWs } from "packages/client/deps.ts";
import { getLogger } from "deps.ts";

const logger = getLogger(import.meta);
const { Environment, Network, RecordSource, Store, Observable } = RelayRuntime;

let wsClient: GraphqlWs.Client;

// @ts-expect-error not typed
const subscribe = (operation, variables) => {
  return Observable.create<RelayRuntime.GraphQLResponse>((sink) => {
    if (typeof Deno === "undefined" && !wsClient) {
      logger.debug("Creating WS client");
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
      logger.debug("WS client exists, subscribing");
      return wsClient.subscribe(
        {
          operationName: operation.name,
          query: operation.text,
          variables,
        },
        sink,
      );
    }
    logger.debug("WS client not created yet");
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
  operation: RelayRuntime.RequestParameters,
  variables: RelayRuntime.Variables,
  _cacheConfig: RelayRuntime.CacheConfig,
  uploadables?: RelayRuntime.UploadableMap | null,
  _logRequestInfo?: RelayRuntime.LogRequestInfoFunction | null,
): Promise<
  | RelayRuntime.GraphQLResponse
  | RelayRuntime.Subscribable<RelayRuntime.GraphQLResponse>
> {
  let body: BodyInit;
  const headers: HeadersInit = {};

  if (uploadables && Object.keys(uploadables).length > 0) {
    const formData = new FormData();
    formData.append(
      "operations",
      JSON.stringify({
        query: operation.text,
        variables,
      }),
    );
    const map: { [key: string]: string[] } = {};
    Object.entries(uploadables).forEach(([key, file]) => {
      formData.append(key, file);
      map[key] = [`variables.${key}`];
    });
    formData.append("map", JSON.stringify(map));
    body = formData;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({
      query: operation.text,
      variables,
    });
  }

  // #BOOTCAMPTASK: Change this so it returns an observable so we can report upload progress
  const response = await fetch(
    new URL("/graphql", import.meta.url),
    {
      method: "POST",
      headers,
      body,
    },
  );

  const returnResponse = await response.json();
  if (returnResponse.errors) {
    logger.error(returnResponse.errors);
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
  requiredFieldLogger: logger.error,
});

export default environment;
