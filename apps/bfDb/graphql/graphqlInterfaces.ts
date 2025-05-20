/**
 * GraphQL Interface Definitions
 *
 * This file generates GraphQL interfaces from classes decorated with @GraphQLInterface,
 * turning the class metadata into schema definitions for interfaces that can be
 * implemented by GraphQL object types.
 */

import { interfaceType } from "nexus";
import { getLogger } from "packages/logger/logger.ts";
import {
  getGraphQLInterfaceMetadata,
  isGraphQLInterface,
} from "./decorators.ts";
import * as interfaceClasses from "./__generated__/interfacesList.ts";

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

  logger.warn("Unable to resolve type for GraphQL interface", obj);
  return null;
}

/**
 * Create an interface definition from a class decorated with @GraphQLInterface
 */
function createInterfaceFromClass(classConstructor: unknown) {
  if (!isGraphQLInterface(classConstructor)) {
    logger.warn(
      `Class ${
        String(classConstructor)
      } is not decorated with @GraphQLInterface`,
    );
    return null;
  }

  const metadata = getGraphQLInterfaceMetadata(classConstructor);
  if (!metadata) {
    logger.warn(`No interface metadata found for ${String(classConstructor)}`);
    return null;
  }

  logger.debug(`Creating interface from class: ${metadata.name}`);

  // deno-lint-ignore no-explicit-any
  const spec = (classConstructor as any).gqlSpec;
  if (!spec || !spec.fields) {
    logger.warn(`No gqlSpec found for interface ${metadata.name}`);
    return null;
  }

  return interfaceType({
    name: metadata.name || String(classConstructor), // Fallback to stringified constructor if name is missing
    description: metadata.description,
    resolveType: standardResolveType,
    definition(t) {
      // Add fields from the specification
      for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
        // deno-lint-ignore no-explicit-any
        const field = fieldDef as any;
        if (field.nonNull) {
          t.nonNull.field(fieldName, {
            type: field.type,
            description: field.description,
          });
        } else {
          t.field(fieldName, {
            type: field.type,
            description: field.description,
          });
        }
      }
    },
  });
}

/**
 * Loads all GraphQL interfaces from decorated classes
 * Returns an array of interface type objects
 */
export function loadInterfaces() {
  const interfaces = [];
  const interfaceNames = new Set(); // Track which interfaces we've already added

  // Process all interfaces from the barrel file
  for (const [_name, interfaceClass] of Object.entries(interfaceClasses)) {
    if (
      typeof interfaceClass === "function" && isGraphQLInterface(interfaceClass)
    ) {
      // Get interface metadata to get the actual interface name
      const metadata = getGraphQLInterfaceMetadata(interfaceClass);
      const interfaceName = metadata?.name || String(interfaceClass);

      // Skip if we've already processed this interface
      if (interfaceNames.has(interfaceName)) {
        logger.debug(`Skipping duplicate interface: ${interfaceName}`);
        continue;
      }

      const interfaceDef = createInterfaceFromClass(interfaceClass);
      if (interfaceDef) {
        logger.debug(`Adding interface: ${interfaceName}`);
        interfaces.push(interfaceDef);
        interfaceNames.add(interfaceName);
      }
    }
  }

  // In the future, we can scan for and add more @GraphQLInterface classes here
  // For now, we'll just manually list the ones we know about

  return interfaces;
}
