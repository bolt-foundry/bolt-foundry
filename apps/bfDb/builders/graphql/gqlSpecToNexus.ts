import type { GraphQLInputFieldMap, GraphQLResolveInfo } from "graphql";
import type { BfGraphqlContext } from "apps/bfDb/graphql/graphqlContext.ts";
import type { GqlNodeSpec } from "./makeGqlBuilder.ts";
import { getLogger } from "packages/logger/logger.ts";
import type { BfEdgeMetadata } from "apps/bfDb/classes/BfNode.ts";
import type {
  AnyBfNodeCtor,
  AnyConstructor,
  AnyGraphqlObjectBaseCtor,
} from "apps/bfDb/builders/bfDb/types.ts";
import type { ReturnSpec } from "./makeReturnsBuilder.ts";
import { booleanArg, floatArg, idArg, intArg, nonNull, stringArg } from "nexus";

type MaybePromise<T> = T | Promise<T>;

/**
 * Type definition for an edge relationship specification
 *
 * This defines how an edge relationship is represented in the GraphQL schema
 * and provides the information needed to resolve the relationship at runtime.
 */
type EdgeRelationshipSpec = {
  /** GraphQL type name (initially same as field name) */
  type: string;

  /** GraphQL field arguments (from nexus/graphql) */
  args: GraphQLInputFieldMap;

  /** Direction of the relationship: true = source→target, false = target→source */
  isSourceToTarget: boolean;

  /** Function that returns the target type constructor, used for runtime resolution */
  _targetThunk: () => MaybePromise<
    AnyBfNodeCtor | AnyGraphqlObjectBaseCtor | AnyConstructor
  >;
};

/**
 * Creates a nonNull wrapper for a GraphQL type
 * This matches the Nexus nonNull wrapper format expected by the tests
 */
// Removed - using string with ! directly

/**
 * Converts argument definitions from builder format to Nexus format
 */
function convertArgsToNexus(
  args: Record<string, unknown>,
): Record<string, unknown> {
  const nexusArgs: Record<string, unknown> = {};

  for (const [name, type] of Object.entries(args)) {
    // If type is a string, convert to proper Nexus arg
    if (typeof type === "string") {
      const isNonNull = type.endsWith("!");
      const baseType = isNonNull ? type.slice(0, -1) : type;

      let argFn;
      switch (baseType) {
        case "String":
          argFn = stringArg();
          break;
        case "Int":
          argFn = intArg();
          break;
        case "Float":
          argFn = floatArg();
          break;
        case "Boolean":
          argFn = booleanArg();
          break;
        case "ID":
          argFn = idArg();
          break;
        default:
          // Fall back to stringArg for unknown types
          argFn = stringArg();
          break;
      }

      nexusArgs[name] = isNonNull ? nonNull(argFn) : argFn;
    } else {
      // Otherwise, assume it's already in the right format
      nexusArgs[name] = type;
    }
  }

  return nexusArgs;
}

/**
 * Default resolver for scalar fields that follows the standardized fallback chain:
 * 1. Try root.props[fieldName]
 * 2. Try root[fieldName] as property or method
 * 3. Return null if all else fails
 */
