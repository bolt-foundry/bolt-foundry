# GraphQL Builder Usage Guide

This guide provides examples and best practices for using the GraphQL Builder in
the Bolt Foundry codebase.

## Quick Start

```typescript
// Example node type definition
class MyNode extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .nonNull.id("id")
      .nonNull.string("name")
      .boolean("isActive")
      .object("owner", () => User)
      .mutation("updateName", {
        args: (a) => a.nonNull.string("newName"),
        returns: (r) => r.nonNull.boolean("success").string("message"),
        resolve: async (root, { newName }, ctx) => {
          // Implementation here
          return { success: true, message: "Name updated" };
        },
      })
  );
}
```

## Core Components

The GraphQL Builder consists of the following key components:

1. **Field Builder** (`makeGqlBuilder.ts`): Defines scalar and object fields
2. **Argument Builder** (`makeArgBuilder.ts`): Defines arguments for fields and
   mutations
3. **Returns Builder** (`makeReturnsBuilder.ts`): Defines return types for
   mutations
4. **Spec Generator** (`makeGqlSpec.ts`): Collects fields, relations, and
   mutations
5. **Nexus Converter** (`gqlSpecToNexus.ts`): Converts specs to Nexus types

## Current Limitations

### ⚠️ List/Array Types Not Supported

The GraphQL builder currently does NOT support list fields. You cannot define
fields that return arrays such as:

- `[String]` - List of strings
- `[Int]` - List of integers
- `[PublishedDocument]` - List of custom objects

### ⚠️ Connection Types Not Implemented

Relay-style connections with pagination are not yet implemented in the GraphQL
builder.

### Workarounds for Collections

- Use custom object relationships with manual pagination logic
- Return a single string with delimited values (e.g., comma-separated)
- Create a wrapper object that contains the array as a JSON string field
- Implement custom edge relationships using the `.object()` method

These are known limitations that will be addressed in a future release.

## Defining Fields

### Scalar Fields

```typescript
.string("name")           // Nullable string field
.nonNull.string("name")   // Required string field
.int("count")             // Nullable integer field
.nonNull.int("count")     // Required integer field
.boolean("isActive")      // Nullable boolean field
.nonNull.boolean("isActive") // Required boolean field
.id("id")                 // Nullable ID field
.nonNull.id("id")         // Required ID field
```

### Object Fields (Relationships)

```typescript
// Basic relationship (implicit edge relationship)
.object("organization", () => BfOrganization)

// With custom resolver (not an edge relationship)
.object("organization", () => BfOrganization, {
  resolve: (root, args, ctx) => ctx.getOrganizationById(root.organizationId)
})

// With arguments
.object("organization", () => BfOrganization, {
  args: (a) => a.string("filter")
})

// Handling circular dependencies
.object("organization", () => 
  import("../nodeTypes/BfOrganization.ts").then(m => m.BfOrganization)
)

// Reversed direction relationship
.object("followers", () => BfPerson, { 
  isSourceToTarget: false // Makes this a target→source relationship
})
```

## Defining Mutations

```typescript
.mutation("createItem", {
  // Define arguments
  args: (a) => a
    .nonNull.string("name")
    .string("description")
    .nonNull.int("quantity"),
  
  // Define return type
  returns: (r) => r
    .nonNull.boolean("success")
    .string("message")
    .object("item", () => Item),
  
  // Implement resolver
  resolve: async (root, args, ctx, info) => {
    // Implementation here
    return {
      success: true,
      message: "Item created successfully",
      item: newItem
    };
  }
})
```

## Edge Relationships

Edge relationships are automatically created for object fields without custom
resolvers. The field name becomes the edge role name, and the relationship is
resolved through the BfEdge model.

```typescript
// This creates an edge with role "memberOf" from the current node to BfOrganization
.object("memberOf", () => BfOrganization)
```

## Real-World Examples

### Query Root

```typescript
// apps/bfDb/graphql/roots/Query.ts
export class Query extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((field) =>
    field
      .boolean("ok")
      .object("currentViewer", () => CurrentViewer)
  );

  override toGraphql() {
    return { __typename: "Query", id: "Query" };
  }
}
```

### Waitlist Example

```typescript
// apps/bfDb/graphql/roots/Waitlist.ts
export class Waitlist extends GraphQLObjectBase {
  static override gqlSpec = this.defineGqlNode((gql) =>
    gql
      .id("id")
      .mutation("joinWaitlist", {
        args: (a) =>
          a
            .nonNull.string("email")
            .nonNull.string("name")
            .nonNull.string("company"),
        returns: (r) =>
          r
            .string("message")
            .nonNull.boolean("success"),
        async resolve(_src, { email, name, company }) {
          // Implementation here
          return {
            success: true,
            message: "Successfully joined waitlist",
          };
        },
      })
  );
}
```

## Best Practices

1. **Always define an id field**: Every GraphQL type should have an id field
   ```typescript
   .nonNull.id("id")
   ```

2. **Use nonNull for required fields**: Make fields required when appropriate
   ```typescript
   .nonNull.string("name")
   ```

3. **Clear naming conventions**: Use descriptive field names
   ```typescript
   // Good
   .string("fullName")

   // Avoid
   .string("n")
   ```

4. **Handle circular dependencies**: Use dynamic imports for circular references
   ```typescript
   .object("parent", () => 
     import("../models/Parent.ts").then(m => m.Parent)
   )
   ```

5. **Type safety**: Leverage the builder's type inference for resolvers
   ```typescript
   .mutation("createUser", {
     args: (a) => a.nonNull.string("name"),
     returns: (r) => r.nonNull.boolean("success"),
     // TypeScript infers args.name as string and return type as { success: boolean }
     resolve: (root, args, ctx) => {
       return { success: true };
     }
   })
   ```

6. **Resolver implementation**: Follow the resolver chain guidelines
   - Custom resolver in opts.resolve
   - root.props[name] if present
   - root[name] as getter or method

## Future Enhancements (v0.2 and Beyond)

1. **Node Interface**:
   - GraphQLNode class and Node interface implementation
   - Barrel files for automatic interface registration
   - No manual registration required - just export from barrel file

2. **List Support**: Array types for fields and arguments
3. **Connection Support**: Relay-style connections with pagination
4. **Validation**: Schema validation against bfNodeSpec.relations

For more detailed information, see the
[Implementation Plan](/apps/bfDb/docs/0.1/implementation-plan.md) and
[Status Document](/apps/bfDb/docs/status.md).
