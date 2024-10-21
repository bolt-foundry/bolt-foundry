import { GraphqlWs } from "packages/client/deps.ts";
import { getLogger } from "packages/logger/logger.ts";
import { BfError } from "lib/BfError.ts";

const logger = getLogger(import.meta);
import {
  type CacheConfig,
  Environment,
  type GraphQLResponse,
  type LogRequestInfoFunction,
  Network,
  Observable,
  RecordSource,
  type RequestParameters,
  Store,
  type Subscribable,
  type UploadableMap,
  type Variables,
} from "relay-runtime";

let wsClient: GraphqlWs.Client;

// @ts-expect-error not typed
const subscribe = (operation, variables) => {
  return Observable.create<GraphQLResponse>((sink) => {
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

// Define a function that fetches the results of an operation (query/mutation/etc)
// and returns its results as a Promise:
async function fetchQuery(
  operation: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
  _logRequestInfo?: LogRequestInfoFunction | null,
): Promise<
  | GraphQLResponse
  | Subscribable<GraphQLResponse>
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
    const error = new BfError(
      `${returnResponse.errors[0].message}`,
    );
    throw error;
  }
  return returnResponse as GraphQLResponse;
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
