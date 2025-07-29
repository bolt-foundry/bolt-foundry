# Relay Connections Implementation Plan

_Adding proper GraphQL Relay connection types to Pothos while maintaining
pagination restrictions_

**Date**: 2025-07-20\
**Status**: Planning\
**Target**: 2-3 hours implementation

## Executive Summary

The bolt-foundry-monorepo has a "scratch implementation" of GraphQL connections
that provides basic connection structure (edges, pageInfo) but throws
`BfErrorNotImplemented` for any pagination arguments. This plan adds proper
Pothos Relay plugin integration to generate correct connection types while
maintaining the current behavior of throwing on pagination attempts.

## Current State Analysis

### ✅ **WORKING INFRASTRUCTURE**

- **Database pagination**: `bfQueryItemsForGraphQLConnection` in
  `apps/bfDb/bfDb.ts:458-543`
- **Connection builder API**: Methods exist in `makeGqlBuilder.ts:246-275`
- **Basic connection structure**: Returns proper `edges`/`pageInfo` for
  unpaginated queries
- **Test coverage**: Comprehensive tests proving pagination throws errors
  intentionally
- **GraphQL-relay utilities**: `connectionFromArray` already used

### ❌ **MISSING COMPONENTS**

- **Pothos relay plugin**: `@pothos/plugin-relay` not installed
- **Proper connection types**: Currently treated as regular fields in schema
  generation
- **Connection type generation**: `gqlSpecToPothos.ts:365-383` handles
  connections as basic fields

### 🎯 **GOAL**

Generate proper GraphQL schema with `Connection<T>`, `Edge<T>`, and `PageInfo`
types while keeping existing "throw on pagination" behavior for safety.

## Implementation Plan

### Step 1: Install Relay Plugin

**Command**: Use Deno's package manager

```bash
deno add npm:@pothos/plugin-relay@^4.4.2
```

This automatically updates `deno.jsonc` imports and `deno.lock`.

### Step 2: Configure Pothos Builder

**File**: `apps/bfDb/graphql/schemaConfigPothosSimple.ts`

```typescript
import RelayPlugin from "@pothos/plugin-relay";

const builder = new SchemaBuilder({
  plugins: [RelayPlugin],
  relayOptions: {
    cursorType: "String",
    // Skip global ID implementation for now since bfGid doesn't encode type
    // Focus on connection types only
  },
});
```

### Step 3: Update Connection Type Generation

**File**: `apps/bfDb/builders/graphql/gqlSpecToPothos.ts:365-383`

Replace current connection handling:

```typescript
// Current: treats connections as regular fields
// Replace with: proper t.connection() calls

for (
  const [connectionName, connectionSpec] of Object.entries(
    spec.connections ?? {},
  )
) {
  objectBuilder[connectionName] = t.connection({
    type: connectionSpec.returnType,
    resolve: connectionSpec.resolver,
    // Let existing resolvers handle the pagination restrictions
  });
}
```

### Step 4: Keep Current Pagination Restrictions

**File**: `apps/bfDb/classes/BfNode.ts:174-184`

**NO CHANGES** - keep existing implementation that:

- Works for empty pagination args
- Throws `BfErrorNotImplemented` for `first`, `last`, `after`, `before`
- Uses `connectionFromArray` for basic structure

This ensures no breaking changes while we get proper types.

### Step 5: Add queryTargetConnection() Method

**File**: `apps/bfDb/classes/BfNode.ts`

Add cleaner API method to BfNode base class:

```typescript
async queryTargetConnection<T extends BfNode>(
  targetClass: typeof BfNode & (new (...args: any[]) => T),
  args: ConnectionArguments
): Promise<Connection<T>> {
  const instances = await this.queryTargetInstances(targetClass);
  return targetClass.connection(instances, args);
}
```

**Key insight**: Connection resolvers receive **BfNode instances as root**, not
GraphQL objects. This means resolvers can directly call BfNode methods like
`root.queryTargetInstances()` and `root.queryTargetConnection()`.

This replaces the awkward pattern:

```typescript
// Old way:
const results = await root.queryTargetInstances(BfGraderResult);
return BfGraderResult.connection(results, args);

// New way:
return await root.queryTargetConnection(BfGraderResult, args);
```

### Step 6: Verify Type Generation

**Test areas**:

- GraphQL schema includes proper `Connection`, `Edge`, `PageInfo` types
- Existing tests still pass (pagination still throws)
- Isograph can generate proper TypeScript types from schema
- No runtime behavior changes

## File Structure

