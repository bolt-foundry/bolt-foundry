# Phase 9: Edge Methods Implementation

[← Previous Phase](./phase-8-many-relationship-migration.md) |
[Back to README](./README.md)

**Goal**: Implement missing edge methods in BfNode to enable full functionality
of automatic relationship methods

**Status**: The automatic relationship methods framework is complete but mostly
non-functional due to missing edge operations in BfNode.

## Current State

### ✅ What's Complete

- Type system for relationship methods
- Runtime method generation
- GraphQL integration framework
- Batch operations and async iteration
- Migration to new patterns begun

### ❌ What's Not Working

- Most relationship methods return empty results or null
- Edge creation uses workarounds
- No edge querying or deletion
- Can't distinguish between relationship types

## Missing Edge Methods

### 1. Critical Method: `findEdges()`

**Purpose**: Query edges connected to a node with filtering options

**Signature**:

```typescript
async findEdges(
  cv: CurrentViewer,
  options: {
    direction: "in" | "out" | "both";
    label?: string;         // Filter by edge label (relationship name)
    targetId?: BfGid;       // Filter by specific target node
  }
): Promise<Array<BfEdge>>
```

**Blocks**:

- `find{RelationName}()` - Can't find related nodes
- `findX{RelationName}()` - Can't find related nodes
- `unlink{RelationName}()` - Can't find edges to delete
- `remove{RelationName}()` - Can't find edges to remove
- `add{RelationName}()` - Can't check for duplicates

**Used in**: 5+ different TODO blocks in relationshipMethods.ts

### 2. Edge Creation: `createEdge()`

**Purpose**: Create a single edge between nodes

**Signature**:

```typescript
async createEdge(
  cv: CurrentViewer, 
  edgeProps: {
    targetId: BfGid;
    label: string;          // Relationship name
    props?: Record<string, JSONValue>;
  }
): Promise<BfEdge>
```

**Blocks**:

- `create{RelationName}()` - Currently uses BfEdge.createBetweenNodes workaround
- `add{RelationName}()` - Currently uses workaround

**Current Workaround**:

```typescript
await BfEdge.createBetweenNodes(cv, sourceNode, targetNode, { role: label });
```

### 3. Batch Edge Creation: `createEdges()`

**Purpose**: Create multiple edges atomically for performance

**Signature**:

```typescript
async createEdges(
  cv: CurrentViewer,
  edgePropsArray: Array<{
    targetId: BfGid;
    label: string;
    props?: Record<string, JSONValue>;
  }>
): Promise<Array<BfEdge>>
```

**Blocks**:

- `addMany{RelationName}()` - Falls back to loop
- `createMany{RelationName}()` - Falls back to loop

### 4. Batch Edge Deletion: `deleteEdges()`

**Purpose**: Delete multiple edges atomically

**Signature**:

```typescript
async deleteEdges(
  cv: CurrentViewer,
  edgeIds: Array<BfGid>
): Promise<void>
```

**Blocks**:

- `removeMany{RelationName}()` - Can't remove edges in batch

### 5. Enhanced `queryTargetInstances()`

**Current Signature**:

```typescript
async queryTargetInstances<T extends typeof BfNode>(
  nodeClass: T,
  props?: Partial<PropsBase>,
  metadata?: Partial<BfMetadata>
): Promise<Array<InstanceType<T>>>
```

**Needed Enhancement**: Add role/label filtering

```typescript
async queryTargetInstances<T extends typeof BfNode>(
  nodeClass: T,
  props?: Partial<PropsBase>,
  metadata?: Partial<BfMetadata>,
  options?: {
    role?: string;  // Filter by edge label
  }
): Promise<Array<InstanceType<T>>>
```

**Blocks**:

- `findAll{RelationName}()` - Returns all connected nodes, not just ones with
  specific relationship
- `query{RelationName}()` - Can't filter by relationship type
- `connectionFor{RelationName}()` - Can't filter by relationship type

## Implementation Details

### Where to Add Methods

**File**: `/@bfmono/apps/bfDb/classes/BfNode.ts`

Add these methods to the BfNode class alongside existing methods like
`queryTargetInstances()`.

### Example Implementation Pattern

```typescript
/**
 * Find edges connected to this node
 */
async findEdges(
  cv: CurrentViewer,
  options: {
    direction: "in" | "out" | "both";
    label?: string;
    targetId?: BfGid;
  } = { direction: "out" }
): Promise<Array<BfEdge>> {
  // Query edges from storage
  const edges = await storage.queryEdges(cv.orgBfOid, {
    sourceId: this.id,
    label: options.label,
    targetId: options.targetId,
    // ... handle direction
  });
  
  return edges.map(e => BfEdge.fromStorage(cv, e));
}
```

### TODOs to Uncomment

Once these methods are implemented, uncomment the TODO blocks in:

- `/@bfmono/apps/bfDb/builders/bfDb/relationshipMethods.ts`

There are **13 different TODO implementations** waiting to be activated.

## Testing Strategy

### 1. Unit Tests for Edge Methods

- Test findEdges with various filter combinations
- Test edge creation and batch operations
- Test edge deletion

### 2. Integration Tests

- Verify relationship methods work end-to-end
- Test the failing `RlhfPipelineIntegrationTest`
- Ensure all relationship patterns work

### 3. Performance Tests

- Verify batch operations are more efficient
- Test with large collections

## Success Criteria

- All relationship methods return correct data
- No more empty arrays or null returns
- Edge operations are atomic and consistent
- Batch operations improve performance
- All tests pass, including the currently failing one

## Implementation Priority

1. **`findEdges()`** - Highest priority, unblocks the most functionality
2. **Enhanced `queryTargetInstances()`** - Quick win to make many relationships
   partially work
3. **`createEdge()`** - Clean up workarounds
4. **Batch methods** - Performance optimization

## Next Steps

1. **Implement edge methods in BfNode**:
   ```typescript
   // Add to BfNode class
   async findEdges(cv, options) { ... }
   async createEdge(cv, edgeProps) { ... }
   async createEdges(cv, edgePropsArray) { ... }
   async deleteEdges(cv, edgeIds) { ... }
   ```

2. **Enhance queryTargetInstances**:
   ```typescript
   // Add role parameter
   async queryTargetInstances(nodeClass, props?, metadata?, options?) { ... }
   ```

3. **Uncomment TODOs in relationshipMethods.ts**:
   - Remove stub implementations
   - Activate real edge operations

4. **Run tests**:
   ```bash
   bft test apps/bfDb/
   ```

5. **Fix any remaining issues**

6. **Submit PR for Phase 9**

## Expected Outcome

Once Phase 9 is complete:

- All automatic relationship methods will be fully functional
- No more stub implementations
- Edge creation, querying, and deletion will work
- The RLHF pipeline test will pass
- The feature will be production-ready

**Important**: This phase completes the automatic relationship methods feature
by implementing the underlying infrastructure that all previous phases depend
on.
