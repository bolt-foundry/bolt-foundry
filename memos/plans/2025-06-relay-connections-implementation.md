# Relay Connections Implementation Plan

## Overview

This version extends the gqlBuilder to support Relay-style connections, enabling
any GraphQL type to expose paginated lists following the Relay specification.
The blog system serves as the first implementation, demonstrating how to use the
new connection field type to create a paginated blog listing with proper edges,
nodes, cursors, and page info.

## Goals

| Goal                    | Description                                     | Success Criteria                                             |
| ----------------------- | ----------------------------------------------- | ------------------------------------------------------------ |
| Extend gqlBuilder       | Add connection field type to the builder API    | Can define connection fields using gql.connection()          |
| Implement Relay spec    | Support full Relay connection specification     | Connections have edges, nodes, cursors, and pageInfo         |
| Prove with blog example | Use BlogPost as first implementation            | Can query `blogPosts` with first/last/after/before arguments |
| Enable reusability      | Make connections available to all GraphQL types | Other types can use the same connection pattern              |

## Anti-Goals

| Anti-Goal                 | Reason                                                    |
| ------------------------- | --------------------------------------------------------- |
| Blog metadata extraction  | Keep blog example simple to focus on connection mechanics |
| UI implementation         | Focus exclusively on GraphQL schema layer                 |
| Complex cursor strategies | Start with simple cursor implementation                   |
| Database integration      | Use filesystem-based BlogPost to avoid storage complexity |

## Technical Approach

The implementation extends gqlBuilder to support connection fields, integrating
with Nexus's connectionPlugin. The approach involves:

1. **Extending gqlBuilder**: Add a `connection()` method to the builder API that
   generates proper Nexus connection field definitions
2. **Type generation**: Update gqlSpecToNexus to handle connection field
   specifications
3. **Integration with existing patterns**: Ensure connections work with the
   current resolver and type system

The BlogPost implementation serves as the test case, using filesystem-based
posts with date-prefixed naming (YYYY-MM-title.md) to demonstrate reverse
chronological pagination.

## Components

| Status | Component                  | Purpose                                                            |
| ------ | -------------------------- | ------------------------------------------------------------------ |
| [ ]    | gqlBuilder.connection()    | New builder method for defining connection fields                  |
| [ ]    | Connection field spec type | Type definitions for connection specifications                     |
| [ ]    | gqlSpecToNexus updates     | Handle connection fields in type conversion                        |
| [ ]    | BlogPost.listAll()         | List all blog posts from filesystem in reverse chronological order |
| [ ]    | BlogPost.connection()      | Static method to create Relay connection from post list            |
| [ ]    | Query.blogPosts connection | GraphQL field using new connection builder                         |
| [ ]    | Integration tests          | Verify connection queries work correctly                           |

## Technical Decisions

| Decision                   | Reasoning                                   | Alternatives Considered                   |
| -------------------------- | ------------------------------------------- | ----------------------------------------- |
| Extend gqlBuilder          | Keep consistent API for all field types     | Direct Nexus usage (breaks abstraction)   |
| Use Nexus connectionField  | Leverage existing connection infrastructure | Implement custom connection types         |
| connectionFromArray helper | Standard Relay implementation               | Custom pagination logic                   |
| Static connection method   | Clean separation of concerns                | Instance methods (requires instantiation) |
| Support custom args        | Enable sorting, filtering from the start    | Relay args only (too limiting)            |

## Example Usage

The blog implementation will use the new connection builder like this:

```typescript
// In Query class
static override gqlSpec = this.defineGqlNode((field) =>
  field
    .connection("blogPosts", () => BlogPost, {
      args: (a) => a
        .string("sortDirection")  // "ASC" or "DESC", defaults to "DESC" in resolver
        .string("filterByYear"),  // Optional: "2025" to filter posts from that year
      resolve: async (_root, args, _ctx) => {
        // Sort direction defaults to DESC (newest first) for blogs
        const sortDir = args.sortDirection || "DESC";
        const posts = await BlogPost.listAll(sortDir);
        
        // Apply year filter if provided
        const filtered = args.filterByYear 
          ? posts.filter(p => p.id.startsWith(args.filterByYear))
          : posts;
        
        // BlogPost.connection handles Relay pagination
        return BlogPost.connection(filtered, args);
      }
    })
)
```

