import type { SchemaConfig } from "nexus/dist/builder.js";
import { loadGqlTypes } from "./loadGqlTypes.ts";

export async function getSchemaOptions(): Promise<SchemaConfig> {
  return {
    // Use our local loadGqlTypes function for boltfoundry-com
    types: await loadGqlTypes(),
    features: {
      abstractTypeStrategies: {
        __typename: true,
        resolveType: true,
      },
    },
    // No plugins needed for basic schema
    plugins: [],
  };
}
