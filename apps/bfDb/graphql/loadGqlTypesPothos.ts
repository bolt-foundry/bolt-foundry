/**
 * Pothos GraphQL Type Loading
 *
 * This file loads all GraphQL types using our builder pattern and converts them to Pothos.
 * It replaces the Nexus-based loadGqlTypes.ts to solve interface implementation issues.
 */

import { gqlSpecToPothos } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToPothos.ts";
import type { GqlSpecToPothosOptions } from "@bfmono/apps/bfDb/builders/graphql/gqlSpecToPothos.ts";
import * as rootsModule from "@bfmono/apps/bfDb/graphql/roots/__generated__/rootObjectsList.ts";
import * as nodeTypesModule from "@bfmono/apps/bfDb/models/__generated__/nodeTypesList.ts";
import * as classesModule from "@bfmono/apps/bfDb/classes/__generated__/classesList.ts";
import { loadInterfacesPothos } from "@bfmono/apps/bfDb/graphql/graphqlInterfacesPothos.ts";
import type { AnyGraphqlObjectBaseCtor } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";
import { isGraphQLInterface } from "@bfmono/apps/bfDb/graphql/decorators.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { GqlMutationDef } from "@bfmono/apps/bfDb/builders/graphql/types/graphqlTypes.ts";

const logger = getLogger(import.meta);

// Type for returnsSpec field definitions
interface ReturnSpecField {
  type: string;
  nonNull: boolean;
}

// Type for GraphQL argument types (simplified)
interface GraphQLArgumentType {
  constructor: { name: string };
  name?: string;
  ofType?: { name: string };
}

const roots = Object.values(rootsModule);
const nodeTypes = Object.values(nodeTypesModule);
const classes = Object.values(classesModule);

/**
 * Loads GraphQL types using Pothos builder pattern.
 * This is the Pothos equivalent of the existing loadGqlTypes() function.
 */
