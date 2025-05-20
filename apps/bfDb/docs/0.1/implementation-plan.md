# GraphQL Builder v0.1 Implementation Plan

## Summary

We're replacing the legacy three-helper GraphQL DSL with a single-argument
fluent builder pattern that mirrors the successful bfNodeSpec field builder.
This implementation plan outlines the approach, steps, and expected outcomes for
this migration.

## Goals

- Create a more maintainable, type-safe GraphQL schema building system
- Unify our builder patterns (both bfDb and GraphQL using similar fluent
  interfaces)
- Improve developer experience with better type inference and IDE support
- Support edge relationships between node types, with an initial focus on the
  BfPerson to BfOrganization relationship for login functionality
- Establish a solid foundation for future enhancements like Relay connections

## Non-Goals

- Changing the GraphQL schema structure (client-facing API remains the same)
- Removing dependency on Nexus/GraphQL Yoga (still used under the hood)
- Implementing Relay-style connections (deprioritized for v0.1)
- Backward compatability: We're ok with breaking everything.

## Approach

1. **Builder Pattern**: Create a fluent interface similar to bfNodeSpec
2. **Direct Integration**: Map builder specs to Nexus types at build time
3. **Testing**: Comprehensive tests for builder, Nexus generation, and resolvers

## Implementation Steps

1. **Core Builder Implementation** ✅
   - Create makeGqlBuilder.ts with fluent interface
   - Implement scalar field methods (.string(), .int(), etc.)
   - Add nullability helpers
   - Create argument builder

2. **Type Generation** ✅
   - Create gqlSpecToNexus.ts to map specs to Nexus types
   - Implement field resolver logic with proper fallback chain
   - Handle mapping of arguments

3. **Edge Relationships** ✅
   - Implemented edge relationships with thunk-style type references
   - Added support for BfPerson and BfOrganization relationship
   - Implemented implicit relationships for object fields without custom
     resolvers
   - Used field names as edge roles for intuitive API

4. **Migration**
   - ✅ Update GraphQLObjectBase.defineGqlNode with comprehensive documentation
   - ✅ Improve loadGqlTypes.ts for dynamic root object loading
   - ✓ Deferred to v0.3: Convert one example node as proof of concept
   - ✓ Deferred to v0.3: Migrate remaining nodes
   - ✓ Deferred to v0.3: Remove legacy builders

5. **Mutation Returns Builder** ✅
   - Created makeReturnsBuilder.ts for building mutation return types
   - Supported scalar field methods with type inference
   - Implemented nonNull pattern for required fields
   - Automatically generated and registered payload types
   - Typed resolver functions based on builder output

6. **Interface Detection for v0.2** ⏱️
   - Use barrel files for GraphQL interface registration
   - Organize interfaces and implementations in separate directories with barrel
     files
   - Eliminate the need for manual interface registration
   - Implement auto-loading in loadGqlTypes.ts

7. **Testing**
   - ✅ Initial tests are in place and passing
   - ✓ Deferred to v0.3: Additional unit tests for builder functionality
   - ✓ Deferred to v0.3: Additional tests for Nexus type generation
   - ✓ Deferred to v0.3: Additional integration tests for field resolution
   - ✓ Deferred to v0.3: Additional tests for edge relationships
   - ✓ Deferred to v0.3: Additional tests for returns builder and type inference
   - ✓ Deferred to v0.3: Additional end-to-end tests with GraphQL queries

## Technical Design

### Resolution Logic

Default field resolver chain:

1. Use custom resolver if provided in opts.resolve
2. Try root.props[name] if present
3. Try root[name] as getter or method

For mutations with no custom resolver:

- Call root[name](args, ctx, info) method

### Edge Relationship Implementation

The edge relationship implementation provides a clean, intuitive API for
defining relationships between nodes:

1. **Thunk-style Type References**: Using function references to avoid circular
   dependencies
   ```typescript
   // Using direct reference
   .object("memberOf", () => BfOrganization)

   // Using dynamic imports for circular dependencies
   .object("memberOf", () => import("../nodeTypes/BfOrganization.ts").then(m => m.BfOrganization))
   ```

2. **Implicit Edge Relationships**: Any object field without a custom resolver
   is automatically treated as an edge relationship
   ```typescript
   // This is an edge relationship because no custom resolver is provided
   .object("memberOf", () => BfOrganization)

   // This is not an edge relationship (uses custom resolver)
   .object("memberOf", () => BfOrganization, {
     resolve: (root, args, ctx) => ctx.getOrganizationForUser(root.id)
   })
   ```

3. **Field Name as Edge Role**: The field name automatically serves as the edge
   role
   ```typescript
   // "memberOf" is both the field name and the edge role
   .object("memberOf", () => BfOrganization)

   // "follows" is both the field name and the edge role
   .object("follows", () => BfPerson)
   ```

4. **Relationship Direction Control**: Default is source→target, can be changed
   with option
   ```typescript
   // Default direction (source→target)
   .object("memberOf", () => BfOrganization)

   // Reversed direction (target→source)
   .object("follows", () => BfPerson, { 
     isSourceToTarget: false 
   })
   ```

