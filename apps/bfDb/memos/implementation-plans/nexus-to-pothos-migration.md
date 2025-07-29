# Nexus to Pothos Migration Implementation Plan

**Date**: 2025-01-20\
**Status**: Proposal\
**Priority**: High (blocking Google login implementation)\
**Effort**: Medium

## Problem Statement

The current Nexus GraphQL schema builder (v1.3.0) has a critical bug where
interface implementations are filtered out during schema generation. This is
blocking Google login implementation in boltfoundry-com because:

1. `CurrentViewer` interface and concrete types (`CurrentViewerLoggedIn`,
   `CurrentViewerLoggedOut`) are correctly created
2. Types are properly added to the final types array with
   `implements: "CurrentViewer"`
3. But Nexus fails to include them in the generated schema due to a known
   interface implementation bug

## Root Cause Analysis

- **Nexus v1.3.0 is stagnant** (3 years old, no active maintenance)
- **Interface implementation filtering bug** in schema generation phase
- **No viable workarounds** without significant complexity
- **Similar issues reported** in Nexus GitHub issues #361 and #499

## Proposed Solution: Migrate to Pothos GraphQL

### Why Pothos?

1. **Actively maintained** (latest v4.x, regular updates)
2. **No known interface implementation bugs**
3. **Similar code-first API** to Nexus - easier migration than GraphQL Tools
4. **Zero runtime overhead** like Nexus
5. **Better TypeScript support** and type safety
6. **Used by major companies** (Airbnb, Netflix)

### Architecture Advantage: Existing Builder Abstraction

Our codebase already has a sophisticated builder abstraction that sits on top of
Nexus:

```typescript
// High-level API (stays unchanged)
static override gqlSpec = this.defineGqlNode((gql) =>
  gql
    .id("id")
    .string("personBfGid")
    .string("orgBfOid")
);
```

**This means migration impact is minimal** - we only need to change the backend
implementation, not the 28+ files using our builder API.

## Implementation Plan

### Phase 1: Infrastructure Setup

1. **Add Pothos dependency** to `deno.jsonc`
   ```json
   "@pothos/core": "npm:@pothos/core@^4.x.x"
   ```

2. **Create parallel Pothos implementation**
   - `gqlSpecToPothos.ts` - new backend converter
   - `schemaConfigPothos.ts` - Pothos schema builder
   - Keep existing Nexus files for fallback

### Phase 2: Core Conversion

1. **Implement `gqlSpecToPothos.ts`**
   - Convert field definitions (`.string()`, `.id()`, etc.)
   - Handle object relationships (`.object()`)
   - Support interface implementation
   - Convert mutations and arguments

2. **Create Pothos schema config**
   - Replace `makeSchema()` with Pothos `builder.toSchema()`
   - Implement interface type resolution
   - Handle custom scalars (IsoDate, JSON)

### Phase 3: Interface Fix

1. **Fix CurrentViewer types specifically**
   - Implement `CurrentViewer` interface in Pothos
   - Create `CurrentViewerLoggedIn` and `CurrentViewerLoggedOut` types
   - Ensure proper interface implementation

2. **Test Google login integration**
   - Verify `currentViewer` query works
   - Test `loginWithGoogleToken` mutation
   - Validate interface type resolution

### Phase 4: Full Migration

1. **Convert remaining type categories**
   - Node types (BfPerson, BfOrganization, etc.)
   - Root types (Query, Waitlist)
   - Custom classes

2. **Testing and validation**
   - Run existing GraphQL tests
   - Compare generated schemas (Nexus vs Pothos)
   - Performance testing

3. **Cleanup**
   - Remove Nexus dependency
   - Delete old Nexus files
   - Update documentation

## Migration Strategy Details

### Files to Modify

```
apps/bfDb/graphql/
├── gqlSpecToPothos.ts           (new - core converter)
├── schemaConfigPothos.ts        (new - schema builder)
├── loadGqlTypesPothos.ts        (new - type loader)
└── server.ts                    (update schema import)

deno.jsonc                       (add Pothos dependency)
```

### Files Unchanged (28+ files)

- All files using `defineGqlNode()` API
- All `gqlSpec` definitions
- Business logic and resolvers
- Test files (interface tests will pass!)

### Interface Implementation in Pothos

```typescript
// Pothos interface (clean, no bugs)
const CurrentViewer = builder.interfaceType("CurrentViewer", {
  fields: (t) => ({
    id: t.string({ nullable: false }),
    personBfGid: t.string({ nullable: true }),
    orgBfOid: t.string({ nullable: true }),
  }),
});

// Implementing types (automatic field inheritance)
builder.objectType("CurrentViewerLoggedIn", {
  interfaces: [CurrentViewer],
  fields: (t) => ({
    // Additional fields if needed
  }),
});
```

## Risk Assessment

### Low Risk Factors

- **Existing abstraction layer** isolates most code from changes
- **Pothos API similarity** to Nexus reduces conversion complexity
- **Parallel implementation** allows gradual migration with fallback
- **Well-defined scope** - only GraphQL schema generation changes

### Mitigation Strategies

- **Incremental rollout**: Start with CurrentViewer types only
- **Schema comparison**: Validate Pothos generates identical schema
- **Comprehensive testing**: Run full test suite before switching
- **Rollback plan**: Keep Nexus implementation until fully validated

## Success Criteria

1. **Immediate**: Google login works in boltfoundry-com
2. **Schema equivalence**: Generated GraphQL schema matches current Nexus output
3. **Test passing**: All existing GraphQL tests continue to pass
4. **Performance**: No degradation in schema generation or query performance
5. **Developer experience**: Builder API remains unchanged for developers

## Timeline

- **Phase 1**: Pothos setup + CurrentViewer implementation
- **Phase 2**: Full type conversion + Google login testing
- **Phase 3**: Testing, validation, cleanup

## Follow-up Benefits

1. **Future-proof**: Active maintenance and community support
2. **Better TypeScript**: Improved type safety and developer experience
3. **Plugin ecosystem**: Access to Pothos plugins for auth, validation, etc.
4. **Performance**: Potential schema generation improvements

## Alternative Considered

### Manual Nexus Workarounds

- **Pros**: Minimal change scope
- **Cons**: Hacky, might break with future changes, doesn't solve root cause
- **Verdict**: Rejected due to technical debt concerns

### GraphQL Tools Migration

- **Pros**: Schema-first approach, widely used
- **Cons**: Major API changes, significant migration effort, different paradigm
- **Verdict**: Rejected due to high migration cost

## Recommendation

**Proceed with Pothos migration** as the most pragmatic solution that:

- Solves the immediate Google login blocker
- Leverages our existing builder abstraction
- Provides long-term maintainability
- Minimizes disruption to existing codebase

The investment in migration pays dividends in future maintainability and
eliminates a class of interface-related bugs that could resurface in other parts
of the system.
