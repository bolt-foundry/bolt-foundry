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

1. **Interface Discovery**: Use the project's barrel file generation pattern to
   discover interface classes automatically
2. **Class Hierarchy**: Create the GraphQLNode class in a dedicated interfaces
   directory that gets included in the auto-generated barrel file
3. **Interface Registration**: Implement automatic registration of GraphQL
   interfaces using the generated barrel file during schema generation
4. **Schema Integration**: Update gqlSpecToNexus.ts to detect interface
   implementations through the prototype chain
5. **Inheritance Refactoring**: Update BfNode to extend GraphQLNode
6. **Testing**: Add comprehensive tests for the implementation

## Implementation Steps

1. **Create Interface Discovery System**
   - Create graphql/interfaces/ directory for interface classes
   - Update genBarrel.ts to generate an interfacesList.ts barrel file
   - Create graphqlInterfaces.ts with utility functions to work with the
     generated list

2. **Create GraphQLNode Class**
   - Create a new GraphQLNode.ts file in the interfaces directory
   - Make it extend GraphQLObjectBase
   - Implement required methods and properties for node functionality
   - Add gqlSpec definition with core Node fields (id and __typename)
   - Ensure it gets included in the auto-generated barrel file

3. **Implement Interface Registration in Schema**
   - Modify loadGqlTypes.ts to load interfaces from the barrel file
   - Create functions to convert interface classes to GraphQL interfaces
   - Implement resolveType function to determine concrete types at runtime
   - Ensure interfaces are registered before object types in the schema

4. **Update Schema Generation**
   - Modify gqlSpecToNexus.ts to detect implemented interfaces automatically
   - Add prototype chain traversal to find all implemented interfaces
   - Update schema generation to apply interfaces to implementing types
   - Ensure proper registration of interfaces and implementations

5. **Refactor BfNode and Other Classes**
   - Update BfNode to extend GraphQLNode instead of GraphQLObjectBase
   - Ensure proper method overriding and inheritance
   - Maintain backward compatibility with existing code
   - Update any dependent classes as needed

6. **Testing**
   - Create tests for the interface registry system
   - Test interface registration and implementation detection
   - Test interface type resolution with different node types
   - Verify schema generation with interface implementations
   - Test interface field resolution

## Technical Design

### Auto-Generated Interface Barrel File

We'll use the project's existing barrel file generation pattern to automatically
create a registry of GraphQL interfaces:

```typescript
// 1. Add to genBarrel.ts configuration
const barrels: BarrelConfig[] = [
  // ... existing barrels

  // GraphQL Interfaces
  {
    dir: new URL("../graphql/interfaces/", import.meta.url),
    out: new URL(
      "../graphql/interfaces/__generated__/interfacesList.ts",
      import.meta.url,
    ),
    importPath: (f) => `apps/bfDb/graphql/interfaces/${f}`,
  },
];

// 2. Create utility functions in a separate file (graphqlInterfaces.ts)
import * as interfaces from "./interfaces/__generated__/interfacesList";

// Get all exported interfaces as an array
export const graphQLInterfaces = Object.values(interfaces);

// Utility function to check if a class is registered as an interface
export function isGraphQLInterface(classConstructor: any): boolean {
  return Object.values(interfaces).includes(classConstructor);
}
```

This approach:

- Automatically discovers interface classes in the interfaces directory
- Generates a barrel file with exports of all interfaces
- Provides a clean way to add new interfaces (just place them in the interfaces/
  directory)
- Uses the project's established pattern for component discovery
- Maintains a single source of truth that updates automatically

### GraphQLNode Class Implementation

The GraphQLNode class will extend GraphQLObjectBase and provide the base
functionality for all node types:

```typescript
export class GraphQLNode extends GraphQLObjectBase {
  // Define the GraphQL specification with Node interface fields
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("__typename")
  );

  // Additional node-specific methods can be added here
}

// GraphQLNode will be automatically included in the interfaces barrel file
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

We'll use the auto-generated barrel file to register interfaces in the schema:

```typescript
// In loadGqlTypes.ts
import * as interfacesModule from "apps/bfDb/graphql/interfaces/__generated__/interfacesList.ts";
import { isGraphQLInterface } from "./graphqlInterfaces";

export function loadGqlTypes() {
  const interfaces = Object.values(interfacesModule);
  const types = [];

  // Register all interfaces from the barrel file
  for (const interfaceClass of interfaces) {
    const interfaceName = interfaceClass.name;
    const interfaceDef = createInterfaceFromClass(interfaceClass);
    types.push(interfaceDef);
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

This approach uses a centralized registry for interfaces and automatically
creates the appropriate interface definitions in the schema.

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

  // Check all the classes in the prototype chain
  let current = classConstructor;
  while (current && current !== GraphQLObjectBase) {
    // Check each parent class
    const parentClass = Object.getPrototypeOf(current);

    // If the parent class is in the interface registry, add it
    if (parentClass && isGraphQLInterface(parentClass)) {
      interfaces.push(parentClass.name);
    }

    current = parentClass;
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

- Interface registry system is implemented and works correctly
- GraphQLNode class is properly implemented and registered as an interface
- Interface registration system correctly identifies and registers interfaces
  from the registry
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
