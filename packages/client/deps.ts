export * as ReactDOMClient from "react-dom/client";
export * as GraphqlWs from "graphql-ws";
import "packages/__generated__/_graphql_imports.ts";
import * as ReactRelay from "react-relay";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function graphql(
  strings: TemplateStringsArray,
): Promise<ReactRelay.GraphQLTaggedNode> {
  if (typeof Deno !== "undefined") {
    const string = strings.raw[0];
    // regex to find the action type (query, mutation, subscription, fragment) and the query/fragment name, and the type it is on
    const regex =
      /(?<action>query|mutation|subscription|fragment)\s+(?<name>\w+)(\s+on\s+(?<type>\w+))?/;
    const { action, name } = string?.match(regex)?.groups ?? {};
    if (action && name) {
      const importName = name;
      try {
        const generatedGraphQLFile = await import(
          `packages/__generated__/${importName}.graphql.ts`
        );
        return generatedGraphQLFile as typeof generatedGraphQLFile;
      } catch {
        logger.warn(`Can't find ${importName}.graphql.ts`);
        return ReactRelay.graphql([""]);
      }
    }
  }

  return ReactRelay.graphql(strings);
}

export { ReactRelay };
