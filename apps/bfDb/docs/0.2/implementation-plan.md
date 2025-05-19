# GraphQL Builder v0.2 Implementation Plan

## Summary

This implementation plan outlines the approach for implementing a proper GraphQL
node inheritance hierarchy in the bfDb system. We'll create a GraphQLNode class
that extends GraphQLObjectBase, which will serve as the base for all node types
in the system, including BfNode and other specialized nodes.

## Goals

- Create a standard GraphQLNode class that extends GraphQLObjectBase
- Implement a system for automatically creating GraphQL interfaces from
  explicitly marked classes
- Add the "Node" GraphQL interface in the schema
- Refactor the inheritance structure so BfNode and other node types extend
  GraphQLNode
- Enable proper interface resolution at runtime
- Support common operations like retrieving nodes by ID
- Enhance the GraphQL schema with explicit interface-based inheritance

## Non-Goals

- Adding Relay-style connections (deferred to future versions)
- Changing existing field resolution behavior
- Migrating the rest of the nodes to the new builder pattern (deferred to v0.3)

## Approach

1. **Explicit Interface Marking**: Create a mechanism for marking classes that
   should be treated as GraphQL interfaces
2. **Class Hierarchy**: Create the GraphQLNode class that extends
   GraphQLObjectBase and mark it as a GraphQL interface
3. **Interface Registration**: Implement automatic registration of GraphQL
   interfaces from marked classes
4. **Schema Integration**: Update gqlSpecToNexus.ts to register interface
   implementations
5. **Inheritance Refactoring**: Update BfNode to extend GraphQLNode
6. **Testing**: Add comprehensive tests for the implementation

## Implementation Steps

1. **Create Interface Marking Mechanism**
   - Define a static property for marking classes as GraphQL interfaces
   - Update schema generation to check for this marker
   - Add utility functions for working with interface classes

2. **Create GraphQLNode Class**
   - Create a new GraphQLNode.ts file that extends GraphQLObjectBase
   - Mark it as a GraphQL interface using the new marker
   - Implement required methods and properties for node functionality
   - Add gqlSpec definition with core Node fields
   - Ensure id and __typename are properly implemented

3. **Define Interface Registration System**
   - Create a registry for GraphQL interfaces
   - Add functionality to automatically detect marked interface classes
   - Implement resolveType function to determine concrete types at runtime
   - Export constants and helpers for interface registration

4. **Update Schema Generation**
   - Modify gqlSpecToNexus.ts to check for interface markers
   - Modify loadGqlTypes.ts to register marked interfaces
   - Update schema generation to automatically apply interfaces based on class
     inheritance
   - Ensure proper registration of interfaces and implementing types

5. **Refactor BfNode and Other Classes**
   - Update BfNode to extend GraphQLNode instead of GraphQLObjectBase
   - Ensure proper method overriding and inheritance
   - Maintain backward compatibility with existing code
   - Update any dependent classes as needed

6. **Testing**
   - Create tests for interface marking mechanism
   - Test interface registration and implementation
   - Test interface type resolution with different node types
   - Verify schema generation with interface implementations
   - Test interface field resolution

## Technical Design

### Interface Marking Mechanism

We'll use an explicit static property to mark classes that should be treated as
GraphQL interfaces:

```typescript
export class GraphQLObjectBase {
  // Existing implementation...

  // Static property to mark a class as a GraphQL interface
  static readonly isGraphQLInterface?: boolean;

  // Method to check if a class is marked as an interface
  static isInterface(classConstructor: any): boolean {
    return Boolean(classConstructor?.isGraphQLInterface);
  }
}
```

### GraphQLNode Class Implementation

The GraphQLNode class will extend GraphQLObjectBase, be marked as an interface,
and provide the base functionality for all node types:

```typescript
export class GraphQLNode extends GraphQLObjectBase {
  // Mark this class as a GraphQL interface
  static readonly isGraphQLInterface = true;

  // Override gqlSpec to include the Node interface fields
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("__typename")
  );

  // Additional node-specific methods can be added here
}
```

### Interface Definition in Schema

