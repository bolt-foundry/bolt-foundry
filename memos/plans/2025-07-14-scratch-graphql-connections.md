# Scratch GraphQL Connections Implementation

**Date:** 2025-07-14\
**Status:** Planning\
**Context:** Enabling RLHF pipeline development with basic GraphQL connections

## Problem Statement

The GraphQL connection builder infrastructure exists and works, but cannot be
used for real relationships because node traversal methods are missing/commented
out. We need a scratch implementation that:

1. Allows RLHF development to proceed with real data
2. Provides the GraphQL connection structure frontend expects
3. Fails gracefully when pagination is attempted
4. Creates clear pressure to restore traversal when needed

## Current State

**✅ Working:**

- GraphQL connection builder in `makeGqlBuilder.ts`
- Relay-style schema generation
- BlogPost example (but uses filesystem, not relationships)

**❌ Missing:**

- `node.queryTargetInstances()` / `node.querySources()` methods
- All `BfEdge.ts` traversal methods (commented out lines 82-192)
- API layer between backend traversal and node instances

## Proposed Solution: Option C Implementation

### Core Approach

Add a static `connection()` method to `BfNode` that:

- **Works for basic queries** (no pagination args)
- **Returns real data** using static queries as fallback
- **Fails clearly** when cursor-based pagination is attempted
- **Maintains GraphQL connection structure**

### Implementation Plan

#### 1. Use Existing BfErrorNotImplemented

```typescript
// Already exists in lib/BfError.ts - no need to create new class
export class BfError extends Error {}
export class BfErrorNotImplemented extends BfError {
  override message = "Not implemented";
}
```

#### 2. Add Static Connection Method to BfNode

```typescript
// In apps/bfDb/classes/BfNode.ts
import { BfErrorNotImplemented } from '@bfmono/lib/BfError.ts';

static connection<T extends BfNode>(
  nodes: Array<T>, 
  args: ConnectionArguments
): Connection<T> {
  // Check for pagination args
  if (args.first || args.last || args.after || args.before) {
    throw new BfErrorNotImplemented(
      "Cursor-based pagination requires node traversal methods. Use static queries without pagination args for now."
    );
  }
  
  // Return basic connection structure
  return connectionFromArray(nodes, {});
}
```

#### 3. Add Relationship Query Fallbacks

For specific relationship patterns needed in RLHF (using proper edge-based
queries):

```typescript
// Temporary fallback for deck -> samples (via edges)
static async querySamplesForDeck(
  cv: CurrentViewer,
  deckId: BfGid
): Promise<Array<BfSample>> {
  // 1. Query edges from deck to samples
  const edges = await BfEdge.query(
    cv,
    { 
      bfSid: deckId, // source ID = deck
      bfTClassName: "BfSample" // target class = samples
    },
    {}, // no edge props filter
    [] // no specific edge IDs
  );
  
  // 2. Extract target IDs (sample IDs)
  const sampleIds = edges.map(edge => 
    (edge.metadata as BfEdgeMetadata).bfTid
  );
  
  // 3. Query sample nodes
  if (sampleIds.length === 0) return [];
  
  return BfSample.query(
    cv,
    { className: "BfSample" },
    {}, // no props filter
    sampleIds
  );
}

// Temporary fallback for sample -> results  
static async queryResultsForSample(
  cv: CurrentViewer,
  sampleId: BfGid
): Promise<Array<BfGraderResult>> {
  // Similar pattern for sample -> grader results
  const edges = await BfEdge.query(
    cv,
    { 
      bfSid: sampleId,
      bfTClassName: "BfGraderResult" // target class = grader results
    },
    {},
    []
  );
  
  const resultIds = edges.map(edge => 
    (edge.metadata as BfEdgeMetadata).bfTid
  );
  
  if (resultIds.length === 0) return [];
  
  return BfGraderResult.query(
    cv,
    { className: "BfGraderResult" },
    {},
    resultIds
  );
}
```

