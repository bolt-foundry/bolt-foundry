import { RelayRuntime } from "deps.ts";
import { getLogger } from "deps.ts";
import { BfError } from "lib/BfError.ts";

const logger = getLogger(import.meta);
const { Environment, Network, RecordSource, Store, Observable } = RelayRuntime;

function subscribe(
  operation: RelayRuntime.RequestParameters,
  variables: RelayRuntime.Variables,
) {
  return Observable.create((sink) => {
    if (!operation.text) throw new Error("No operation text");
    const eventSource = new EventSource(
      `/graphql?query=${encodeURIComponent(operation.text)}&variables=${
        encodeURIComponent(JSON.stringify(variables))
      }&operationName=${encodeURIComponent(operation.name)}`,
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      sink.next(data);
      if (eventSource.readyState === EventSource.CLOSED) {
        sink.complete();
      }
    };

    eventSource.onerror = (error) => {
      sink.error(error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  });
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
    const error = new BfError(
      `${returnResponse.errors[0].message}`,
    );
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
