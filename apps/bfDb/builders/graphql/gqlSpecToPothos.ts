import type { GraphQLResolveInfo } from "graphql";
import type { BfGraphqlContext } from "@bfmono/apps/bfDb/graphql/graphqlContext.ts";
import type { GqlNodeSpec } from "./makeGqlBuilder.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type {
  AnyGraphqlObjectBaseCtor,
} from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
import type { GraphQLResolverArgs } from "./types/resolverTypes.ts";
import type {
  GqlConnectionDef,
  GqlFieldDef,
  GqlMutationDef,
  GqlRelationDef,
  GraphQLRootObject,
} from "./types/graphqlTypes.ts";
import {
  getGraphQLInterfaceMetadata,
  isGraphQLInterface,
} from "@bfmono/apps/bfDb/graphql/decorators.ts";
import type { BfSchemaBuilder } from "@bfmono/apps/bfDb/graphql/types/sharedScalars.ts";

// Logger for this module
const logger = getLogger(import.meta);

type MaybePromise<T> = T | Promise<T>;

/**
 * Interface implementation options for gqlSpecToPothos
 */
export interface GqlSpecToPothosOptions {
  /** List of interfaces this type implements (manually specified) */
  interfaces?: Array<string>;

  /**
   * The class constructor for the type
   * Used to check for @GraphQLInterface decorator on parent classes
   */
  classType?: AnyGraphqlObjectBaseCtor;

  /**
   * Map of interface names to interface objects for Pothos reference resolution
   */
  interfaceMap?: Map<string, unknown>;

  /**
   * Pothos schema builder instance
   */
  builder: BfSchemaBuilder;
}

/**
 * Default resolver for scalar fields that follows the standardized fallback chain:
 * 1. Try root.props[fieldName]
 * 2. Try root[fieldName] as property or method
 * 3. Return null if all else fails
 */
function createDefaultFieldResolver(fieldName: string) {
  return function defaultResolver(
    root: GraphQLRootObject,
    args: GraphQLResolverArgs,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) {
    // Handle cases where root is undefined or null
    if (!root) {
      return null;
    }

    // Try props first (BfNode standard pattern)
    if (root.props && fieldName in root.props) {
      return root.props[fieldName];
    }

    // Then try direct property/method
    if (fieldName in root) {
      const value = root[fieldName];
      if (typeof value === "function") {
        return value.call(root, args, ctx, info);
      }
      return value;
    }

    // Nothing found, return null
    return null;
  };
}

/**
 * Default resolver for relations that follows the relation fallback chain:
 * 1. Try root.relations[relationName]
 * 2. Try root[relationName] as method or property
 * 3. Return null if all else fails
 */
function createDefaultRelationResolver(relationName: string) {
  return function defaultRelationResolver(
    root: GraphQLRootObject,
    args: GraphQLResolverArgs,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) {
    // Try from relations first
    if (root.relations && relationName in root.relations) {
      return root.relations[relationName];
    }

    // Try as a method
    if (typeof root[relationName] === "function") {
      return root[relationName](args, ctx, info);
    }

    // Try as a property
    if (relationName in root) {
      return root[relationName];
    }

    return null;
  };
}

/**
 * Determines which interface a type should implement by checking:
 * 1. Explicitly specified interfaces in options
 * 2. Parent class with @GraphQLInterface decorator (if classType is provided)
 */
function determineInterface(
  options?: GqlSpecToPothosOptions,
): { name: string; object: unknown } | undefined {
  logger.debug(
    `determineInterface for ${options?.classType?.name || "unknown"}`,
  );

  // First check explicit interfaces
  if (options?.interfaces?.length) {
    const interfaceName = options.interfaces[0];
    logger.debug(`Using explicitly specified interface: ${interfaceName}`);

    const interfaceObject = options.interfaceMap?.get(interfaceName);
    if (interfaceObject) {
      return { name: interfaceName, object: interfaceObject };
    }
    logger.warn(`Interface object not found for: ${interfaceName}`);
    return undefined;
  }

  // If no explicit interfaces and classType is provided, check for parent class with decorator
  if (options?.classType) {
    logger.debug(
      `Checking for parent class of ${options.classType?.name || "unknown"}`,
    );

    // Get the parent class
    const parentClass = Object.getPrototypeOf(options.classType);

    logger.debug(`Parent class is: ${parentClass?.name || "unknown"}`);

    // Check if the parent class has the @GraphQLInterface decorator
    if (parentClass) {
      const decorated = isGraphQLInterface(parentClass);
      logger.debug(`Is parent class decorated? ${decorated}`);

      if (decorated) {
        // Get the interface metadata to get the custom name if specified
        const metadata = getGraphQLInterfaceMetadata(parentClass);
        const interfaceName = metadata?.name || parentClass.name;
        logger.debug(`Using interface name: ${interfaceName}`);

        const interfaceObject = options.interfaceMap?.get(interfaceName);
        if (interfaceObject) {
          return { name: interfaceName, object: interfaceObject };
        }
        logger.warn(`Interface object not found for: ${interfaceName}`);
        return undefined;
      }
    }
  }

  // No interfaces found
  logger.debug("No interfaces found");
  return undefined;
}

