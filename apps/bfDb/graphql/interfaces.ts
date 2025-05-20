/**
 * GraphQL Interface Definitions
 *
 * This file defines common GraphQL interfaces that can be implemented
 * by GraphQL object types. These interfaces provide a contract that
 * implementing types must follow.
 */

import { interfaceType } from "nexus";

/**
 * Node interface - represents objects that can be fetched by ID
 * This is compatible with the Relay Node interface specification.
 */
export const nodeInterface = interfaceType({
  name: "Node",
  definition(t) {
    t.nonNull.id("id", { description: "Unique identifier for the object" });
  },
  resolveType(obj) {
    // Try to get the type from __typename (GraphQL standard pattern)
    if (obj.__typename) {
      return obj.__typename;
    }

    // Try to get type from metadata.className (BfNode pattern)
    if (obj.metadata?.className) {
      return obj.metadata.className;
    }

    // Try to get from constructor name
    if (
      obj.constructor && obj.constructor.name &&
      obj.constructor.name !== "Object"
    ) {
      return obj.constructor.name;
    }

    return null;
  },
});

/**
 * Entity interface - represents objects that have creation metadata
 */
export const entityInterface = interfaceType({
  name: "Entity",
  definition(t) {
    t.nonNull.string("createdAt", {
      description: "When this entity was created",
    });
  },
  resolveType(obj) {
    // Same resolution strategy as Node interface
    if (obj.__typename) {
      return obj.__typename;
    }

    if (obj.metadata?.className) {
      return obj.metadata.className;
    }

    if (
      obj.constructor && obj.constructor.name &&
      obj.constructor.name !== "Object"
    ) {
      return obj.constructor.name;
    }

    return null;
  },
});

/**
 * Loads all defined interfaces
 * Returns an array of interface type objects
 */
export function loadInterfaces() {
  return [
    nodeInterface,
    entityInterface,
    // Add more interfaces here as needed
  ];
}