export async function loadGqlTypesPothos(options: GqlSpecToPothosOptions) {
  const { builder } = options;
  const types = [];
  const allMutations: Record<string, unknown> = {};

  logger.debug("Loading GraphQL types with Pothos");

  // Load all defined interfaces using Pothos
  const interfaceMap = loadInterfacesPothos(builder);

  logger.debug(
    `Added ${interfaceMap.size} interfaces to schema:`,
    Array.from(interfaceMap.keys()),
  );

  // FIRST PASS: Collect all mutations from all classes
  const allClasses = [...nodeTypes, ...roots, ...classes];
  for (const classType of allClasses) {
    // Skip if it's not a class with gqlSpec
    if (
      typeof classType !== "function" || !("gqlSpec" in classType) ||
      !classType.gqlSpec
    ) continue;

    const spec = classType.gqlSpec;

    // Collect mutations from this class
    if (spec.mutations && Object.keys(spec.mutations).length > 0) {
      Object.assign(allMutations, spec.mutations);
    }
  }

  // PROCESS CLASSES: Handle concrete classes that implement interfaces
  for (const classType of classes) {
    logger.debug(`Checking class: ${classType.name}`);

    // Skip if it's not a class with gqlSpec
    if (
      typeof classType !== "function" || !("gqlSpec" in classType) ||
      !classType.gqlSpec
    ) {
      logger.debug(`  Skipped: no gqlSpec`);
      continue;
    }

    // Skip GraphQL interfaces - they're handled separately
    if (isGraphQLInterface(classType)) {
      logger.debug(`  Skipped: is GraphQL interface`);
      continue;
    }

    const classSpec = classType.gqlSpec;
    const className = classType.name;

    logger.debug(`Processing class: ${className}`);

    const pothosTypeInfo = await gqlSpecToPothos(classSpec, className, {
      classType: classType as AnyGraphqlObjectBaseCtor,
      interfaceMap,
      builder,
    });

    types.push(pothosTypeInfo);
    logger.debug(`Added class type: ${className}`);
  }

  // Process node types
  for (const nodeType of nodeTypes) {
    // Skip if it's not a class with gqlSpec
    if (
      typeof nodeType !== "function" || !("gqlSpec" in nodeType) ||
      !nodeType.gqlSpec
    ) continue;

    const nodeSpec = nodeType.gqlSpec;
    const nodeName = nodeType.name;

    logger.debug(`Processing node type: ${nodeName}`);

    const pothosTypeInfo = await gqlSpecToPothos(nodeSpec, nodeName, {
      classType: nodeType as AnyGraphqlObjectBaseCtor,
      interfaceMap,
      builder,
    });

    types.push(pothosTypeInfo);
    logger.debug(`Added node type: ${nodeName}`);
  }

  // Process root objects
  for (const root of roots) {
    const rootSpec = root.gqlSpec;
    const rootName = root.name;

    logger.debug(`Processing root type: ${rootName}`);

    const pothosTypeInfo = await gqlSpecToPothos(rootSpec, rootName, {
      classType: root as AnyGraphqlObjectBaseCtor,
      interfaceMap,
      builder,
    });

    types.push(pothosTypeInfo);
    logger.debug(`Added root type: ${rootName}`);
  }

  // HANDLE PAYLOAD TYPES: Create payload types for mutations with returnsSpec
  const payloadTypes = new Set<string>();
  for (const [mutationName, mutationDef] of Object.entries(allMutations)) {
    const mutation = mutationDef as GqlMutationDef;
    if (mutation.returnsSpec) {
      // Generate payload type name - handle camelCase properly
      const payloadTypeName = mutationName.replace(/([a-z])([A-Z])/g, "$1$2")
        .split(/(?=[A-Z])/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join("") + "Payload";

      // Only create once to avoid duplicates
      if (!payloadTypes.has(payloadTypeName)) {
        payloadTypes.add(payloadTypeName);

        logger.debug(`Creating payload type: ${payloadTypeName}`);

        // Create the payload object type with Pothos
        builder.objectType(payloadTypeName, {
          // deno-lint-ignore no-explicit-any
          fields: (t: any) => {
            const fields: Record<string, unknown> = {};
            const spec = mutation.returnsSpec as {
              fields: Record<string, ReturnSpecField>;
            };

            // Add each field from the returns spec
            for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
              const field = fieldDef;

              switch (field.type) {
                case "String":
                  fields[fieldName] = t.string({
                    nullable: !field.nonNull,
                  });
                  break;
                case "Boolean":
                  fields[fieldName] = t.boolean({
                    nullable: !field.nonNull,
                  });
                  break;
                case "Int":
                  fields[fieldName] = t.int({
                    nullable: !field.nonNull,
                  });
                  break;
                default:
                  // Custom scalar or object type
                  fields[fieldName] = t.field({
                    type: field.type,
                    nullable: !field.nonNull,
                  });
              }
            }

            return fields;
          },
        });
      }
    }
  }

  // CREATE CONSOLIDATED MUTATION TYPE: Handle all mutations from all classes
  if (Object.keys(allMutations).length > 0) {
    logger.debug(
      `Creating consolidated Mutation type with ${
        Object.keys(allMutations).length
      } mutations`,
    );

    builder.mutationType({
      // deno-lint-ignore no-explicit-any
      fields: (t: any) => {
        const mutationFields: Record<string, unknown> = {};

        for (
          const [mutationName, mutationDef] of Object.entries(allMutations)
        ) {
          const mutation = mutationDef as GqlMutationDef;

          logger.debug(`Adding mutation: ${mutationName}`, {
            args: mutation.args,
            returnsType: mutation.returnsType,
            returnsSpec: mutation.returnsSpec,
            argsType: typeof mutation.args,
          });

          // Convert mutation arguments to Pothos format
          const args: Record<string, unknown> = {};
          if (mutation.args && typeof mutation.args === "object") {
            // The args are already resolved GraphQL argument types
            for (const [argName, argType] of Object.entries(mutation.args)) {
              // Convert GraphQL argument types to Pothos arg format
              const gqlArgType = argType as GraphQLArgumentType;

              // Check if it's a NonNull wrapper type
              const isRequired =
                gqlArgType.constructor?.name === "GraphQLNonNull";

              // Get the inner type (for NonNull) or use the type directly
              const innerType = isRequired ? gqlArgType.ofType : gqlArgType;
              const typeName = innerType?.name;

              // Convert based on the underlying GraphQL scalar type
              switch (typeName) {
                case "String":
                  args[argName] = t.arg.string({ required: isRequired });
                  break;
                case "ID":
                  args[argName] = t.arg.id({ required: isRequired });
                  break;
                case "Int":
                  args[argName] = t.arg.int({ required: isRequired });
                  break;
                case "Boolean":
                  args[argName] = t.arg.boolean({ required: isRequired });
                  break;
                case "Float":
                  args[argName] = t.arg.float({ required: isRequired });
                  break;
                default:
                  // For custom scalars and object types, use generic field
                  args[argName] = t.arg({
                    type: typeName || "String",
                    required: isRequired,
                  });
              }
            }
          }

          // Determine return type using the correct properties
          let returnType: string = "JSON"; // Default fallback

          // First check for direct string return type
          if (typeof mutation.returnsType === "string") {
            returnType = mutation.returnsType;
          } // Then check for returnsSpec (complex return object)
          else if (mutation.returnsSpec) {
            // Generate payload type name for complex returns - handle camelCase properly
            returnType = mutationName.replace(/([a-z])([A-Z])/g, "$1$2")
              .split(/(?=[A-Z])/)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("") + "Payload";
          } // Fallback to JSON for unknown cases
          else {
            returnType = "JSON";
          }

          mutationFields[mutationName] = t.field({
            type: returnType,
            nullable: true,
            description: mutation.description,
            args, // Add converted args
            resolve: mutation.resolve,
          });
        }

        return mutationFields;
      },
    });

    logger.debug("Created consolidated Mutation type");
  }

  logger.debug(`Processed ${types.length} types with Pothos`);

  return {
    types,
    mutations: allMutations,
    interfaceMap,
  };
}
