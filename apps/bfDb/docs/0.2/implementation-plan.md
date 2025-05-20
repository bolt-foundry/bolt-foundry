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

1. **Generated Registry**: Implement an automatic interface registry using generated files
   in the `__generated__` directory
2. **Class Hierarchy**: Create the GraphQLNode class alongside other interface types
3. **Auto-Registration**: Implement a generation step for creating interface registry files
   during build
4. **Schema Integration**: Update gqlSpecToNexus.ts to detect interface
   implementations through the prototype chain
5. **Inheritance Refactoring**: Update BfNode to extend GraphQLNode
6. **Testing**: Add comprehensive tests for the implementation

## Implementation Steps

1. **Create File Structure for Interfaces**
   - Create `apps/bfDb/graphql/GraphQLNode.ts` interface base class
   - Create `apps/bfDb/graphql/__generated__/` directory for generated files
   - Create generator script to populate `graphqlInterfaces.ts`

2. **Create GraphQLNode Class**
   - Implement GraphQLNode extending GraphQLObjectBase
   - Add required methods and properties for node functionality
   - Add gqlSpec definition with core Node fields (id)
   - Register in the generated interface registry

3. **Implement Interface Registry Generator**
   - Create genInterfaces.ts script to scan for interface classes
   - Generate graphqlInterfaces.ts registry file only
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
   - Create tests for the generated registry system
   - Test interface registration and implementation detection
   - Test interface type resolution with different node types
   - Verify schema generation with interface implementations
   - Test interface field resolution

## Technical Design

### Generated Interface Registry

We'll follow the existing project convention using generated registry files in `__generated__` folders:

```
apps/bfDb/
  graphql/
    GraphQLNode.ts               # Node interface base class
    __generated__/
      graphqlInterfaces.ts       # Generated registry of all interfaces
    nodeTypes/
      BfPerson.ts                # Implements Node via GraphQLNode
      BfOrganization.ts          # Implements Node via GraphQLNode
      __generated__/
        nodeTypesList.ts         # Generated list of all node types
```

This structure:
- Maintains consistency with existing project conventions
- Places interfaces next to related implementations
- Keeps generated code separate in `__generated__` directories
- Preserves type relationships through inheritance
- Provides clear visibility into available interfaces and implementations

### Generated Interface Registry File

```typescript
// apps/bfDb/graphql/__generated__/graphqlInterfaces.ts
import { GraphQLNode } from '../GraphQLNode.ts';
// Other interface imports

// Automatic registry of all GraphQL interfaces
export const graphqlInterfaces = [
  GraphQLNode,
  // Other interfaces are automatically included by the generator
];

// Generated during the build process - DO NOT MODIFY MANUALLY
```

### Generated Node Types Registry

```typescript
// apps/bfDb/graphql/nodeTypes/__generated__/nodeTypesList.ts
import { BfPerson } from '../BfPerson.ts';
import { BfOrganization } from '../BfOrganization.ts';
// Other node type imports

// Automatic registry of all node types
export const nodeTypes = [
  BfPerson,
  BfOrganization,
  // Other node types are automatically included by the generator
];

// Generated during the build process - DO NOT MODIFY MANUALLY
```

### GraphQLNode Class Implementation

The GraphQLNode class will extend GraphQLObjectBase and provide the base
functionality for all node types:

```typescript
// apps/bfDb/graphql/GraphQLNode.ts
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

### Automatic Loading from Generated Registry Files

We'll modify loadGqlTypes.ts to import from the generated registry files:

```typescript
// In loadGqlTypes.ts
import { graphqlInterfaces } from './__generated__/graphqlInterfaces.ts';
import { nodeTypes } from './nodeTypes/__generated__/nodeTypesList.ts';

export function loadGqlTypes() {
  const types = [];

  // Register interfaces first
  for (const interfaceType of graphqlInterfaces) {
    const interfaceDef = createInterfaceFromClass(interfaceType);
    types.push(interfaceDef);
  }

  // Register object types, checking inheritance for interface implementation
  for (const objectType of nodeTypes) {
    // Register the type with schema
    const objectDef = createObjectTypeFromClass(objectType);
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
function createObjectTypeFromClass(classConstructor) {
  // Find implemented interfaces through prototype chain
  const implementedInterfaces = [];

  // Check the prototype chain
  let current = classConstructor;
  while (current && current.prototype) {
    // Get parent class
    const parent = Object.getPrototypeOf(current);

    // Check if parent is in our interfaces registry by walking up the prototype chain
    if (graphqlInterfaces.includes(parent)) {
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

- GraphQLNode class is properly implemented and included in the interface registry
- Generated registry system correctly identifies and registers interfaces
- BfNode and other classes correctly inherit from GraphQLNode
- Interface implementations are automatically detected based on class
  inheritance
- Interface type resolution works correctly for all node types
- Tests pass for all aspects of the implementation
- Schema includes proper interface definitions and implementations
- Existing functionality continues to work with the new inheritance structure
- Adding new interfaces is automatically handled by the generation process

## Next Steps (Future Work)

- Add Node-specific field resolvers for advanced queries
- Implement Relay-style node fetching by global ID
- Add connection support for Node interface types
- Create additional specialized node classes for common patterns
- Add more comprehensive node-related utilities
- Enhance the node querying capabilities in the GraphQL API
