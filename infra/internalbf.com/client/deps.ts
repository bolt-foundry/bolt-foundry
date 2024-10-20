/// <reference path="@types/google.accounts/index.d.ts" />
/// <reference path="@types/google.picker/index.d.ts" />
/// <reference path="@types/gapi.drive/index.d.ts" />
/// <reference path="@types/gapi/index.d.ts" />
export * as ReactDOMClient from "react-dom/client";
export * as GraphqlWs from "graphql-ws";
import "infra/__generated__/_graphql_imports.ts";
import * as ReactRelay from "react-relay";

export async function graphql(
  strings: TemplateStringsArray,
) {
  if (typeof Deno !== "undefined") {
    const string = strings.raw[0];
    // regex to find the action type (query, mutation, subscription, fragment) and the query/fragment name, and the type it is on
    const regex =
      /(?<action>query|mutation|subscription|fragment)\s+(?<name>\w+)(\s+on\s+(?<type>\w+))?/;
    const { action, name } = string?.match(regex)?.groups ?? {};
    if (action && name) {
      const importName = name;
      const generatedGraphQLFile = await import(
        `infra/__generated__/${importName}.graphql.ts`
      );
      return generatedGraphQLFile as typeof generatedGraphQLFile;
    }
  }

  return ReactRelay.graphql(strings);
}

export { ReactRelay };
