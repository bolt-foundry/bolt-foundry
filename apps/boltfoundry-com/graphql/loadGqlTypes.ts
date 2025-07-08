/**
 * GraphQL Type Loading for boltfoundry-com
 *
 * This file selectively imports specific BfDb models for the public site.
 * We opt-in only the models we need rather than importing everything.
 */

import { extendType, objectType } from "nexus";
import { gqlSpecToNexus } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import type { AnyGraphqlObjectBaseCtor } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";

// Opt-in specific BfDb models
import { CurrentViewer } from "@bfmono/apps/bfDb/classes/CurrentViewer.ts";
import { GithubRepoStats } from "@bfmono/apps/bfDb/nodeTypes/GithubRepoStats.ts";

/**
 * Load selected GraphQL types for the public site.
 * This is a minimal subset focused on the public-facing features.
 */
export async function loadGqlTypes() {
  const types = [];
  const payloadTypeObjects: Record<string, unknown> = {};
  const mutationTypes = [];

  // Selected models to include in the schema
  const selectedModels = [
    CurrentViewer,
    GithubRepoStats,
  ];

  // Process each selected model
  for (const modelType of selectedModels) {
    // Skip if it's not a class with gqlSpec
    if (!modelType.gqlSpec || typeof modelType !== "function") continue;

    const modelSpec = modelType.gqlSpec;
    const modelName = modelType.name;

    const nexusTypes = await gqlSpecToNexus(modelSpec, modelName, {
      classType: modelType as AnyGraphqlObjectBaseCtor,
    });

    const mainType = objectType(nexusTypes.mainType);
    types.push(mainType);

    // Process payload types if they exist
    if (nexusTypes.payloadTypes) {
      for (
        const [typeName, typeDef] of Object.entries(
          nexusTypes.payloadTypes,
        )
      ) {
        payloadTypeObjects[typeName] = objectType(
          typeDef as Parameters<typeof objectType>[0],
        );
      }
    }

    // Create the mutation type if it exists
    if (nexusTypes.mutationType) {
      const mutationType = extendType(
        nexusTypes.mutationType as Parameters<typeof extendType>[0],
      );
      mutationTypes.push(mutationType);
    }
  }

  // Add Query.currentViewer field that returns the CurrentViewer
  const queryExtension = extendType({
    type: "Query",
    definition(t) {
      t.field("currentViewer", {
        type: "CurrentViewer",
        resolve: async (_root, _args, ctx) => {
          // In a real app, this would use the GraphQL context to determine the current user
          // For our Hello World example, we'll return a logged-out viewer
          return CurrentViewer.makeLoggedOutCv();
        },
      });

      // Note: No HomePage server field - this will be a client field only
    },
  });

  // Add CurrentViewer fields and fix ID field
  const currentViewerExtension = extendType({
    type: "CurrentViewer",
    definition(t) {
      // Override the ID field to be non-null as required by Isograph
      t.nonNull.id("id");

      t.field("githubRepoStats", {
        type: "GithubRepoStats",
        resolve: async (_root, _args, ctx) => {
          // Return the singleton GithubRepoStats instance
          return await GithubRepoStats.findX();
        },
      });

      // Note: No server field "Home" - this will be a client field only
    },
  });

  // Return the types - order matters for Nexus!
  return [
    ...types,
    queryExtension,
    currentViewerExtension,
    ...Object.values(payloadTypeObjects),
    ...mutationTypes,
  ];
}
