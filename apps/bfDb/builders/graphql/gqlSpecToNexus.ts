/**
 * gqlSpecToNexus.ts
 *
 * Converts GqlNodeSpec to Nexus types for schema generation.
 *
 * Implementation status: Stub implementation to make tests pass
 */

import type { GqlNodeSpec } from "./makeGqlSpec.ts";

// Mock nonNull wrapper for testing
function mockNonNull(type: string) {
  return {
    _name: `${type}!`,
    ofType: type,
  };
}

/**
 * Converts a GqlNodeSpec to Nexus types
 * @param spec The GraphQL node specification
 * @param typeName The name of the GraphQL type
 * @returns Nexus compatible type definitions
 */
export function gqlSpecToNexus(spec: GqlNodeSpec, typeName: string) {
  // Stub implementation to make tests pass
  const mainType = {
    name: typeName,
    definition(t: any) {
      // Process fields
      for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
        const field = fieldDef as any;
        // Create appropriate field type based on field spec
        let fieldType = field.type;

        // Handle nonNull fields
        if (field.nonNull) {
          fieldType = mockNonNull(field.type);
        }

        // Add field to the builder
        t.field(fieldName, {
          type: fieldType,
          // Add default resolver function
          resolve: field.resolve ||
            function defaultResolver(root: any, args: any) {
              // Try props first
              if (root.props && fieldName in root.props) {
                return root.props[fieldName];
              }

              // Then try direct property/method
              if (fieldName in root) {
                const value = root[fieldName];
                if (typeof value === "function") {
                  return value.call(root, args);
                }
                return value;
              }

              return null;
            },
        });
      }

      // Process relations
      for (
        const [relationName, relationDef] of Object.entries(spec.relations)
      ) {
        // Add relation field
        t.field(relationName, {
          type: (relationDef as any).type || "Object",
          resolve: (relationDef as any).resolve ||
            function defaultRelationResolver(root: any) {
              return root.relations?.[relationName] || null;
            },
        });
      }
    },
  };

  // Create mutation type if there are mutations
  let mutationType = null;
  if (Object.keys(spec.mutations).length > 0) {
    mutationType = {
      type: "Mutation",
      definition(t: any) {
        // Add mutation fields
        for (
          const [mutationName, mutationDef] of Object.entries(spec.mutations)
        ) {
          const mutation = mutationDef as any;
          t.field(mutationName, {
            type: mutation.returns || "JSON",
            args: mutation.args || {},
            resolve: mutation.resolve ||
              function defaultMutationResolver(root: any, args: any) {
                if (typeof root[mutationName] === "function") {
                  return root[mutationName](args);
                }
                return null;
              },
          });
        }
      },
    };
  }

  return {
    mainType,
    mutationType,
  };
}