#### 4. GraphQL Builder Integration

Update connection resolvers to use the new pattern:

```typescript
.connection("samples", () => BfSample, {
  resolve: async (deck, args) => {
    const samples = await BfSample.querySamplesForDeck(deck.id);
    return BfSample.connection(samples, args);
  }
})
```

### Error Handling Strategy

**Clear Error Messages:**

- Mention exactly what's missing (node traversal methods)
- Point to the workaround (static queries)
- Create pressure to implement real solution

**Graceful Degradation:**

- Basic relationship queries work with real data
- Only pagination fails, not the entire query
- Frontend gets expected GraphQL connection structure

### Benefits

1. **Unblocks RLHF Development:** Can build with real relationship data
2. **Progressive Implementation:** Add traversal methods when actually needed
3. **Clear Failure Boundary:** Only breaks on pagination, not basic queries
4. **Maintains Type Safety:** Uses existing GraphQL connection types
5. **Future-Compatible:** Easy to swap in real traversal when restored

### Migration Path

**Phase 1:** Implement scratch connections (this memo) **Phase 2:** Build RLHF
pipeline with basic relationship queries\
**Phase 3:** Restore node traversal when pagination needed **Phase 4:** Replace
scratch methods with real traversal

### Files to Modify

- `apps/bfDb/classes/BfNode.ts` - Add static connection method (import existing
  BfErrorNotImplemented)
- RLHF entity classes - Add specific relationship query methods
- GraphQL resolvers - Update to use new connection pattern

### Success Criteria

- [ ] Can query `deck.samples` without pagination
- [ ] Returns real BfSample instances from relationships
- [ ] Clear error when pagination args used
- [ ] GraphQL schema generates correctly
- [ ] Frontend receives expected connection structure

## Next Steps

1. Implement static connection method in BfNode
2. Add relationship fallback methods for RLHF entities
3. Test with basic GraphQL queries
4. Proceed with RLHF implementation using this pattern

## Appendix: Related Files

### Core Implementation Files

- `apps/bfDb/classes/BfNode.ts` - Base node class, where static connection
  method will be added
- `apps/bfDb/nodeTypes/BfEdge.ts` - Edge class with commented traversal methods
  (lines 82-192)
- `apps/bfDb/builders/graphql/makeGqlBuilder.ts` - GraphQL connection builder
  infrastructure

### GraphQL Infrastructure

- `apps/bfDb/graphql/graphqlServer.ts` - GraphQL server setup
- `apps/bfDb/graphql/__generated__/schema.graphql` - Generated schema with
  connection types
- `apps/bfDb/builders/graphql/gqlSpecToNexus.ts` - Schema generation from specs

### Example Implementation (Filesystem-based)

- `apps/boltFoundry/nodeTypes/BlogPost.ts` - Current working connection example
- Test: `apps/bfDb/tests/test-blogposts-connection.sh`

### RLHF Entity Files (Target Implementation)

- `apps/boltfoundry-com/nodeTypes/BfDeck.ts` - Deck entity for RLHF
- `apps/boltfoundry-com/nodeTypes/BfSample.ts` - Sample entity
- `apps/boltfoundry-com/nodeTypes/BfGrader.ts` - Grader entity
- `apps/boltfoundry-com/nodeTypes/BfGraderResult.ts` - Grader result entity

### Related Documentation

- `apps/bfDb/memos/feature-gap-analysis.md` - Analysis of missing traversal
  features
- `apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md` -
  RLHF implementation plan
- `memos/plans/2025-07-14-restore-node-traversal.md` - Plan for restoring full
  traversal

### Backend Infrastructure (Working)

- `apps/bfDb/infra/adapters/sqlite.ts` - SQLite adapter with traversal methods
- `apps/bfDb/infra/adapters/postgresql.ts` - PostgreSQL adapter with traversal
  methods
- `apps/bfDb/infra/adapters/neon.ts` - Neon adapter with traversal methods
