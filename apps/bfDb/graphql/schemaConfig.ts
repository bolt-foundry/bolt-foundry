import { connectionPlugin } from "nexus";
import type { SchemaConfig } from "nexus/dist/builder.js";
import { loadGqlTypes } from "./loadGqlTypes.ts";

export async function getSchemaOptions(): Promise<SchemaConfig> {
  return {
    // Use our new loadGqlTypes function which returns an array
    types: await loadGqlTypes(),
    features: {
      abstractTypeStrategies: {
        __typename: true,
        // Add resolveType for interface implementation
        resolveType: true,
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
}
