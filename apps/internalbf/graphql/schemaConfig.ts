import { connectionPlugin } from "nexus";
import type { SchemaConfig } from "nexus/dist/builder.js";
import { Query } from "./roots/Query.ts";
import { Dashboard } from "./Dashboard.ts";

export async function getSchemaOptions(): Promise<SchemaConfig> {
  return {
    types: [Query, Dashboard],
    features: {
      abstractTypeStrategies: {
        __typename: true,
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
          count: { type: "Int", requireResolver: false },
        },
        includeNodesField: true,
      }),
    ],
  };
}