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
  type UploadableMap,
  type Variables,
} from "relay-runtime";
import { createClient, type Sink } from "graphql-ws";
import { BfError } from "lib/BfError.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

const subscriptionsClient = createClient({
  url: "/graphql",
});

async function fetchQuery(
  operation: RequestParameters,
  variables: Variables,
  _cacheConfig: CacheConfig,
  uploadables?: UploadableMap | null,
  _logRequestInfo?: LogRequestInfoFunction | null,
): Promise<
  GraphQLResponse
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

function fetchOrSubscribe(
  operation: RequestParameters,
  variables: Variables,
) {
  return Observable.create<GraphQLResponse>((sink) => {
    if (!operation.text) {
      return sink.error(new Error("Operation text cannot be empty"));
    }
    return subscriptionsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink as Sink,
    );
  });
}

// TODO: unify these... we only need fetchQuery for uploadables and login (since it sets cookies).
export const network = Network.create(fetchQuery, fetchOrSubscribe);

const store = new Store(new RecordSource());

const environment = new Environment({
  network,
  store,
});

export default environment;