/**
 * Convert GraphQL args from our internal format to Pothos format
 * This is a simplified version - args conversion may need more work
 */
function convertArgsToPothos(args: Record<string, unknown>) {
  // If no args provided, return undefined instead of empty object
  // Pothos expects undefined for no args, not an empty object
  if (!args || Object.keys(args).length === 0) {
    return undefined;
  }

  // For now, return undefined for any args until proper implementation
  // This avoids the getConfig error by not providing invalid args
  return undefined;
}

/**
 * Converts a GqlNodeSpec to Pothos type registration for schema generation
 *
 * @param spec The GraphQL node specification
 * @param typeName The name of the GraphQL type
 * @param options Required parameters including Pothos builder instance
 * @returns Object with type definitions for registration
 */
export async function gqlSpecToPothos(
  spec: GqlNodeSpec,
  typeName: string,
  options: GqlSpecToPothosOptions,
) {
  const { builder } = options;

  // Pre-process relations to resolve thunks (same logic as Nexus)
  for (const [relationName, relationDef] of Object.entries(spec.relations)) {
    const relation = relationDef as GqlRelationDef;

    if (relation._targetThunk && relation._pendingTypeResolution !== false) {
      try {
        // Evaluate the thunk to get the target constructor
        const targetResult = await Promise.resolve(relation._targetThunk());

        // Extract the class name from the constructor
        const targetClassName = targetResult?.name;

        if (!targetClassName) {
          logger.warn(
            `Thunk for ${typeName}.${relationName} returned a value without a name property`,
          );
          relation.type = `UnresolvedType_${typeName}_${relationName}`;
        } else {
          // Use the actual GraphQL type name
          relation.type = targetClassName;
        }
      } catch (error) {
        // If thunk evaluation fails, provide a descriptive error type
        logger.warn(
          `Failed to resolve target type for ${typeName}.${relationName}:`,
          error,
        );
        relation.type = `FailedToResolveType_${typeName}_${relationName}`;
      }

      // Mark as resolved so we don't try again
      relation._pendingTypeResolution = false;
    }
  }

  // Pre-process connections to resolve thunks (same logic as Nexus)
  if (spec.connections) {
    for (
      const [connectionName, connectionDef] of Object.entries(spec.connections)
    ) {
      const connection = connectionDef as GqlConnectionDef;

      if (
        connection._targetThunk && connection._pendingTypeResolution !== false
      ) {
        try {
          // Evaluate the thunk to get the target constructor
          const targetResult = await Promise.resolve(connection._targetThunk());

          // Extract the class name from the constructor
          const targetClassName = targetResult?.name;

          if (!targetClassName) {
            logger.warn(
              `Thunk for ${typeName}.${connectionName} returned a value without a name property`,
            );
            connection.type = `UnresolvedType_${typeName}_${connectionName}`;
          } else {
            // Use the actual GraphQL type name
            connection.type = targetClassName;
          }
        } catch (error) {
          // If thunk evaluation fails, provide a descriptive error type
          logger.warn(
            `Failed to resolve target type for ${typeName}.${connectionName}:`,
            error,
          );
          connection.type = `FailedToResolveType_${typeName}_${connectionName}`;
        }

        // Mark as resolved so we don't try again
        connection._pendingTypeResolution = false;
      }
    }
  }

  // Get interface this type should implement
  const interfaceInfo = determineInterface(options);

  // Declare mainType to be used in both branches
  let mainType: unknown;

  // Handle Query type specially to avoid duplicate type errors
  if (typeName === "Query") {
    logger.debug("Creating Query root type using builder.queryType()");

    mainType = builder.queryType({
      // deno-lint-ignore no-explicit-any
      fields: (t: any) => {
        const fields: Record<string, unknown> = {};

        // Process scalar fields
        for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
          const field = fieldDef as GqlFieldDef;

          // Use Pothos field API correctly
          switch (field.type) {
            case "String":
              fields[fieldName] = t.string({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            case "ID":
              fields[fieldName] = t.id({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            case "Int":
              fields[fieldName] = t.int({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            case "Boolean":
              fields[fieldName] = t.boolean({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            default:
              // Custom scalar or object type
              fields[fieldName] = t.field({
                type: field.type,
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
          }
        }

        // Process relations (object fields)
        for (
          const [relationName, relationDef] of Object.entries(spec.relations)
        ) {
          const relation = relationDef as GqlRelationDef;

          fields[relationName] = t.field({
            type: relation.type,
            nullable: true, // Relations are typically nullable
            description: relation.description,
            args: convertArgsToPothos(relation.args || {}),
            resolve: relation.resolve ||
              createDefaultRelationResolver(relationName),
          });
        }

        // Process connections (if any)
        if (spec.connections) {
          for (
            const [connectionName, connectionDef] of Object.entries(
              spec.connections,
            )
          ) {
            const connection = connectionDef as GqlConnectionDef;

            // For now, treat connections like regular fields
            // TODO: Implement proper connection support
            fields[connectionName] = t.field({
              type: connection.type,
              nullable: true,
              description: connection.description,
              resolve: connection.resolve,
            });
          }
        }

        return fields;
      },
    });
  } else {
    // Create the main object type using Pothos for non-Query types
    mainType = builder.objectType(typeName, {
      // Add interfaces if there's an interface to implement
      ...(interfaceInfo ? { interfaces: [interfaceInfo.name] } : {}),
      // deno-lint-ignore no-explicit-any
      fields: (t: any) => {
        const fields: Record<string, unknown> = {};

        // Process scalar fields
        for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
          const field = fieldDef as GqlFieldDef;

          // Use Pothos field API correctly
          switch (field.type) {
            case "String":
              fields[fieldName] = t.string({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            case "ID":
              fields[fieldName] = t.id({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            case "Int":
              fields[fieldName] = t.int({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            case "Boolean":
              fields[fieldName] = t.boolean({
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
              break;
            default:
              // Custom scalar or object type
              fields[fieldName] = t.field({
                type: field.type,
                nullable: !field.nonNull,
                description: field.description,
                resolve: field.resolve || createDefaultFieldResolver(fieldName),
              });
          }
        }

        // Process relations (object fields)
        for (
          const [relationName, relationDef] of Object.entries(spec.relations)
        ) {
          const relation = relationDef as GqlRelationDef;

          fields[relationName] = t.field({
            type: relation.type,
            nullable: true, // Relations are typically nullable
            description: relation.description,
            args: convertArgsToPothos(relation.args || {}),
            resolve: relation.resolve ||
              createDefaultRelationResolver(relationName),
          });
        }

        // Process connections (if any)
        if (spec.connections) {
          for (
            const [connectionName, connectionDef] of Object.entries(
              spec.connections,
            )
          ) {
            const connection = connectionDef as GqlConnectionDef;

            // For now, treat connections like regular fields
            // TODO: Implement proper connection support
            fields[connectionName] = t.field({
              type: connection.type,
              nullable: true,
              description: connection.description,
              resolve: connection.resolve,
            });
          }
        }

        return fields;
      },
    });
  }

  // Handle mutations - create mutation extensions
  const mutationExtensions = [];
  if (Object.keys(spec.mutations).length > 0) {
    for (
      const [mutationName, mutationDef] of Object.entries(spec.mutations)
    ) {
      const mutation = mutationDef as GqlMutationDef;

      // For now, store mutation info for later processing
      // TODO: Implement proper mutation handling
      mutationExtensions.push({
        name: mutationName,
        mutation,
      });
    }
  }

  return {
    mainType,
    mutationExtensions,
    typeName,
  };
}
