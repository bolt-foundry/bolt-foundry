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
- Maintain backward compatibility at the schema level while changing the
  implementation
- Support edge relationships between node types, with an initial focus on the
  BfPerson to BfOrganization relationship for login functionality
- Establish a solid foundation for future enhancements like Relay connections

## Non-Goals

- Changing the GraphQL schema structure (client-facing API remains the same)
- Removing dependency on Nexus/GraphQL Yoga (still used under the hood)
- Implementing Relay-style connections (deprioritized for v0.1)

## Approach

1. **Builder Pattern**: Create a fluent interface similar to bfNodeSpec
2. **Direct Integration**: Map builder specs to Nexus types at build time
3. **Progressive Migration**: Convert nodes one at a time to minimize disruption
4. **Validation**: Add build-time validation against bfNodeSpec.relations
5. **Testing**: Comprehensive tests for builder, Nexus generation, and resolvers

## Implementation Steps

1. **Core Builder Implementation** ✅
   - Create makeGqlBuilder.ts with fluent interface
   - Implement scalar field methods (.string(), .int(), etc.)
   - Add nullability helpers
   - Create argument builder

2. **Type Generation** 🔄
   - Create gqlSpecToNexus.ts to map specs to Nexus types
   - Implement field resolver logic with proper fallback chain
   - Handle mapping of arguments

3. **Edge Relationships** 🔄
   - Implement simple edge relationship between BfPerson and BfOrganization
   - Support "member of" relationship pattern for organization membership
   - Ensure GraphQL schema correctly exposes this relationship

4. **Validation** ⏱️
   - Add validation for object relations against bfNodeSpec.relations
   - Ensure consistency between database and GraphQL schema

5. **Migration** ⏱️
   - Update GraphQLObjectBase.defineGqlNode
   - Convert one example node as proof of concept
   - Migrate remaining nodes
   - Remove legacy builders

6. **Testing** ⏱️
   - Unit tests for builder functionality
   - Tests for Nexus type generation
   - Integration tests for field resolution
   - Tests for edge relationships
   - End-to-end tests with GraphQL queries

## Technical Design

### Builder Interfaces

```typescript
// GqlBuilder interface - main builder for nodes
interface GqlBuilder {
  // Scalar fields
  string(name: string, opts?: FieldOptions): GqlBuilder;
  int(name: string, opts?: FieldOptions): GqlBuilder;
  float(name: string, opts?: FieldOptions): GqlBuilder;
  boolean(name: string, opts?: FieldOptions): GqlBuilder;
  id(name: string, opts?: FieldOptions): GqlBuilder;

  // Relations
  object(name: string, opts?: RelationOptions): GqlBuilder;

  // Mutations
  mutation(name: string, opts?: MutationOptions): GqlBuilder;

  // Nullability
  nonNull: OmitNonNull<GqlBuilder>;
}

// ArgsBuilder for field arguments
interface ArgsBuilder {
  string(name: string): GraphQLInputType;
  int(name: string): GraphQLInputType;
  float(name: string): GraphQLInputType;
  boolean(name: string): GraphQLInputType;
  id(name: string): GraphQLInputType;

  nonNull: OmitNonNull<ArgsBuilder>;
}
```

### Resolution Logic

Default field resolver chain:

1. Use custom resolver if provided in opts.resolve
2. Try root.props[name] if present
3. Try root[name] as getter or method

For mutations with no custom resolver:

- Call root[name](args, ctx, info) method

### Edge Relationship Implementation

For the BfPerson to BfOrganization relationship:

1. Define edge in BfPerson nodeType with memberOf relationship to BfOrganization
2. Expose the relationship in GraphQL schema using the object method
3. Support bidirectional navigation (person → organization, organization →
   members)
4. Initially focus on a simple 1:n relationship pattern
5. Provide resolver implementation that uses the underlying bfDb edge data

### Nexus Integration

The builder produces a spec object that is converted to Nexus types at build
time:

```typescript
interface GqlSpec {
  fields: Record<string, FieldSpec>;
  mutations: Record<string, MutationSpec>;
}

// Converted to Nexus ObjectType definitions using gqlSpecToNexus.ts
```

## Success Metrics

- All nodes successfully migrated to new builder pattern
- No changes to client-facing GraphQL schema
- All tests passing, including integration tests
- Improved type safety and IDE support
- Easier addition of new GraphQL types

## Future Work (v0.2+)

- Implement Relay-style connections with pagination
- Add more field types and custom scalars
- Enhance validation and error messages
- Optimize schema generation performance