```
apps/bfDb/
├── deno.jsonc                               # Add relay plugin
├── graphql/
│   └── schemaConfigPothosSimple.ts         # Configure relay plugin
├── builders/graphql/
│   └── gqlSpecToPothos.ts                   # Update connection generation
├── classes/
│   └── BfNode.ts                            # Keep current pagination restrictions
└── memos/plans/
    └── relay-connections-implementation.md  # This file
```

## Success Criteria

### Functional Requirements

- [ ] Pothos relay plugin installed and configured
- [ ] GraphQL schema generates proper connection types
- [ ] All existing tests continue to pass
- [ ] Pagination arguments still throw `BfErrorNotImplemented`
- [ ] Non-paginated connections work as before

### Technical Requirements

- [ ] Proper `Connection<T>` types in GraphQL schema
- [ ] Proper `Edge<T>` types with cursor fields
- [ ] Proper `PageInfo` with hasNextPage/hasPreviousPage
- [ ] Isograph can generate TypeScript types from new schema
- [ ] No runtime behavior changes

## Risk Mitigation

### Low Risk

- **Plugin configuration**: Well-documented Pothos pattern
- **Type generation**: Relay plugin handles this automatically
- **Backward compatibility**: No changes to resolver logic

### Medium Risk

- **Schema changes**: May affect Isograph type generation
  - _Mitigation_: Test Isograph compilation after changes
- **Connection builder updates**: First time modifying this system
  - _Mitigation_: Follow existing patterns in `gqlSpecToPothos.ts`

## Testing Strategy

### Unit Tests

- Verify Pothos builder accepts relay plugin
- Test connection type generation in isolation
- Validate schema output includes proper types

### Integration Tests

- Run existing `GraphQLConnections.integration.test.ts`
- Verify all tests still pass unchanged
- Test schema compilation and Isograph generation

### Manual Verification

- Examine generated GraphQL schema for proper types
- Test that non-paginated connections work
- Verify pagination still throws appropriate errors

## Future Enhancements

### Phase 2: Actual Pagination (Later)

1. Connect `bfQueryItemsForGraphQLConnection` to resolvers
2. Remove `BfErrorNotImplemented` throwing
3. Implement cursor-based pagination in GraphQL layer
4. Update tests to expect working pagination

### Phase 3: Advanced Features (Much Later)

1. Custom edge types with additional fields
2. Connection-level fields (totalCount, etc.)
3. Global ID implementation for node interface
4. Optimized database queries for large datasets

## Connection Definition Examples

### Current BfDb Builder Pattern

**Working example from Query.ts:**

```typescript
static override gqlSpec = this.defineGqlNode((gql) =>
  gql
    .connection("blogPosts", () => BlogPost, {
      args: (a) => a.string("sortDirection").string("filterByYear"),
      resolve: async (_root, args, _ctx) => {
        const posts = await BlogPost.listAll("DESC");
        return BlogPost.connection(posts, args);
      }
    })
);
```

### Expected RLHF Node Patterns

**BfDeck with samples connection:**

```typescript
static override gqlSpec = this.defineGqlNode((gql) =>
  gql
    .string("name")
    .string("systemPrompt")
    .connection("samples", () => BfSample, {
      args: (a) => a.string("sortBy"),
      resolve: async (root, args, ctx) => {
        return await root.queryTargetConnection(BfSample, args);
      }
    })
);
```

**BfSample with results connection:**

```typescript
static override gqlSpec = this.defineGqlNode((gql) =>
  gql
    .json("completionData")
    .connection("results", () => BfGraderResult, {
      resolve: async (root, args, ctx) => {
        return await root.queryTargetConnection(BfGraderResult, args);
      }
    })
);
```

### Key Pattern Characteristics

- **Resolver required** (unlike regular object fields)
- **Root objects are BfNode instances** - can call methods like
  `root.queryTargetInstances()`
- **Function thunks** for circular dependency resolution
- **Args support** via builder pattern
- **Currently throws on pagination** (`first`, `last`, `after`, `before`)
- **Lazy serialization** - `toGraphql()` happens at field resolution time, not
  between resolvers

### Object Flow Discovery

Research revealed that the BfDb GraphQL system maintains **BfNode instances
throughout the resolver chain**:

- **Field resolvers receive BfNode instances** as `root`, not serialized GraphQL
  objects
- **Connection edges contain raw BfNode instances**, allowing efficient property
  access
- **Serialization is deferred** until individual fields are requested via field
  resolvers
- **No centralized middleware** converts objects - each field resolver handles
  its own data access