5. **Resolution Logic**: The resolver queries the BfEdge model to find edges
   with the matching role, then loads the target node

### Mutation Returns Builder

The mutation returns builder provides a consistent API for defining return types
inline with type safety:

```typescript
.mutation("joinWaitlist", {
  args: (a) => a
    .nonNull.string("email")
    .nonNull.string("name")
    .nonNull.string("company"),
  returns: (r) => r
    .string("message")
    .nonNull.boolean("success"),
  resolve: async (root, args, ctx, info) => {
    // TypeScript infers return type: { message?: string, success: boolean }
    return {
      success: true,
      message: "Successfully joined waitlist",
    };
  }
})
```

Key features:

1. **Inline Type Definition**: Define return types directly in the mutation
2. **Type Inference**: Resolver function is typed based on builder output
3. **Automatic Type Names**: Generates payload types like "JoinWaitlistPayload"
4. **Consistent API**: Same pattern as args builder and field builder
5. **NonNull Support**: Required fields using `.nonNull` pattern

Implementation details:

- ReturnsBuilder accumulates field definitions as it builds
- TypeScript tracks the shape using mapped types and generics
- Generated type names follow pattern: `${MutationName}Payload`
- Payload types are automatically registered with the schema

### Nexus Integration

The builder produces a spec object that is converted to Nexus types at build
time:

```typescript
interface GqlSpec {
  fields: Record<string, FieldSpec>;
  relations: Record<string, RelationSpec>;
  mutations: Record<string, MutationSpec>;
}

// Converted to Nexus ObjectType definitions using gqlSpecToNexus.ts
```

## Success Metrics

- All tests passing, including integration tests
- Improved type safety and IDE support
- Easier addition of new GraphQL types

## Next Version (v0.2)

- Implement Node interface for all GraphQLObjectBase types:
  - Create GraphQLNode class that extends GraphQLObjectBase
  - Define Node GraphQL interface in the schema
  - Modify gqlSpecToNexus.ts to automatically detect GraphQLNode types through
    inheritance patterns
  - Implement automatic interface detection in loadGqlTypes.ts instead of manual
    registration
  - Refactor BfNode to extend GraphQLNode
  - Add resolveType function for proper interface resolution
  - Add tests to verify implementation

### Barrel File with Implicit Registration

The interface system will use barrel files and inheritance for automatic
registration of interfaces and their implementations:

1. Define base interface class:
   ```typescript
   // Abstract class that serves as the base for GraphQL interface types
   export abstract class GraphQLNode extends GraphQLObjectBase {
     // Required fields and methods for Node interface
     abstract get id(): string;
   }
   ```

2. Create barrel file for interfaces:
   ```typescript
   // apps/bfDb/graphql/interfaces/index.ts

   // Export all interface definitions
   export { GraphQLNode } from "./GraphQLNode";

   // This file can be imported by loadGqlTypes.ts to automatically register all interfaces
   ```

3. Interface implementations use barrel files:
   ```typescript
   // apps/bfDb/graphql/nodeTypes/index.ts

   // Export all node type implementations
   export { BfPerson } from "./BfPerson";
   export { BfOrganization } from "./BfOrganization";
   // Adding a new type only requires adding it to this export list
   ```

4. Automatic loading in loadGqlTypes.ts:
   ```typescript
   // Import all interface definitions and implementations from barrel files
   import * as interfaces from "../interfaces/index.ts";
   import * as nodeTypes from "../nodeTypes/index.ts";

   export function loadGqlTypes() {
     // Get all exported interfaces
     const interfaceTypes = Object.values(interfaces);

     // Get all node types
     const objectTypes = Object.values(nodeTypes);

     // Register interfaces first
     for (const interfaceType of interfaceTypes) {
       // Register interface with schema
       registerInterface(interfaceType);
     }

     // Register object types, checking inheritance for interface implementation
     for (const objectType of objectTypes) {
       // Check inheritance chain - if this type extends an interface, register as implementation
       for (const interfaceType of interfaceTypes) {
         if (objectType.prototype instanceof interfaceType) {
           registerImplementation(objectType, interfaceType);
         }
       }

       // Register the type with schema
       registerType(objectType);
     }
   }
   ```

5. Interface definition in schema:
   ```typescript
   // Define Node interface in schema
   export function defineNodeInterface() {
     return interfaceType({
       name: "Node",
       definition(t) {
         t.id("id", { description: "Unique identifier for the object" });
         // Add resolveType function to determine concrete type at runtime
         t.resolveType((obj) => obj.__typename);
       },
     });
   }
   ```

This approach provides several advantages:

- Simple folder structure with barrel files for auto-registration
- No manual interface registration required - just export from barrel file
- Adding new types is as simple as exporting from the barrel file
- Type safety through inheritance
- Clear visibility of available interfaces and implementations

## Future Work (v0.3+)

- Complete migration of remaining nodes to the new builder pattern
- Remove legacy builders
- Additional testing coverage for all components
- Implement Relay-style connections with pagination
- Add more field types and custom scalars
- Enhance validation and error messages
- Optimize schema generation performance
- Implement validation against bfNodeSpec.relations
