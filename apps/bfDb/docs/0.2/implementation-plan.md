# GraphQL Builder v0.2 Implementation Plan

## Summary

This implementation plan outlines the approach for implementing a proper GraphQL
node inheritance hierarchy in the bfDb system. We'll create a GraphQLNode class
that extends GraphQLObjectBase, which will serve as the base for all node types
in the system, including BfNode and other specialized nodes.

## Goals

- Create a standard GraphQLNode class that extends GraphQLObjectBase
- Implement the "Node" GraphQL interface in the schema
- Refactor the inheritance structure so BfNode and other node types extend
  GraphQLNode
- Enable proper interface resolution at runtime
- Support common operations like retrieving nodes by ID
- Enhance the GraphQL schema with interface-based inheritance

## Non-Goals

- Adding Relay-style connections (deferred to future versions)
- Changing existing field resolution behavior
- Migrating the rest of the nodes to the new builder pattern (deferred to v0.3)

## Approach

1. **Class Hierarchy**: Create the GraphQLNode class that extends
   GraphQLObjectBase
2. **Interface Definition**: Define the "Node" GraphQL interface in the schema
3. **Schema Integration**: Update gqlSpecToNexus.ts to register interface
   implementations
4. **Inheritance Refactoring**: Update BfNode to extend GraphQLNode
5. **Testing**: Add comprehensive tests for the implementation

## Implementation Steps

1. **Create GraphQLNode Class**
   - Create a new GraphQLNode.ts file that extends GraphQLObjectBase
   - Implement required methods and properties for node functionality
   - Add gqlSpec definition with core Node fields
   - Ensure id and __typename are properly implemented

2. **Define Node Interface in Schema**
   - Create interface definition with required fields: id (ID!) and __typename
     (String!)
   - Create a resolveType function to determine concrete types at runtime
   - Export constants and helpers for interface registration

3. **Update Schema Generation**
   - Modify gqlSpecToNexus.ts to automatically detect GraphQLNode types
   - Modify loadGqlTypes.ts to register the Node interface
   - Update schema generation to automatically apply the Node interface to
     GraphQLNode types
   - Ensure proper constructor passing for inheritance detection

4. **Refactor BfNode and Other Classes**
   - Update BfNode to extend GraphQLNode instead of GraphQLObjectBase
   - Ensure proper method overriding and inheritance
   - Maintain backward compatibility with existing code
   - Update any dependent classes as needed

5. **Testing**
   - Create tests for interface implementation verification
   - Test interface type resolution with different node types
   - Verify schema generation with interface implementations
   - Test interface field resolution

## Technical Design

### GraphQLNode Class Implementation

The GraphQLNode class will extend GraphQLObjectBase and provide the base
functionality for all node types:

```typescript
export abstract class GraphQLNode extends GraphQLObjectBase {
  // Override gqlSpec to include the Node interface fields
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("__typename")
  );

  // Additional node-specific methods can be added here
}
```

### Node Interface Definition

The Node interface will define the minimum required fields for all GraphQL
objects:

```graphql
interface Node {
  id: ID!
  __typename: String!
}
```

### Interface Registration

The Node interface will be automatically registered when the GraphQL schema is
loaded:

```typescript
// In loadGqlTypes.ts
export function loadGqlTypes() {
  // Register the Node interface first
  schemaConfig.interfaces.push(createNodeInterface());

  // Load all other types...
}
```

This ensures the Node interface is available to all GraphQLNode types without
manual registration for each one. The schema generator will automatically apply
the interface to any type that extends GraphQLNode.

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

The gqlSpecToNexus function will detect GraphQLNode types automatically and
apply the Node interface:

```typescript
export function gqlSpecToNexus(
  spec: GqlNodeSpec,
  typeName: string,
  classConstructor: any,
) {
  // Check if this type is a GraphQLNode (directly or through inheritance)
  const isNodeType = classConstructor &&
    (classConstructor === GraphQLNode ||
      classConstructor.prototype instanceof GraphQLNode);

  const mainType = {
    name: typeName,
    // Automatically implement Node interface if it's a GraphQLNode type
    ...(isNodeType ? { implements: [NODE_INTERFACE_NAME] } : {}),
    definition(t) {
      // Existing field definitions...
    },
  };

  // Rest of function...
}
```

The loadGqlTypes function will pass the class constructor when registering
types:

### BfNode Refactoring

BfNode will be updated to extend GraphQLNode instead of GraphQLObjectBase:

```typescript
export abstract class BfNode extends GraphQLNode {
  // Existing BfNode implementation
  // Only the extends clause changes, maintaining backward compatibility
}
```

## Success Metrics

- GraphQLNode class is properly implemented and extends GraphQLObjectBase
- BfNode and other classes correctly inherit from GraphQLNode
- The Node interface is properly defined in the GraphQL schema
- Interface type resolution works correctly for all node types
- Tests pass for the implementation
- Schema includes proper interface definitions
- Existing functionality continues to work with the new inheritance structure

## Next Steps (Future Work)

- Add Node-specific field resolvers for advanced queries
- Implement Relay-style node fetching by global ID
- Add connection support for Node interface types
- Create additional specialized node classes for common patterns
- Add more comprehensive node-related utilities
- Enhance the node querying capabilities in the GraphQL API
