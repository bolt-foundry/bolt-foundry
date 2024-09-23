import { GraphQLYoga } from "packages/graphql/deps.ts";
import { schema } from "packages/graphql/schema.ts";
import { getLogger } from "deps.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
// import { startupBackend } from "packages/events/mod.ts";
import { getContextFromRequest } from "packages/bfDb/getCurrentViewer.ts";
import {
  CloseCode,
  GRAPHQL_TRANSPORT_WS_PROTOCOL,
  makeServer,
} from "graphql-ws";
const logger = getLogger(import.meta);

const { createYoga } = GraphQLYoga;

export type GraphQLServerContext = Record<string, unknown>;

export type GraphQLUserContext = {
  bfCurrentViewer: BfCurrentViewer;
  responseHeaders: Headers;
};

export type GraphQLContext = GraphQLUserContext & GraphQLServerContext;

export const yoga = createYoga<GraphQLServerContext, GraphQLUserContext>({
  graphqlEndpoint: "/graphql",
  graphiql: {
    subscriptionsProtocol: "WS",
    defaultQuery: 
      `query LoggedInUserAccountsQuery {
        currentViewer {
          person {
            accounts(first:10) {
              nodes {
                id
              }
            }
          }
        }
      }`,
  },
  schema,
});

export async function handler(request: Request): Promise<Response> {
  const ctx = await getContextFromRequest(request);

  if (request.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(request, {
      protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
      idleTimeout: 12_000,
    });

    let closed: (code: number, reason: string) => void = () => {
      // noop
    };

    const wsServer = makeServer({
      onSubscribe: (context, msg) => {
        const { schema, execute, subscribe, parse, validate } = yoga
          .getEnveloped({
            ...context,
            req: request,
            socket: socket,
            params: msg.payload,
          });

        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: ctx,
          rootValue: {
            execute,
            subscribe,
          },
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    });

    socket.onopen = () => {
      logger.debug("WebSocket connection established", socket.protocol);
      closed = wsServer.opened(
        {
          protocol: GRAPHQL_TRANSPORT_WS_PROTOCOL,
          send: (msg) => socket.send(msg),
          close: (code, reason) => socket.close(code, reason),
          onMessage: (cb) => {
            socket.onmessage = async (event) => {
              try {
                await cb(String(event.data));
              } catch (err) {
                logger.error(
                  "Internal error occurred during message handling. " +
                    "Please check your implementation.",
                  err,
                );
                socket.close(
                  CloseCode.InternalServerError,
                  "Internal server error",
                );
              }
            };
          },
        },
        { socket },
      );
    };

    socket.onclose = (event) => {
      closed(event.code, event.reason);
    };

    return response;
  }

  const yogaResponse = await yoga(request, ctx);
  logger.debug("headers", ctx.responseHeaders);
  for (const [key, value] of ctx.responseHeaders.entries()) {
    yogaResponse.headers.append(key, value);
  }

  logger.debug("yoga response", yogaResponse);
  return yogaResponse;
}