## Design Decisions from Research

### Connection Method Signature

Based on the existing builder pattern, the connection method should follow this
signature:

```typescript
connection<N extends string>(
  name: N,
  targetThunk: GqlObjectThunk,  // Same pattern as object()
  opts?: {
    args?: (ab: ArgsBuilder) => ArgsBuilder;  // Custom args beyond Relay's
    resolve: (
      root: ThisNode,
      args: ConnectionArguments & CustomArgs,  // Merged Relay + custom args
      ctx: BfGraphqlContext,
      info: GraphQLResolveInfo,
    ) => MaybePromise<Connection<TargetType>>;
  }
): GqlBuilder<R>;
```

Note: Connections are always nullable by default (following GraphQL best
practices). The nonNull modifier is not supported for connection fields.

### Resolver Pattern

The resolver pattern follows the same approach as other fields:

- Custom resolver is always required for connections (no default resolver)
- Resolver must return a Connection<T> type from graphql-relay library
- Args are typed as ConnectionArguments merged with any custom args

### Connection Specification Type

The connection field spec should be stored in the GqlNodeSpec under a new
`connections` property:

```typescript
interface GqlConnectionDef {
  type: string; // Target type name (resolved from thunk)
  args: Record<string, unknown>; // Custom args from builder
  resolve: ConnectionResolver;
  _targetThunk: GqlObjectThunk; // For type resolution
}
```

### Args Handling

Connection args combine Relay's standard args with custom args:

- Relay provides: first, last, after, before (via ConnectionArguments)
- Custom args are defined using the same ArgsBuilder pattern as other fields
- Nexus connectionField automatically merges both sets of args
- Resolver receives the combined args object

### Integration with gqlSpecToNexus

The conversion to Nexus will:

- Process connections from the new `connections` property in GqlNodeSpec
- Use `t.connectionField()` instead of `t.field()` for connection fields
- Pass the resolver directly since Nexus handles the connection wrapping
- Resolve the target type from the thunk (same as object fields)

## Implementation Order

1. ~~Study existing gqlBuilder patterns and field types~~ ✓
2. ~~Design connection() method API for gqlBuilder~~ ✓
3. Write failing tests for gqlBuilder.connection() method
   - Test that connection() method exists on builder
   - Test that it accepts name, targetThunk, and options
   - Test that it returns the builder for chaining
   - Test that it stores connection in spec.connections
4. Write failing tests for gqlSpecToNexus connection processing
   - Test that connections are converted to t.connectionField()
   - Test that custom args are passed correctly
   - Test that resolver is wrapped properly
5. Update GqlNodeSpec interface to add connections property
6. Implement connection() method in makeGqlBuilder
7. Add GqlConnectionDef type definition
8. Update gqlSpecToNexus to process connections using t.connectionField()
9. Verify all builder tests now pass
10. Write failing test for BlogPost.listAll() with sort direction
11. Implement BlogPost.listAll() with sort direction support
12. Write failing test for BlogPost.connection()
13. Add BlogPost.connection() static method using connectionFromArray
14. Update Query to use gql.connection() for blogPosts
15. Write integration test for GraphQL connection query
16. Build and verify schema generation
17. Test in GraphQL playground with various arg combinations

## Test Plan

### Builder Tests (Core functionality)

- gqlBuilder.connection() method behavior
  - Accepts connection field definition
  - Supports custom args via ArgsBuilder
  - Stores connection spec correctly
  - Returns builder for chaining
- gqlSpecToNexus connection processing
  - Converts to Nexus connectionField
  - Handles type resolution from thunk
  - Merges custom args with Relay args
  - Wraps resolver correctly

### Blog Implementation Tests (Proof of concept)

- Unit test for BlogPost.listAll() reverse chronological sorting
- Unit test for BlogPost.connection() pagination
- Integration test for GraphQL query with various arguments
- Manual test in GraphQL playground to verify newest posts appear first

### Expected GraphQL Query

```graphql
query BlogListing {
  blogPosts(
    first: 10,
    sortDirection: "DESC",
    filterByYear: "2025"
  ) {
    edges {
      cursor
      node {
        id
        content
      }
    }
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    count  # Extended by our connectionPlugin config
  }
}
```