This means connection resolvers can directly call BfNode methods on the root
object, making the API much cleaner than originally assumed.

## Notes

### Why This Approach?

1. **Safe iteration**: Get types right before adding functionality
2. **No breaking changes**: Existing code continues working
3. **Clear validation**: Can verify structure without behavior changes
4. **Foundation**: Sets up for actual pagination implementation later

### Implementation Order

1. Plugin installation and configuration
2. Type generation updates
3. Verification and testing
4. Documentation updates

This approach provides a solid foundation for relay connections while
maintaining system stability and existing behavior.

## Appendix: References & Related Links

### Pothos GraphQL Documentation

- **[Pothos Relay Plugin](https://pothos-graphql.dev/docs/plugins/relay)** -
  Official documentation for the relay plugin
- **[Pothos Connection Types](https://pothos-graphql.dev/docs/plugins/relay#connection-types)** -
  Connection and edge type generation
- **[Pothos Node Interface](https://pothos-graphql.dev/docs/plugins/relay#node-interface)** -
  Global ID and node interface implementation
- **[Pothos Schema Builder](https://pothos-graphql.dev/docs/guide/schema-builder)** -
  Core schema building concepts
- **[Pothos Backing Models](https://pothos-graphql.dev/docs/guide/backing-models)** -
  How original objects flow through resolvers

### GraphQL Relay Specification

- **[GraphQL Relay Cursor Connections](https://relay.dev/graphql/connections.htm)** -
  Official relay connection specification
- **[Relay Pagination Best Practices](https://relay.dev/docs/guides/graphql-server-specification/#connections)** -
  Cursor-based pagination patterns
- **[GraphQL Relay Package](https://github.com/graphql/graphql-relay-js)** -
  Reference implementation (used by this codebase)

### Codebase Architecture References

- **[BfNode Base Class](../classes/BfNode.ts)** - Core node implementation with
  connection methods
- **[GraphQL Schema Builder](../builders/graphql/makeGqlBuilder.ts)** - BfDb
  connection builder API
- **[Current Connection Implementation](../classes/BfNode.ts#L174-L194)** -
  Existing connection method that throws on pagination
- **[Connection Integration Tests](../nodeTypes/rlhf/__tests__/GraphQLConnections.integration.test.ts)** -
  Test patterns and expected behavior
- **[Working BlogPosts Connection](../graphql/roots/Query.ts#L28-L46)** -
  Reference implementation

### GraphQL Object Flow Analysis

- **[Default Field Resolver](../builders/graphql/gqlSpecToPothos.ts#L57-L86)** -
  How BfNode properties are accessed
- **[BfNode toGraphql Method](../classes/BfNode.ts#L328-L345)** - Serialization
  from BfNode to GraphQL object
- **[GraphQL Context Utilities](../graphql/utils/graphqlContextUtils.ts)** -
  Context and viewer management
- **[BlogPost Field Resolvers](../nodeTypes/BlogPost.ts#L280)** - Examples of
  direct BfNode method access

### Database Integration

- **[Database Connection Pagination](../bfDb.ts#L458-L543)** -
  bfQueryItemsForGraphQLConnection function
- **[BfEdge Relationship System](../classes/BfEdge.ts)** - Database relationship
  patterns
- **[BfNode Traversal Methods](../classes/BfNode.ts)** - queryTargetInstances
  and querySourceInstances

### Testing and Validation

- **[BfNode Connection Tests](../classes/__tests__/BfNode.connection.test.ts)** -
  Unit tests for connection behavior
- **[Builder Connection Tests](../builders/graphql/__tests__/makeGqlBuilder.connection.test.ts)** -
  Builder API tests
- **[RLHF Integration Tests](../nodeTypes/rlhf/__tests__/GraphQLConnections.integration.test.ts)** -
  End-to-end connection testing

### Development Tools

- **[Deno Package Management](../../deno.jsonc)** - Import maps and workspace
  configuration
- **[BFT Task Runner](../../infra/bft/)** - Development command reference
- **[Schema Generation](../graphql/__generated__/schema.graphql)** - Current
  GraphQL schema output

### Future Implementation References

- **[RLHF MVP Implementation Plan](../../boltfoundry-com/memos/plans/simple-rlhf-mvp.md)** -
  Context for why relay connections are needed
- **[BfSampleFeedback Node](../nodeTypes/rlhf/BfSampleFeedback.ts)** - Target
  node for feedback mutations
- **[Phase 3 UI Implementation](../../boltfoundry-com/memos/plans/phase-3-ui-implementation.md)** -
  Longer-term connection usage plans
