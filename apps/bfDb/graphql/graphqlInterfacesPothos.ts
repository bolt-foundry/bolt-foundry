/**
 * Pothos GraphQL Interface Definitions
 *
 * This file generates GraphQL interfaces from classes decorated with @GraphQLInterface,
 * using Pothos instead of Nexus to avoid interface implementation bugs.
 */

import type { BfSchemaBuilder } from "./types/sharedScalars.ts";
import type { ClassType } from "./decorators.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import {
  getGraphQLInterfaceMetadata,
  isGraphQLInterface,
} from "./decorators.ts";
import * as interfaceClasses from "./__generated__/interfacesList.ts";
import { BfError } from "@bfmono/lib/BfError.ts";

const logger = getLogger(import.meta);

/**
 * Standard resolve type function for GraphQL interfaces
 * This tries multiple methods to determine the concrete type
 */
function standardResolveType(obj: unknown) {
  // Try to get the type from __typename (GraphQL standard pattern)
  const objWithTypename = obj as { __typename?: string };
  if (objWithTypename.__typename) {
    return objWithTypename.__typename;
  }

  // Try to get type from metadata.className (BfNode pattern)
  const objWithMetadata = obj as { metadata?: { className?: string } };
  if (objWithMetadata.metadata?.className) {
    return objWithMetadata.metadata.className;
  }

  // Try to get from constructor name
  const objWithConstructor = obj as { constructor?: { name?: string } };
  if (
    objWithConstructor.constructor?.name &&
    objWithConstructor.constructor.name !== "Object"
  ) {
    return objWithConstructor.constructor.name;
  }

  // Fallback - log and return null to let GraphQL handle it
  logger.warn("Could not resolve GraphQL type for object:", obj);
  return null;
}

/**
 * Create a GraphQL interface from a decorated class using Pothos
 */
export function createInterfaceFromClassPothos(
  interfaceClass: ClassType,
  builder: BfSchemaBuilder,
): unknown {
  if (!isGraphQLInterface(interfaceClass)) {
    throw new BfError(
      `Class ${interfaceClass.name} is not marked with @GraphQLInterface decorator`,
    );
  }

  const metadata = getGraphQLInterfaceMetadata(interfaceClass);
  if (!metadata) {
    throw new BfError(
      `No metadata found for interface class ${interfaceClass.name}`,
    );
  }

  // Validate that interfaces don't define mutations (business rule)
  // deno-lint-ignore no-explicit-any
  const spec = (interfaceClass as any).gqlSpec;
  if (spec?.mutations && Object.keys(spec.mutations).length > 0) {
    throw new BfError(
      `Interface ${interfaceClass.name} cannot define mutations. Mutations should be defined on concrete types only.`,
    );
  }

  const interfaceName = metadata.name || interfaceClass.name;

  logger.debug(`Creating Pothos interface: ${interfaceName}`);

  // Create the interface using Pothos
  const interfaceRef = builder.interfaceType(interfaceName, {
    description: metadata.description,
    // deno-lint-ignore no-explicit-any
    fields: (t: any) => {
      const fields: Record<string, unknown> = {};

      // Process fields from gqlSpec if available
      if (spec?.fields) {
        for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
          const field = fieldDef as {
            type: string;
            nonNull?: boolean;
            description?: string;
          };

          // Add interface fields
          switch (field.type) {
            case "String":
              fields[fieldName] = t.string({
                nullable: !field.nonNull,
                description: field.description,
              });
              break;
            case "ID":
              fields[fieldName] = t.id({
                nullable: !field.nonNull,
                description: field.description,
              });
              break;
            case "Int":
              fields[fieldName] = t.int({
                nullable: !field.nonNull,
                description: field.description,
              });
              break;
            case "Boolean":
              fields[fieldName] = t.boolean({
                nullable: !field.nonNull,
                description: field.description,
              });
              break;
            default:
              // Custom scalar or object type
              fields[fieldName] = t.field({
                type: field.type,
                nullable: !field.nonNull,
                description: field.description,
              });
          }
        }
      }

      return fields;
    },
    resolveType: (obj: unknown) => {
      // Use standard resolve type logic
      return standardResolveType(obj);
    },
  });

  logger.debug(`Created Pothos interface: ${interfaceName}`);

  return interfaceRef;
}

/**
 * Load all GraphQL interfaces using Pothos
 * Returns a map of interface name to interface reference
 */
export function loadInterfacesPothos(
  builder: BfSchemaBuilder,
): Map<string, unknown> {
  logger.debug("Loading GraphQL interfaces with Pothos");

  const interfaceMap = new Map<string, unknown>();
  const classes = Object.values(interfaceClasses);

  for (const interfaceClass of classes) {
    try {
      if (isGraphQLInterface(interfaceClass)) {
        const interfaceRef = createInterfaceFromClassPothos(
          interfaceClass,
          builder,
        );
        const metadata = getGraphQLInterfaceMetadata(interfaceClass);
        const interfaceName = metadata?.name || interfaceClass.name;

        interfaceMap.set(interfaceName, interfaceRef);
        logger.debug(`Loaded interface: ${interfaceName}`);
      }
    } catch (error) {
      logger.error(
        `Failed to create interface from ${interfaceClass.name}:`,
        error,
      );
      throw error;
    }
  }

  logger.debug(`Loaded ${interfaceMap.size} Pothos interfaces total`);
  return interfaceMap;
}