The Node interface will be automatically generated in the GraphQL schema based
on the GraphQLNode class:

```graphql
interface Node {
  id: ID!
  __typename: String!
}
```

### Interface Registration

We'll build a system to automatically register interfaces from marked classes:

```typescript
// In loadGqlTypes.ts
export function loadGqlTypes() {
  // Find all classes marked as interfaces and register them
  const interfaceClasses = findInterfaceClasses();

  for (const interfaceClass of interfaceClasses) {
    const interfaceName = interfaceClass.name;
    schemaConfig.interfaces.push(createInterfaceFromClass(interfaceClass));
  }

  // Load all other types...
}

// Helper function to create a GraphQL interface from a class
function createInterfaceFromClass(classConstructor: any) {
  return {
    name: classConstructor.name,
    definition(t: any) {
      // Extract fields from the class's gqlSpec
      const spec = classConstructor.gqlSpec;
      // Add fields to the interface definition
      // ...
      // Add resolveType function
      t.resolveType(resolveNodeType);
    },
  };
}
```

This approach ensures interfaces are automatically created from marked classes,
and types that extend those classes will implement the corresponding interfaces.

### Type Resolution Logic

The resolveType function will follow this logic:

1. Use the `__typename` field if available (GraphQLObjectBase standard)
2. Fall back to `metadata.className` if available (BfNode pattern)
3. Use constructor.name as a last resort
4. Return "Unknown" if no type information can be determined

```typescript
function resolveNodeType(obj: GraphQLRootObject): string {
  if (obj.__typename) {
    return obj.__typename;
  }

  if (obj.metadata?.className) {
    return obj.metadata.className;
  }

  return "Unknown";
}
```

### Schema Generation Changes

The gqlSpecToNexus function will be updated to automatically detect interfaces
that a class implements:

```typescript
export function gqlSpecToNexus(
  spec: GqlNodeSpec,
  typeName: string,
  classConstructor: any,
) {
  // Find all interfaces this class implements by walking up the prototype chain
  const implementedInterfaces = findImplementedInterfaces(classConstructor);

  const mainType = {
    name: typeName,
    // Automatically add implements for all interfaces the class extends
    ...(implementedInterfaces.length > 0
      ? { implements: implementedInterfaces }
      : {}),
    definition(t) {
      // Existing field definitions...
    },
  };

  // Rest of function...
}

// Helper function to find all interfaces a class implements
function findImplementedInterfaces(classConstructor: any): string[] {
  const interfaces: string[] = [];
  let current = Object.getPrototypeOf(classConstructor);

  // Walk up the prototype chain
  while (current && current !== GraphQLObjectBase) {
    // If this parent class is marked as an interface, add it
    if (GraphQLObjectBase.isInterface(current.constructor)) {
      interfaces.push(current.constructor.name);
    }
    current = Object.getPrototypeOf(current);
  }

  return interfaces;
}
```

This approach automatically detects interface implementations based on
inheritance hierarchy.

### BfNode Refactoring

BfNode will be updated to extend GraphQLNode instead of GraphQLObjectBase:

```typescript
export abstract class BfNode extends GraphQLNode {
  // Existing BfNode implementation
  // Only the extends clause changes, maintaining backward compatibility
}
```

## Success Metrics

- Interface marking mechanism is implemented and works correctly
- GraphQLNode class is properly implemented, marked as an interface, and extends
  GraphQLObjectBase
- Interface registration system correctly identifies and registers interfaces
- BfNode and other classes correctly inherit from GraphQLNode
- Interface implementations are automatically detected based on class
  inheritance
- Interface type resolution works correctly for all node types
- Tests pass for all aspects of the implementation
- Schema includes proper interface definitions and implementations
- Existing functionality continues to work with the new inheritance structure

## Next Steps (Future Work)

- Add Node-specific field resolvers for advanced queries
- Implement Relay-style node fetching by global ID
- Add connection support for Node interface types
- Create additional specialized node classes for common patterns
- Add more comprehensive node-related utilities
- Enhance the node querying capabilities in the GraphQL API
