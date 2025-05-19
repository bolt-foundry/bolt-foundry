import { extendType, objectType, queryType } from "nexus";
import { gqlSpecToNexus } from "apps/bfDb/builders/graphql/gqlSpecToNexus.ts";
import * as roots from "apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import * as classes from "apps/bfDb/classes/__generated__/classesList.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);
logger.setLevel(logger.levels.DEBUG);

/**
 * Loads GraphQL types using our new builder pattern.
 * This will eventually load all node types in the system.
 */
export function loadGqlTypes() {
  const types: unknown[] = [];
  // Update the type to match what Nexus expects
  // deno-lint-ignore no-explicit-any
  const mutationExtensions: any[] = [];

  logger.debug("Loading GraphQL types...");

  // Process all root types from the generated barrel file
  for (const [name, rootClass] of Object.entries(roots)) {
    logger.debug(`Processing root type: ${name}`);
    if (rootClass.gqlSpec) {
      logger.debug(`Found gqlSpec for ${name}`);
      const nexusTypes = gqlSpecToNexus(rootClass.gqlSpec, name);

      // Add the main type based on the root type
      if (name === "Query") {
        logger.debug(`Adding Query type for ${name}`);
        types.push(queryType(nexusTypes.mainType));
      } else {
        logger.debug(`Adding object type for ${name}`);
        types.push(objectType(nexusTypes.mainType));
      }

      // Add any payload types
      if (nexusTypes.payloadTypes) {
        for (
          const [typeName, typeDef] of Object.entries(nexusTypes.payloadTypes)
        ) {
          logger.debug(`Adding payload type: ${typeName}`);
          types.push(objectType(typeDef as Parameters<typeof objectType>[0]));
        }
      }

      // Collect mutation extensions to add later
      if (nexusTypes.mutationType) {
        logger.debug(`Collecting mutation extension for ${name}`);
        mutationExtensions.push(nexusTypes.mutationType);
      }
    } else {
      logger.debug(`No gqlSpec for ${name}`);
    }
  }

  // Process all class types (like CurrentViewer) that have gqlSpecs
  for (const [name, classType] of Object.entries(classes)) {
    logger.debug(`Processing class type: ${name}`);
    // Use type guard to safely check if classType has gqlSpec property
    if ("gqlSpec" in classType && classType.gqlSpec) {
      logger.debug(`Found gqlSpec for class ${name}`);
      const nexusTypes = gqlSpecToNexus(classType.gqlSpec, name);

      // Add the main type
      logger.debug(`Adding object type for class ${name}`);
      types.push(objectType(nexusTypes.mainType));

      // Add any payload types
      if (nexusTypes.payloadTypes) {
        for (
          const [typeName, typeDef] of Object.entries(nexusTypes.payloadTypes)
        ) {
          logger.debug(`Adding payload type for class: ${typeName}`);
          types.push(objectType(typeDef as Parameters<typeof objectType>[0]));
        }
      }

      // Collect mutation extensions to add later
      if (nexusTypes.mutationType) {
        logger.debug(`Collecting mutation extension for class ${name}`);
        mutationExtensions.push(nexusTypes.mutationType);
      }
    } else {
      logger.debug(`No gqlSpec for class ${name}`);
    }
  }

  // Create a test GraphQL type directly with Nexus to verify schema generation
  const TestType = objectType({
    name: "TestType",
    definition(t) {
      t.string("name");
      t.nonNull.id("id");
      t.boolean("isActive");
      t.int("count");
    },
  });

  // Add the test type to the types array
  logger.debug("Adding TestType");
  types.push(TestType);

  // Add all mutation extensions at the end to avoid duplicate type issues
  // Nexus will merge these into a single Mutation type
  if (mutationExtensions.length > 0) {
    logger.debug(`Adding ${mutationExtensions.length} mutation extensions`);
    mutationExtensions.forEach((mutationExt) => {
      types.push(extendType(mutationExt));
    });
  }

  logger.debug(`Total types loaded: ${types.length}`);
  types.forEach((type, index) => {
    // deno-lint-ignore no-explicit-any
    logger.debug(`Type ${index}: ${(type as any).name || "unknown"}`);
  });

  return types;
}
