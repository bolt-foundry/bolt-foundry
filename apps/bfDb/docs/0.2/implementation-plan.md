# GraphQL Builder v0.2 Implementation Plan

## Summary

This implementation plan outlines the approach for implementing a proper GraphQL
node inheritance hierarchy in the bfDb system. We'll create a GraphQLNode class
that extends GraphQLObjectBase, which will serve as the base for all node types
in the system, including BfNode and other specialized nodes. We'll use barrel
files for automatically registering interface implementations.

## Goals

- Create a standard GraphQLNode class that extends GraphQLObjectBase
- Implement the Node GraphQL interface in the schema
- Set up a barrel file structure for interfaces and implementations
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

1. **Barrel Files**: Create a directory structure with barrel files for
   interfaces and implementations
2. **Class Hierarchy**: Create the GraphQLNode class and export it from the
   interfaces barrel file
3. **Auto-Registration**: Implement automatic interface registration from barrel
   files during schema generation
4. **Schema Integration**: Update gqlSpecToNexus.ts to detect interface
   implementations through the prototype chain
5. **Inheritance Refactoring**: Update BfNode to extend GraphQLNode
6. **Testing**: Add comprehensive tests for the implementation

## Implementation Steps

1. **Create Interface Directory Structure**
   - Create `apps/bfDb/graphql/interfaces/` directory for interface classes
   - Create `GraphQLNode.ts` in the interfaces directory
   - Create `index.ts` as a barrel file exporting all interface classes

2. **Create GraphQLNode Class**
   - Implement GraphQLNode extending GraphQLObjectBase
   - Add required methods and properties for node functionality
   - Add gqlSpec definition with core Node fields (id)
   - Export from interfaces barrel file

3. **Implement Barrel File Loading**
   - Modify loadGqlTypes.ts to import from barrel files
   - Create functions to convert interface classes to GraphQL interfaces
   - Implement resolveType function to determine concrete types at runtime
   - Ensure interfaces are registered before object types in the schema

4. **Update Schema Generation**
   - Modify gqlSpecToNexus.ts to detect implemented interfaces automatically
   - Use prototype chain to find all implemented interfaces
   - Update schema generation to apply interfaces to implementing types
   - Ensure proper registration of interfaces and implementations

5. **Refactor BfNode and Other Classes**
   - Update BfNode to extend GraphQLNode instead of GraphQLObjectBase
   - Ensure proper method overriding and inheritance
   - Maintain backward compatibility with existing code
   - Update any dependent classes as needed

6. **Testing**
   - Create tests for the barrel file loading system
   - Test interface registration and implementation detection
   - Test interface type resolution with different node types
   - Verify schema generation with interface implementations
   - Test interface field resolution

## Technical Design

### Barrel File Structure

We'll use barrel files to organize interfaces and their implementations:

```
apps/bfDb/
  graphql/
    interfaces/
      GraphQLNode.ts      # Node interface base class
      index.ts            # Barrel file exporting all interfaces
    nodeTypes/
      BfPerson.ts         # Implements Node via GraphQLNode
      BfOrganization.ts   # Implements Node via GraphQLNode
      index.ts            # Barrel file exporting all node types
```

This structure:

- Clearly separates interfaces from regular types
- Uses barrel files for automatic registration
- Makes adding new interfaces or implementations as simple as adding new files
  and exports
- Provides clear organization of the class hierarchy

### Interface Barrel File

```typescript
// apps/bfDb/graphql/interfaces/index.ts
export { GraphQLNode } from "./GraphQLNode.ts";
// Export other interface classes
// When you add a new interface, just export it here
```

### Implementation Barrel File

```typescript
// apps/bfDb/graphql/nodeTypes/index.ts
export { BfPerson } from "./BfPerson.ts";
export { BfOrganization } from "./BfOrganization.ts";
// Export other node types
// When you add a new implementation, just export it here
```

### GraphQLNode Class Implementation

The GraphQLNode class will extend GraphQLObjectBase and provide the base
functionality for all node types:

```typescript
// apps/bfDb/graphql/interfaces/GraphQLNode.ts
export abstract class GraphQLNode extends GraphQLObjectBase {
  // Define the GraphQL specification with Node interface fields
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
  );

  // Required field for Node interface
  abstract get id(): string;

  // Additional node-specific methods
}
```

### Interface Definition in Schema

