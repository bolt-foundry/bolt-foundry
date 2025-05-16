#! /usr/bin/env -S deno run --allow-write --allow-read --allow-env

import { connectionPlugin, makeSchema } from "nexus";
import { createYoga } from "graphql-yoga";

import { createContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { SchemaConfig } from "nexus/dist/builder.js";
import { getLogger } from "packages/logger/logger.ts";
import * as nodeTypes from "apps/bfDb/models/__generated__/nodeTypesList.ts";
import * as rootTypes from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import * as classTypes from "apps/bfDb/classes/__generated__/classesList.ts";

const logger = getLogger(import.meta);
logger.setLevel(logger.levels.DEBUG);

// Import our GraphQL builder tools
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import { objectType, queryType, interfaceType } from "nexus";

/**
 * Loads GraphQL types using our new builder pattern.
 * This dynamically loads all node types and root types in the system.
 */
export function loadGqlTypes() {
  const types: Record<string, unknown> = {};

  // Load all node types (BfPerson, BfOrganization, etc.)
  for (const [exportName, exportValue] of Object.entries(nodeTypes)) {
    if (
      exportValue &&
      typeof exportValue === "function" &&
      exportValue.gqlSpec
    ) {
      const className = exportName;
      const { mainType } = gqlSpecToNexus(exportValue.gqlSpec, className);
      types[className] = objectType(mainType);
    }
  }

  // Load all root types (Query, Mutation, etc.)
  for (const [exportName, exportValue] of Object.entries(rootTypes)) {
    if (
      exportValue &&
      typeof exportValue === "function" &&
      exportValue.gqlSpec
    ) {
      const className = exportName;
      const { mainType } = gqlSpecToNexus(exportValue.gqlSpec, className);
      if (className === "Query") {
        types[className] = queryType(mainType);
      } else {
        types[className] = objectType(mainType);
      }
    }
  }
  
  // Load all class types (CurrentViewer, etc.)
  for (const [exportName, exportValue] of Object.entries(classTypes)) {
    if (
      exportValue &&
      typeof exportValue === "function" &&
      exportValue.gqlSpec
    ) {
      const className = exportName;
      const { mainType } = gqlSpecToNexus(exportValue.gqlSpec, className);
      types[className] = objectType(mainType);
    }
  }
  
  // Explicitly define CurrentViewer types for the interface
  types.CurrentViewer = interfaceType({
    name: "CurrentViewer",
    resolveType: obj => {
      if (obj.__typename) return obj.__typename;
      return null;
    },
    definition(t) {
      t.nonNull.id("id");
      t.nonNull.string("personBfGid");
      t.nonNull.string("orgBfOid");
    }
  });
  
  // Define specific viewer types
  types.CurrentViewerLoggedIn = objectType({
    name: "CurrentViewerLoggedIn",
    definition(t) {
      t.implements("CurrentViewer");
      t.nonNull.id("id");
      t.nonNull.string("personBfGid");
      t.nonNull.string("orgBfOid");
    }
  });
  
  types.CurrentViewerLoggedOut = objectType({
    name: "CurrentViewerLoggedOut",
    definition(t) {
      t.implements("CurrentViewer");
      t.nonNull.id("id");
      t.nonNull.string("personBfGid");
      t.nonNull.string("orgBfOid");
    }
  });

  // Create a test GraphQL type to keep existing functionality
  types.TestType = objectType({
    name: "TestType",
    definition(t) {
      t.string("name");
      t.nonNull.id("id");
      t.boolean("isActive");
      t.int("count");
    },
  });

  // If we don't already have a Query type from root types, create a basic one
  if (!types.Query) {
    types.Query = queryType({
      definition(t) {
        // Test field
        t.field("test", {
          type: "TestType",
          resolve: () => ({
            id: "test-123",
            name: "Test Object",
            isActive: true,
            count: 42,
          }),
        });

        // Health check
        t.nonNull.boolean("ok", {
          resolve: () => true,
        });
      },
    });
  }

  // Return all the types
  return types;
}

const schemaOptions: SchemaConfig = {
  // Use our new loadGqlTypes function
  types: { ...loadGqlTypes() },
  features: {
    abstractTypeStrategies: {
      __typename: true,
    },
  },
  plugins: [
    connectionPlugin({
      validateArgs: (args) => {
        if (args.first == null && args.last == null) {
          args.first = 10;
        }
        return args;
      },
      extendConnection: {
        count: {
          type: "Int",
          requireResolver: false,
        },
      },
      includeNodesField: true,
    }),
  ],
};

export const schema = makeSchema(schemaOptions);

// Create a Yoga instance with a GraphQL schema.
export const yoga = createYoga({ schema });

export const graphQLHandler = async (req: Request) => {
  using ctx = await createContext(req);
  // @ts-expect-error bad types or something
  const res = await yoga.handleRequest(req, ctx);
  const responseHeaders = ctx.getResponseHeaders();

  for (const [k, v] of responseHeaders) res.headers.append(k, v);

  return res;
};

if (import.meta.main) {
  makeSchema({
    ...schemaOptions,
    types: { ...schemaOptions.types },
    contextType: {
      module: import.meta.resolve("./graphqlContext.ts").replace("file://", ""),
      export: "Context",
    },
    formatTypegen: (content, type) => {
      if (type === "schema") {
        return `### @generated \n${content}`;
      } else {
        return `/* @generated */\n// deno-lint-ignore-file\n${
          content.replace(
            /(["'])(\.+\/[^"']+)\1/g,
            "$1$2.ts$1",
          )
        }`;
      }
    },
    outputs: {
      schema: new URL(
        import.meta.resolve(`apps/bfDb/graphql/__generated__/schema.graphql`),
      )
        .pathname,
      typegen: new URL(
        import.meta.resolve(`apps/bfDb/graphql/__generated__/_nexustypes.ts`),
      )
        .pathname,
    },
  });
}
