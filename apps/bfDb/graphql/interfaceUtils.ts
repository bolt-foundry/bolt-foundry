/**
 * Utilities for detecting and working with GraphQL interfaces
 */

import { GraphQLNode } from "./GraphQLNode.ts";
import * as interfaces from "./__generated__/graphqlInterfaces.ts";

/**
 * Detects interfaces implemented by a class through the prototype chain
 * @param classConstructor The class constructor to check for implemented interfaces
 * @returns Array of interface names implemented by the class
 */
export function detectImplementedInterfaces(
  // deno-lint-ignore no-explicit-any
  classConstructor: any,
): string[] {
  const implementedInterfaces: string[] = [];

  // Check if the class extends GraphQLNode
  let current = classConstructor;
  while (current && current.prototype) {
    if (current === GraphQLNode) {
      implementedInterfaces.push("Node");
      break;
    }

    // Move up the prototype chain
    const parentClass = Object.getPrototypeOf(current);
    if (!parentClass || parentClass === Object) {
      break;
    }
    current = parentClass;
  }

  // Check for other interfaces in the registry
  for (const [name, interfaceClass] of Object.entries(interfaces)) {
    if (
      interfaceClass &&
      typeof interfaceClass === "function" &&
      classConstructor.prototype instanceof interfaceClass &&
      name !== "GraphQLNode"
    ) {
      implementedInterfaces.push(name);
    }
  }

  return implementedInterfaces;
}