The Node interface will be automatically generated in the GraphQL schema:

```graphql
interface Node {
  id: ID!
}
```

### Automatic Loading from Barrel Files

We'll modify loadGqlTypes.ts to import from barrel files:

```typescript
// In loadGqlTypes.ts
import * as interfaces from "../interfaces/index.ts";
import * as nodeTypes from "../nodeTypes/index.ts";

export function loadGqlTypes() {
  const types = [];

  // Get all exported interfaces as an array
  const interfaceTypes = Object.values(interfaces);

  // Get all exported node types as an array
  const objectTypes = Object.values(nodeTypes);

  // Register interfaces first
  for (const interfaceType of interfaceTypes) {
    const interfaceDef = createInterfaceFromClass(interfaceType);
    types.push(interfaceDef);
  }

  // Register object types, checking inheritance for interface implementation
  for (const objectType of objectTypes) {
    // Register the type with schema
    const objectDef = createObjectTypeFromClass(objectType, interfaceTypes);
    types.push(objectDef);
  }

  return types;
}

// Helper function to create a GraphQL interface from a class
function createInterfaceFromClass(classConstructor) {
  return {
    name: classConstructor.name,
    definition(t) {
      // Extract fields from the class's gqlSpec
      const spec = classConstructor.gqlSpec;
      // Add fields from the specification to the interface
      for (const [fieldName, fieldDef] of Object.entries(spec.fields)) {
        if (fieldDef.nonNull) {
          t.nonNull.field(fieldName, { type: fieldDef.type });
        } else {
          t.field(fieldName, { type: fieldDef.type });
        }
      }
      // Add resolveType function
      t.resolveType(resolveNodeType);
    },
  };
}
```

### Type Resolution Logic

The resolveType function will follow this logic:

1. Use `metadata.className` if available (BfNode pattern)
2. Use constructor.name as a fallback
3. Use `__typename` if available
4. Throw an error if no type information can be determined

```typescript
function resolveNodeType(obj): string {
  // BfNode pattern
  if (obj.metadata?.className) {
    return obj.metadata.className;
  }

  // Constructor name
  if (
    obj.constructor && obj.constructor.name && obj.constructor.name !== "Object"
  ) {
    return obj.constructor.name;
  }

  // __typename from GraphQL
  if (obj.__typename) {
    return obj.__typename;
  }

  throw new Error(
    `Unable to resolve GraphQL type for object: ${JSON.stringify(obj)}`,
  );
}
```

### Schema Generation with Interface Detection

We'll update our schema generation to auto-detect interfaces through
inheritance:

```typescript
function createObjectTypeFromClass(classConstructor, interfaceTypes) {
  // Find implemented interfaces through prototype chain
  const implementedInterfaces = [];

  // Check the prototype chain
  let current = classConstructor;
  while (current && current.prototype) {
    // Get parent class
    const parent = Object.getPrototypeOf(current);

    // Check if parent is in our interfaces list
    if (interfaceTypes.includes(parent)) {
      implementedInterfaces.push(parent.name);
    }

    current = parent;
  }

  return {
    name: classConstructor.name,
    // Add implements if there are any
    ...(implementedInterfaces.length > 0
      ? { implements: implementedInterfaces }
      : {}),
    definition(t) {
      // Object type definition logic
    },
  };
}
```

### BfNode Refactoring

BfNode will be updated to extend GraphQLNode:

```typescript
export abstract class BfNode extends GraphQLNode {
  // Existing BfNode implementation
  // Only the extends clause changes, maintaining backward compatibility
}
```

## Success Metrics

- GraphQLNode class is properly implemented and exported in the barrel file
- Barrel file loading system correctly identifies and registers interfaces
- BfNode and other classes correctly inherit from GraphQLNode
- Interface implementations are automatically detected based on class
  inheritance
- Interface type resolution works correctly for all node types
- Tests pass for all aspects of the implementation
- Schema includes proper interface definitions and implementations
- Existing functionality continues to work with the new inheritance structure
- Adding new interfaces or implementations only requires updating barrel files

## Next Steps (Future Work)

- Add Node-specific field resolvers for advanced queries
- Implement Relay-style node fetching by global ID
- Add connection support for Node interface types
- Create additional specialized node classes for common patterns
- Add more comprehensive node-related utilities
- Enhance the node querying capabilities in the GraphQL API