function createDefaultFieldResolver(fieldName: string) {
  return function defaultResolver(
    // deno-lint-ignore no-explicit-any
    root: any,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) {
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
    // deno-lint-ignore no-explicit-any
    root: any,
    args: Record<string, unknown>,
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
 * Creates a resolver for edge relationships between nodes
 *
 * This resolver handles the runtime resolution of relationships between nodes using BfEdge.
 * It follows these steps:
 * 1. Queries BfEdge with the source node ID and relationship name as the edge role
 * 2. Extracts the target node information from the first matching edge
 * 3. Loads and returns the target node
 *
 * @param relationName The name of the field/relationship (e.g., "memberOf") which also serves as the edge role
 * @param isSourceToTarget Direction of the relationship (true = source→target)
 * @param targetThunk Function that returns the target object type constructor
 * @returns An async resolver function that handles the edge relationship
 *
 * @example
 * // Field: person.memberOf
 * // Role: "memberOf" (same as field name)
 * // Direction: source→target (BfPerson → BfOrganization)
 * createEdgeRelationshipResolver(
 *   "memberOf",
 *   true,
 *   () => import("../nodeTypes/BfOrganization.ts").then(m => m.BfOrganization)
 * )
 */
function createEdgeRelationshipResolver(
  relationName: string, // The field name also serves as the role
  isSourceToTarget: boolean,
  // Must be provided for thunk-style relationships
  _targetThunk: () => MaybePromise<
    AnyBfNodeCtor | AnyGraphqlObjectBaseCtor | AnyConstructor
  >,
) {
  const logger = getLogger(import.meta);

  // Log when the resolver is created (only see this during initialization)
  logger.debug(
    `Creating edge relationship resolver for '${relationName}' (${
      isSourceToTarget ? "source→target" : "target→source"
    }) using thunk-style type`,
  );

  return async function edgeRelationshipResolver(
    // deno-lint-ignore no-explicit-any
    root: any,
    _args: Record<string, unknown>,
    ctx: BfGraphqlContext,
    _info: GraphQLResolveInfo,
  ) {
    logger.debug(
      `Resolving edge relationship '${relationName}' for node ${
        root?.metadata?.className || "unknown"
      }:${root?.metadata?.bfGid || "unknown"}`,
    );

    // Ensure we have a valid node with metadata
    if (!root || !root.metadata || !root.metadata.bfGid) {
      logger.warn(
        `Invalid root node provided to edge resolver for ${relationName}`,
      );
      return null;
    }

    // Early return if the context doesn't have currentViewer
    if (!root.currentViewer) {
      logger.warn(
        `Root node has no currentViewer for edge resolver ${relationName}`,
      );
      return null;
    }

    try {
      // We're focusing only on the source->target direction for now
      // This allows resolving a BfPerson.memberOf field, not the reverse
      if (isSourceToTarget) {
        logger.debug(
          `Resolving source→target relationship '${relationName}'`,
        );

        // 1. Query for edges with the given role where this node is the source
        // Use dynamic import to avoid circular dependencies
        const BfEdgeModule = await import("apps/bfDb/nodeTypes/BfEdge.ts");

        // Log that BfEdge was imported
        logger.debug("Dynamically imported BfEdge");

        // Setup query params to find edges from this node
        const queryMetadata = {
          bfSid: root.metadata.bfGid,
          bfSClassName: root.metadata.className,
        };

        logger.debug(
          `Querying for edges from ${root.metadata.className}:${root.metadata.bfGid} with role '${relationName}'`,
        );

        // Due to circular dependencies between BfNode and BfEdge, we need to use a type assertion
        // deno-lint-ignore no-explicit-any
        type BfEdgeQuery = any; // This is a simplification for type safety

        // Call the query method with proper parameters
        const edges = await (BfEdgeModule.BfEdge as BfEdgeQuery).query(
          root.currentViewer,
          queryMetadata as Partial<BfEdgeMetadata>,
          { role: relationName } as Record<string, string>,
          [], // No specific IDs to filter by
        );

        logger.debug(
          `Found ${
            edges?.length || 0
          } edges for relationship '${relationName}'`,
        );

        if (!edges || edges.length === 0) {
          logger.debug(
            `No edges found for '${relationName}' relationship`,
          );
          return null;
        }

        // For memberOf relationship, we only expect one target
        // Take the first edge that matches
        const edge = edges[0];

        // Extract the target node information from the edge metadata
        const edgeMetadata = edge.metadata as BfEdgeMetadata;
        const targetId = edgeMetadata.bfTid;
        const targetClassName = edgeMetadata.bfTClassName;

        logger.debug(
          `Target node for '${relationName}': ${targetClassName}:${targetId}`,
        );

        if (!targetId || !targetClassName) {
          logger.warn(
            `Edge missing target information for relation ${relationName}`,
          );
          return null;
        }

        // Load the target node using the context helper
        logger.debug(`Loading target node ${targetClassName}:${targetId}`);
        const result = await ctx.findNode(targetClassName, targetId);

        if (result) {
          logger.debug(
            `Successfully resolved relationship '${relationName}' to ${targetClassName}:${targetId}`,
          );
        } else {
          logger.warn(
            `Failed to load target node ${targetClassName}:${targetId} for relationship '${relationName}'`,
          );
        }

        return result;
      } else {
        // We're not implementing the target->source direction in this release
        logger.warn(
          `Target→source relationships not implemented yet (${relationName})`,
        );
        return null;
      }
    } catch (error) {
      logger.error(
        `Error resolving edge relationship '${relationName}': ${error}`,
      );
      return null;
    }
  };
}

/**
 * Default resolver for mutations
 */
function createDefaultMutationResolver(mutationName: string) {
  return function defaultMutationResolver(
    // deno-lint-ignore no-explicit-any
    root: any,
    args: Record<string, unknown>,
    ctx: BfGraphqlContext,
    info: GraphQLResolveInfo,
  ) {
    // Mutations should be methods on the root object
    if (typeof root[mutationName] === "function") {
      return root[mutationName](args, ctx, info);
    }
    return null;
  };
}

/**
 * Converts a GqlNodeSpec to Nexus types for schema generation
 *
 * @param spec The GraphQL node specification
 * @param typeName The name of the GraphQL type
 * @returns Nexus compatible type definitions for main type and mutation type
 */
export function gqlSpecToNexus(spec: GqlNodeSpec, typeName: string) {
  // Create the main object type definition
  const mainType = {
    name: typeName,
    // deno-lint-ignore no-explicit-any
    definition(t: any) {
      // Process fields
      for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
        // deno-lint-ignore no-explicit-any
        const field = fieldDef as any;

        // For nexus, we use the nonNull chain method instead of type strings with !
        const fieldConfig = {
          type: field.type,
          description: field.description,
          // Handle arguments if provided - convert to Nexus format
          args: convertArgsToNexus(field.args || {}),
          // Add resolver with fallback chain
          resolve: field.resolve || createDefaultFieldResolver(fieldName),
        };

        // Add field to the object type
        if (field.nonNull) {
          t.nonNull.field(fieldName, fieldConfig);
        } else {
          t.field(fieldName, fieldConfig);
        }
      }

      // Process relations (object fields)
      for (
        const [relationName, relationDef] of Object.entries(spec.relations)
      ) {
        // deno-lint-ignore no-explicit-any
        const relation = relationDef as any;

        // Check if we have a thunk function for the target type
        // This is used for the newer thunk-style: .object("memberOf", () => BfOrganization)
        if (relation._targetThunk) {
          // For thunk-style, we might need to determine the type name at runtime
          // In GraphQL, we normally already know the type name at build time,
          // but in some cases we might need to dynamically resolve it
          // (e.g., with circular references)

          // The current implementation doesn't require resolving the thunk at schema build time
          // We'll use the function at runtime in the resolver if needed
          // We're keeping this future-proof in case we need to do more with the thunk later
          relation._hasThunkFn = true;

          // Derive a more specific type name using source_relation_target pattern to prevent collisions
          // Format: SourceType_RelationName_TargetType (e.g., BfPerson_memberOf_BfOrganization)
          // Extract target class name from the thunk function if possible
          const targetClassName =
            relation._targetThunk.toString().match(/class\s+(\w+)/)?.[1] ||
            "Unknown";
          relation.type = `${typeName}_${relationName}_${targetClassName}`;
        }

        // Determine if this is an edge relationship
        let resolver = relation.resolve;

        if (!resolver && relation.isEdgeRelationship) {
          // Edge relationships are implicit for object fields without custom resolvers
          // The resolver will query for BfEdge objects and resolve the relationship
          resolver = createEdgeRelationshipResolver(
            relationName, // The field name also serves as the edge role
            relation.isSourceToTarget, // Direction of relationship
            relation._targetThunk, // The thunk function that returns the target type
          );
        } else if (!resolver) {
          // Use default resolver for regular relations
          resolver = createDefaultRelationResolver(relationName);
        }

        t.field(relationName, {
          type: relation.type,
          description: relation.description,
          // Handle arguments if provided - convert to Nexus format
          args: convertArgsToNexus(relation.args || {}),
          // Add resolver based on relationship type with debug wrapper
          resolve: async function (
            // deno-lint-ignore no-explicit-any
            root: any,
            args: Record<string, unknown>,
            ctx: BfGraphqlContext,
            info: GraphQLResolveInfo,
          ) {
            const logger = getLogger(import.meta);
            logger.debug(
              `Starting resolution of '${relationName}' relationship`,
            );
            try {
              const result = await resolver(root, args, ctx, info);
              logger.debug(
                `Finished resolution of '${relationName}' relationship`,
              );
              return result;
            } catch (error) {
              logger.error(
                `Error in resolver wrapper for '${relationName}': ${error}`,
              );
              return null;
            }
          },
        });
      }
    },
  };

  // Create mutation type if there are mutations defined
  let mutationType = null;
  const payloadTypes: Record<string, unknown> = {};

  // Build payload types first, outside of the mutation definition
  for (const [mutationName, mutationDef] of Object.entries(spec.mutations)) {
    // deno-lint-ignore no-explicit-any
    const mutation = mutationDef as any;

    if (mutation.returnsSpec) {
      // Generate payload type name - handle camelCase properly
      const payloadTypeName = mutationName.replace(/([a-z])([A-Z])/g, "$1$2")
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("") + "Payload";

      // Create the payload object type
      payloadTypes[payloadTypeName] = {
        name: payloadTypeName,
        // deno-lint-ignore no-explicit-any
        definition(t: any) {
          const spec = mutation.returnsSpec as ReturnSpec;

          // Add each field from the returns spec
          for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
            const fieldConfig = {
              type: fieldDef.type,
            };

            if (fieldDef.nonNull) {
              t.nonNull.field(fieldName, fieldConfig);
            } else {
              t.field(fieldName, fieldConfig);
            }
          }
        },
      };
    }
  }

  if (Object.keys(spec.mutations).length > 0) {
    mutationType = {
      type: "Mutation",
      // deno-lint-ignore no-explicit-any
      definition(t: any) {
        // Add each mutation field to the Mutation type
        for (
          const [mutationName, mutationDef] of Object.entries(spec.mutations)
        ) {
          // deno-lint-ignore no-explicit-any
          const mutation = mutationDef as any;

          let returnType = "JSON";

          // If we have a direct string return type, use it
          if (mutation.returnsType) {
            returnType = mutation.returnsType;
          } // Otherwise if we have a returnsSpec, use the generated payload type
          else if (mutation.returnsSpec) {
            // Generate payload type name - handle camelCase properly
            returnType = mutationName.replace(/([a-z])([A-Z])/g, "$1$2")
              .split(/(?=[A-Z])/)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("") + "Payload";
          }

          t.field(mutationName, {
            type: returnType,
            description: mutation.description,
            // Handle mutation arguments - convert to Nexus format
            args: convertArgsToNexus(mutation.args || {}),
            // Add resolver with mutation-specific fallback
            resolve: mutation.resolve ||
              createDefaultMutationResolver(mutationName),
          });
        }
      },
    };
  }

  return {
    mainType,
    mutationType,
    payloadTypes,
  };
}
