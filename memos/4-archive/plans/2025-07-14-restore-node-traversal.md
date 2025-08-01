# Restore Node Traversal Functionality

**Date**: 2025-07-14\
**Status**: Draft\
**Priority**: High\
**Scope**: Core Infrastructure

## Summary

The current BfNode implementation lacks critical graph traversal capabilities
that existed in the previous implementation. This memo outlines a plan to
restore sophisticated node relationship traversal while maintaining the improved
type safety and architecture of the current system.

## Current State Analysis

### ✅ What Works

- Basic node CRUD operations (`query`, `find`, `findX`, `save`, `delete`)
- Edge creation via `createTargetNode()`
- Backend traversal infrastructure (`queryAncestorsByClassName`,
  `queryDescendantsByClassName`)
- Strong TypeScript typing with generics

### ❌ Missing Critical Functionality

- Instance-level traversal methods on BfNode
- Edge-based relationship querying
- GraphQL connection support for relationships
- Ancestor/descendant traversal from node instances
- Smart edge cleanup and cascade deletion
- Orphan node detection and cleanup

### 🚧 Partially Implemented

- BfEdge has commented-out traversal methods that need completion
- Backend database functions exist but lack frontend API

## Implementation Plan

### Phase 1: Core Instance Traversal Methods

Add these methods to `BfNode` class:

```typescript
// Recursive tree traversal
public async queryAncestorsByClassName<TSourceClass>(
  BfNodeClass: TSourceClass,
  limit: number = 10,
): Promise<Array<InstanceType<TSourceClass>>>

public async queryDescendantsByClassName<TTargetClass>(
  BfNodeClass: TTargetClass, 
  limit: number = 10,
): Promise<Array<InstanceType<TTargetClass>>>

// Direct relationship traversal
public async querySourceInstances<TSourceClass>(
  SourceClass: TSourceClass,
  nodeProps?: Partial<BfNodeProps>,
  edgeProps?: Partial<BfEdgeProps>
): Promise<Array<InstanceType<TSourceClass>>>

public async queryTargetInstances<TTargetClass>(
  TargetClass: TTargetClass,
  nodeProps?: Partial<BfNodeProps>, 
  edgeProps?: Partial<BfEdgeProps>
): Promise<Array<InstanceType<TTargetClass>>>
```

**Dependencies**:

- Use existing `DatabaseBackend.queryAncestorsByClassName()` and
  `queryDescendantsByClassName()`
- Delegate edge-based queries to restored BfEdge methods

### Phase 2: Restore BfEdge Traversal Methods

Uncomment and complete these methods in `BfEdge`:

```typescript
// Core edge traversal
static async querySourceInstances<TSourceClass>(
  currentViewer: BfCurrentViewer,
  SourceClass: TSourceClass,
  targetBfGid: string,
  nodeProps?: Partial<BfNodeProps>
): Promise<Array<InstanceType<TSourceClass>>>

static async queryTargetInstances<TTargetClass>(
  currentViewer: BfCurrentViewer,
  TargetClass: TTargetClass,
  sourceBfGid: string,
  nodeProps?: Partial<BfNodeProps>,
  edgeProps?: Partial<BfEdgeProps>  
): Promise<Array<InstanceType<TTargetClass>>>

// Edge discovery
static async querySourceEdgesForNode(bfNode: BfNode): Promise<Array<BfEdge>>
static async queryTargetEdgesForNode(bfNode: BfNode): Promise<Array<BfEdge>>
```

**Implementation Pattern**:

1. Query edges using existing `BfEdge.query()` method
2. Extract node IDs from edge results
3. Batch query nodes using `TargetClass.query()` with ID filter
4. Return properly typed node instances

### Phase 3: GraphQL Connection Support

Add GraphQL pagination support for relationship queries:

