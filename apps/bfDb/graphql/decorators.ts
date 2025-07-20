/**
 * GraphQL Type Decorators
 *
 * This file contains decorators for GraphQL type definitions.
 * These decorators provide metadata and functionality for GraphQL schema generation.
 */

/**
 * Property name used to store GraphQL interface metadata on a class
 */
export const GRAPHQL_INTERFACE_PROPERTY = "__graphqlInterface";

/**
 * Type for class constructor
 */
// deno-lint-ignore no-explicit-any
type Constructor = { new (...args: Array<any>): any; name: string };

/**
 * Type for abstract class constructor
 */
// deno-lint-ignore no-explicit-any
type AbstractConstructor = { prototype: any; name: string };

/**
 * Combined type for class constructors
 */
export type ClassType = Constructor | AbstractConstructor;

/**
 * Options for GraphQL interface declaration
 */
export interface GraphQLInterfaceOptions {
  /** Custom name for the interface (defaults to class name) */
  name?: string;
  /** Description for the interface */
  description?: string;
}

/**
 * Interface metadata stored on the class
 */
export interface GraphQLInterfaceMetadata extends GraphQLInterfaceOptions {
  /** Indicates this is a GraphQL interface */
  isInterface: boolean;
  /** The class that was decorated */
  target: unknown;
}

/**
 * Class decorator that marks a class as a GraphQL interface
 * This decorator doesn't cascade to child classes - each class must be explicitly marked
 *
 * @example
 * ```typescript
 * @GraphQLInterface()
 * class BaseNode {
 *   // Fields and methods
 * }
 *
 * // Or with options
 * @GraphQLInterface({
 *   name: 'CustomInterface',
 *   description: 'A custom GraphQL interface'
 * })
 * class SpecialNode {
 *   // Fields and methods
 * }
 * ```
 */
export function GraphQLInterface(options: GraphQLInterfaceOptions = {}) {
  // deno-lint-ignore no-explicit-any
  return function (target: any): any {
    // Store metadata on the class constructor itself
    // deno-lint-ignore no-explicit-any
    (target as any)[GRAPHQL_INTERFACE_PROPERTY] = {
      isInterface: true,
      name: options.name || target.name,
      description: options.description,
      target,
    };

    // Return the class unchanged - we're just adding metadata
    return target;
  };
}

/**
 * Checks if a class is marked as a GraphQL interface
 * Only returns true if the class itself is decorated, not if it inherits from a decorated class
 *
 * @param target The class to check
 * @returns True if the class itself is marked as a GraphQL interface
 */
export function isGraphQLInterface(target: unknown): boolean {
  // Check if the property exists directly on this class (not inherited)
  return !!Object.prototype.hasOwnProperty.call(
    target,
    GRAPHQL_INTERFACE_PROPERTY,
  );
}

/**
 * Gets GraphQL interface metadata for a class
 *
 * @param target The class to get metadata for
 * @returns The GraphQL interface metadata, or undefined if not an interface
 */
export function getGraphQLInterfaceMetadata(
  target: unknown,
): GraphQLInterfaceMetadata | undefined {
  // deno-lint-ignore no-explicit-any
  return (target as any)[GRAPHQL_INTERFACE_PROPERTY];
}
