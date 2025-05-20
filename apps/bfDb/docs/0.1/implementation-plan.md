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
- Backward compatibility: We're ok with breaking everything.

## Approach

1. **Builder Pattern**: Create a fluent interface similar to bfNodeSpec
2. **Direct Integration**: Map builder specs to Nexus types at build time
3. **Testing**: Comprehensive tests for builder, Nexus generation, and resolvers
4. **Phased Migration**: Implement core functionality in v0.1, Node interface in v0.2, full migration in v0.3

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

4. **Mutation Returns Builder** ✅
   - Created makeReturnsBuilder.ts for building mutation return types
   - Supported scalar field methods with type inference
   - Implemented nonNull pattern for required fields
   - Automatically generated and registered payload types
   - Typed resolver functions based on builder output

5. **Infrastructure Setup** ✅
   - Update GraphQLObjectBase.defineGqlNode with comprehensive documentation
   - Improve loadGqlTypes.ts for dynamic root object loading
   - Add schemaConfig.ts for centralized schema configuration
   - Implement genGqlTypes.bff.ts for type generation

6. **Testing** ✅
   - Initial tests are in place and passing:
     - Builder functionality tests
     - Nexus type generation tests
     - Basic integration tests
     - Argument builder tests

7. **Connection Support** ⏱️
   - Implemented stub for connection method in builder interface
   - Full implementation deferred to v0.3

8. **Migration Strategy** ⏱️
   - Keep legacy builders functional while implementing v0.1 and v0.2
   - Allow both systems to coexist during transition
   - Provide clear documentation on migration path for node types
   - Complete migration of remaining nodes in v0.3

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

### Example Usage

Here's an example of a GraphQL node type definition using the new builder:

```typescript
class ExampleNode extends GraphQLObjectBase {
  static defineGqlNode() {
    return this.gqlNodeBuilder((b) => b
      .nonNull.id("id")
      .nonNull.string("name")
      .object("organization", () => BfOrganization)
      .mutation("updateName", {
        args: (a) => a.nonNull.string("newName"),
        returns: (r) => r
          .nonNull.boolean("success")
          .string("message"),
        resolve: async (root, { newName }, ctx) => {
          // Implementation here
          return { success: true, message: "Name updated" };
        }
      })
    );
  }
}
```

## Validation Plan

1. **Schema-Level Validation**:
   - Ensure all required fields have nonNull specified
   - Verify field names follow naming conventions
   - Check for duplicate field definitions

2. **Edge Relationship Validation**:
   - Validate edge relationships against bfNodeSpec.relations
   - Ensure consistency between GraphQL schema and database schema
   - Warn about potential circular dependencies
   - Check for proper usage of isSourceToTarget option

3. **Type Safety**:
   - Leverage TypeScript's type system for compile-time validation
   - Add runtime validators for schema generation

## Success Metrics

- All tests passing, including integration tests
- Improved type safety and IDE support
- Easier addition of new GraphQL types
- Valid schema generation with Nexus/GraphQL Yoga

## Next Version (v0.2)

- Implement Node interface for all GraphQLObjectBase types:
  - Create GraphQLNode class that extends GraphQLObjectBase
  - Define Node GraphQL interface in the schema
  - Update loadGqlTypes.ts to automatically register the Node interface
  - Modify gqlSpecToNexus.ts to automatically detect GraphQLNode types
  - Refactor BfNode to extend GraphQLNode
  - Add resolveType function for interface resolution
  - Add tests to verify implementation

## Future Work (v0.3+)

- Complete migration of remaining nodes to the new builder pattern
- Remove legacy builders
- Additional testing coverage for all components
- Implement Relay-style connections with pagination
- Add more field types and custom scalars
- Enhance validation and error messages
- Optimize schema generation performance
- Implement validation against bfNodeSpec.relations
- Support for additional edge relationship patterns (target→source, many-to-many)