```typescript
// On BfNode
public async queryTargetsConnectionForGraphQL<TTargetClass>(
  TargetClass: TTargetClass,
  connectionArgs: ConnectionArguments,
  nodeProps?: Partial<BfNodeProps>,
  edgeProps?: Partial<BfEdgeProps>
): Promise<Connection<InstanceType<TTargetClass>>>

// On BfEdge  
static async queryTargetsConnectionForGraphQL<TTargetClass>(
  currentViewer: BfCurrentViewer,
  TargetClass: TTargetClass,
  sourceBfGid: string,
  nodeProps: Partial<BfNodeProps>,
  connectionArgs: ConnectionArguments,
  edgeProps?: Partial<BfEdgeProps>
): Promise<Connection<InstanceType<TTargetClass>>>
```

**Features**:

- Cursor-based pagination
- Total count support
- Proper GraphQL Connection interface compliance

### Phase 4: Smart Deletion and Lifecycle Management

Restore intelligent edge and node cleanup:

```typescript
// On BfEdge
static async deleteEdgesTouchingNode(
  currentViewer: BfCurrentViewer, 
  bfGid: string
): Promise<void>

static async deleteAndCheckForNetworkDelete(
  currentViewer: BfCurrentViewer,
  edge: BfEdge
): Promise<void>

// On BfNode - override delete method
override async delete(): Promise<void> {
  const bfGid = this.metadata.bfGid;
  await super.delete();
  await BfEdge.deleteEdgesTouchingNode(this.currentViewer, bfGid);
}
```

**Smart Deletion Logic**:

- When deleting edge, check if target becomes orphaned
- If target has no remaining incoming edges, delete target node
- Prevent orphaned nodes in the graph
- Maintain referential integrity

## Implementation Details

### Type Safety Considerations

All methods must maintain strict TypeScript typing:

- Use generics with proper constraints: `TClass extends Constructor<BfNode>`
- Return properly typed instances: `Array<InstanceType<TClass>>`
- Support both required and optional props filtering
- Maintain compatibility with existing GraphQL schema generation

### Performance Optimizations

- **Default Limits**: All traversal methods default to `limit: 10` to prevent
  runaway queries
- **Cycle Detection**: Backend already handles cycles in recursive queries
- **Batch Queries**: Use efficient two-phase queries (edges first, then nodes)
- **Organization Scoping**: All queries automatically scoped to current viewer's
  organization

### Error Handling

- Use consistent error patterns from current codebase
- Handle edge cases like missing nodes, invalid relationships
- Provide clear error messages for relationship constraint violations

### Testing Strategy

Create comprehensive test suites covering:

- **Basic Traversal**: Direct parent/child relationships
- **Deep Traversal**: Multi-level ancestor/descendant queries
- **Complex Graphs**: Multiple parents, shared children, cycles
- **Performance**: Large relationship sets, depth limits
- **Edge Cases**: Orphaned nodes, missing relationships
- **GraphQL**: Connection pagination, cursor handling

## Migration Strategy

### Backward Compatibility

- All new methods are additive - no breaking changes
- Existing `createTargetNode()` continues to work unchanged
- Current test suites remain valid

### Rollout Plan

1. **Phase 1**: Implement and test core traversal methods
2. **Phase 2**: Restore edge traversal with comprehensive testing
3. **Phase 3**: Add GraphQL connections (non-breaking)
4. **Phase 4**: Implement smart deletion (potentially breaking - needs
   migration)

### Risk Mitigation

- Extensive testing of cycle detection and performance limits
- Gradual rollout with feature flags if needed
- Monitor query performance in production
- Document all traversal patterns and best practices

## Success Criteria

- [ ] All traversal methods from old implementation are restored
- [ ] Performance meets or exceeds old implementation
- [ ] Type safety is maintained throughout
- [ ] GraphQL schema generation works with new relationships
- [ ] Comprehensive test coverage (>95%) for all traversal scenarios
- [ ] Production usage validates no performance regressions

## Future Considerations

- **Query Optimization**: Consider adding traversal query planning/optimization
- **Caching**: Implement relationship caching for frequently accessed paths
- **Subscriptions**: Add real-time updates for relationship changes
- **Visual Tools**: Consider relationship visualization and debugging tools

This implementation will restore the sophisticated graph traversal capabilities
that make BfNode suitable for complex relationship modeling while maintaining
the improved architecture and type safety of the current system.
