# Phase 4: Smart Deletion and Lifecycle Management - TDD Implementation Plan

**Date**: 2025-07-15\
**Status**: Implementation Plan\
**Priority**: High\
**Scope**: Complete lifecycle management and smart deletion features

## Overview

This plan implements the final phase of BfDb feature parity, focusing on
completing the lifecycle hook system and implementing intelligent deletion
patterns with cascade cleanup. This phase builds on the foundation established
in phases 1-3 and addresses critical gaps identified in the feature gap
analysis.

## Architecture Foundation

Building on existing infrastructure:

- **Node System**: `apps/bfDb/classes/BfNode.ts` - Basic lifecycle methods exist
- **Edge System**: `apps/bfDb/nodeTypes/BfEdge.ts` - Edge creation implemented
- **Storage Layer**: `apps/bfDb/storage/storage.ts` - Backend abstraction
  complete
- **Test Framework**: `apps/bfDb/utils/testUtils.ts` - Isolated testing support

## Phase 4 Implementation Steps

### Step 1: Complete Lifecycle Hook System

#### 1.1 Test-First: Lifecycle State Management

Create comprehensive test coverage for missing lifecycle methods:

```typescript
// Location: apps/bfDb/classes/__tests__/BfNode.lifecycle.test.ts

describe("BfNode Lifecycle Management", () => {
  test("isNew() returns true for unsaved nodes", async () => {
    // Test that new nodes report isNew=true before first save
  });

  test("isNew() returns false after save", async () => {
    // Test that saved nodes report isNew=false
  });

  test("isDirty() detects property changes", async () => {
    // Test enhanced dirty checking beyond basic JSON comparison
  });

  test("touch() updates lastUpdated without changing data", async () => {
    // Test timestamp updates without triggering full save cycle
  });

  test("beforeSave hook can modify properties", async () => {
    // Test that beforeSave can mutate props before persistence
  });

  test("beforeSave hook can prevent save", async () => {
    // Test that beforeSave can throw to abort save operation
  });

  test("afterSave hook receives updated metadata", async () => {
    // Test that afterSave gets called with fresh metadata
  });

  test("beforeLoad hook can transform data", async () => {
    // Test data transformation during load operations
  });
});
```

#### 1.2 Implementation: Enhanced State Management

```typescript
// Location: apps/bfDb/classes/BfNode.ts

export abstract class BfNode<TProps extends PropsBase = {}> {
  private _isNew: boolean = true;
  private _originalProps: TProps | null = null;

  get isNew(): boolean {
    return this._isNew;
  }

  get isDirty(): boolean {
    if (this._isNew) return true;
    if (!this._originalProps) return false;

    // Enhanced dirty checking with deep comparison
    return this.hasPropertyChanges(this._props, this._originalProps);
  }

  private hasPropertyChanges(current: TProps, original: TProps): boolean {
    // Implement deep comparison logic for nested objects
    // Handle array changes, null/undefined differences
  }

  async touch(): Promise<void> {
    this._metadata.lastUpdated = new Date();
    await storage.put(this._props, this._metadata);
  }

  // Lifecycle hooks
  protected beforeSave(): Promise<void> | void {}
  protected afterSave(): Promise<void> | void {}
  protected beforeLoad(): Promise<void> | void {}
}
```

#### 1.3 Integration with Save/Load Cycle

```typescript
// Enhanced save method with full lifecycle
async save(): Promise<this> {
  await this.beforeSave();
  
  this._metadata.lastUpdated = new Date();
  logger.debug(`Saving ${this}`, this.props, this.metadata);
  
  await storage.put(this.props, this.metadata);
  
  this._isNew = false;
  this._originalProps = { ...this._props };
  this._savedProps = { ...this._props };
  
  await this.afterSave();
  return this;
}

async load(): Promise<this> {
  await this.beforeLoad();
  
  const item = await storage.get(this.cv.orgBfOid, this.metadata.bfGid);
  if (!item) {
    throw new BfErrorNodeNotFound();
  }
  
  this._props = item.props as TProps;
  this._originalProps = { ...this._props };
  this._savedProps = { ...this._props };
  this._metadata = item.metadata;
  this._isNew = false;
  
  return this;
}
```

### Step 2: Smart Deletion System

#### 2.1 Test-First: Edge Cleanup Scenarios

```typescript
// Location: apps/bfDb/nodeTypes/__tests__/BfEdge.deletion.test.ts

describe("Smart Deletion and Edge Cleanup", () => {
  test("deleteEdgesTouchingNode removes all connected edges", async () => {
    // Create node with multiple incoming/outgoing edges
    // Delete edges touching the node
    // Verify all edges are removed
  });

  test("delete() automatically cleans up node edges", async () => {
    // Create node with edges
    // Call node.delete()
    // Verify edges are automatically removed
  });

  test("deleteAndCheckForNetworkDelete handles orphan cleanup", async () => {
    // Create chain: A -> B -> C
    // Delete edge A -> B
    // Verify B and C are cleaned up if they become orphans
  });

  test("orphan detection respects multiple parents", async () => {
    // Create diamond pattern: A -> B, A -> C, B -> D, C -> D
    // Delete edge B -> D
    // Verify D is NOT deleted (still has parent C)
  });

  test("cascade deletion with complex networks", async () => {
    // Create complex network with cycles
    // Test deletion doesn't infinite loop
    // Test proper cleanup order
  });
});
```

#### 2.2 Implementation: Smart Edge Deletion

```typescript
// Location: apps/bfDb/nodeTypes/BfEdge.ts

export class BfEdge<TProps extends BfEdgeBaseProps = BfEdgeBaseProps> {
  static async deleteEdgesTouchingNode(
    cv: CurrentViewer,
    bfGid: BfGid,
  ): Promise<void> {
    logger.debug(`Deleting all edges touching node: ${bfGid}`);

    // Find all edges where node is source or target
    const sourceEdges = await this.query(cv, { bfSid: bfGid }, {}, []);
    const targetEdges = await this.query(cv, { bfTid: bfGid }, {}, []);

    // Delete all connected edges
    const allEdges = [...sourceEdges, ...targetEdges];
    await Promise.all(
      allEdges.map((edge) =>
        storage.deleteItem(cv.orgBfOid, edge.metadata.bfGid)
      ),
    );

    logger.debug(`Deleted ${allEdges.length} edges touching node ${bfGid}`);
  }

  static async deleteAndCheckForNetworkDelete(
    cv: CurrentViewer,
    edge: BfEdge,
  ): Promise<void> {
    const edgeMetadata = edge.metadata as BfEdgeMetadata;
    const targetId = edgeMetadata.bfTid;

    // Delete the edge first
    await storage.deleteItem(cv.orgBfOid, edge.metadata.bfGid);

    // Check if target node is now orphaned
    const remainingIncomingEdges = await this.query(
      cv,
      { bfTid: targetId },
      {},
      [],
    );

    if (remainingIncomingEdges.length === 0) {
      logger.debug(`Node ${targetId} is now orphaned, considering for cleanup`);

      // Check if this node has any outgoing edges to other nodes
      const outgoingEdges = await this.query(
        cv,
        { bfSid: targetId },
        {},
        [],
      );

      if (outgoingEdges.length > 0) {
        // Recursively check downstream nodes for orphaning
        await Promise.all(
          outgoingEdges.map((outgoingEdge) =>
            this.deleteAndCheckForNetworkDelete(cv, outgoingEdge)
          ),
        );
      }

      // Delete the orphaned node
      await storage.deleteItem(cv.orgBfOid, targetId);
      logger.debug(`Deleted orphaned node: ${targetId}`);
    }
  }
}
```

#### 2.3 Enhanced Node Deletion

```typescript
// Location: apps/bfDb/classes/BfNode.ts

async delete(): Promise<boolean> {
  logger.debug(`Deleting node: ${this.metadata.bfGid}`);
  
  try {
    // Import BfEdge dynamically to avoid circular dependency
    const { BfEdge } = await import("@bfmono/apps/bfDb/nodeTypes/BfEdge.ts");
    
    // Clean up all edges touching this node
    await BfEdge.deleteEdgesTouchingNode(this.cv, this.metadata.bfGid);
    
    // Delete the node itself
    await storage.deleteItem(this.cv.orgBfOid, this.metadata.bfGid);
    
    logger.debug(`Successfully deleted node: ${this.metadata.bfGid}`);
    return true;
  } catch (error) {
    logger.error(`Failed to delete node ${this.metadata.bfGid}:`, error);
    return false;
  }
}
```

### Step 3: Transaction Integration

#### 3.1 Test-First: Atomic Operations

```typescript
// Location: apps/bfDb/classes/__tests__/BfNode.transaction.test.ts

describe("Transaction Management", () => {
  test("save operations are atomic", async () => {
    // Start transaction
    // Modify multiple related nodes
    // Force error in one save
    // Verify all changes are rolled back
  });

  test("delete operations with edge cleanup are atomic", async () => {
    // Create complex node network
    // Delete node with many edges
    // Force error during edge cleanup
    // Verify partial state is rolled back
  });

  test("lifecycle hooks can participate in transactions", async () => {
    // beforeSave hook modifies related nodes
    // Ensure all changes are in same transaction
  });
});
```

#### 3.2 Implementation: Transaction-Aware Operations

```typescript
// Location: apps/bfDb/classes/BfNode.ts

async save(): Promise<this> {
  return await this.withTransaction(async () => {
    await this.beforeSave();
    
    this._metadata.lastUpdated = new Date();
    logger.debug(`Saving ${this}`, this.props, this.metadata);
    
    await storage.put(this.props, this.metadata);
    
    this._isNew = false;
    this._originalProps = { ...this._props };
    this._savedProps = { ...this._props };
    
    await this.afterSave();
    return this;
  });
}

async delete(): Promise<boolean> {
  return await this.withTransaction(async () => {
    const { BfEdge } = await import("@bfmono/apps/bfDb/nodeTypes/BfEdge.ts");
    
    // Clean up all edges touching this node
    await BfEdge.deleteEdgesTouchingNode(this.cv, this.metadata.bfGid);
    
    // Delete the node itself
    await storage.deleteItem(this.cv.orgBfOid, this.metadata.bfGid);
    
    return true;
  });
}

private async withTransaction<T>(operation: () => Promise<T>): Promise<T> {
  // If backend supports transactions, use them
  // Otherwise, rely on individual operation atomicity
  const backend = await getBackend();
  if ('beginTransaction' in backend) {
    await backend.beginTransaction();
    try {
      const result = await operation();
      await backend.commitTransaction();
      return result;
    } catch (error) {
      await backend.rollbackTransaction();
      throw error;
    }
  } else {
    return await operation();
  }
}
```

### Step 4: Complex Test Scenarios

#### 4.1 Graph Network Test Data

```typescript
// Location: apps/bfDb/classes/__tests__/testData/complexGraphs.ts

export class GraphTestDataBuilder {
  /**
   * Creates diamond pattern: A -> B, A -> C, B -> D, C -> D
   */
  static async createDiamondPattern(cv: CurrentViewer) {
    // Implementation for diamond relationship testing
  }

  /**
   * Creates chain pattern: A -> B -> C -> D
   */
  static async createChainPattern(cv: CurrentViewer) {
    // Implementation for linear relationship testing
  }

  /**
   * Creates cycle pattern: A -> B -> C -> A
   */
  static async createCyclePattern(cv: CurrentViewer) {
    // Implementation for circular relationship testing
  }

  /**
   * Creates complex network with multiple patterns
   */
  static async createComplexNetwork(cv: CurrentViewer) {
    // Implementation for stress testing deletion logic
  }
}
```

#### 4.2 Integration Tests

```typescript
// Location: apps/bfDb/classes/__tests__/BfNode.integration.test.ts

describe("Phase 4 Integration Tests", () => {
  test("complete lifecycle with smart deletion", async () => {
    // Create complex network
    // Modify nodes (test lifecycle hooks)
    // Delete nodes (test smart deletion)
    // Verify final state consistency
  });

  test("performance with large networks", async () => {
    // Create network with 1000+ nodes and edges
    // Test deletion performance
    // Verify memory usage stays reasonable
  });

  test("concurrent deletion handling", async () => {
    // Simulate concurrent delete operations
    // Verify no race conditions or orphaned data
  });
});
```

## Implementation Timeline

### Week 1: Foundation and Lifecycle Hooks

- **Day 1-2**: Implement enhanced state management (isNew, isDirty, touch)
- **Day 3-4**: Complete lifecycle hooks (beforeSave, afterSave, beforeLoad)
- **Day 5**: Integration testing with existing save/load cycle

### Week 2: Smart Deletion System

- **Day 1-2**: Implement deleteEdgesTouchingNode and basic edge cleanup
- **Day 3-4**: Implement deleteAndCheckForNetworkDelete with orphan detection
- **Day 5**: Integration with enhanced delete() method

### Week 3: Transaction Integration and Testing

- **Day 1-2**: Implement transaction-aware operations
- **Day 3-4**: Complex test scenarios and performance testing
- **Day 5**: Documentation and integration with existing codebase

## Success Criteria

### Functional Requirements

- ✅ Complete lifecycle hook system matches old implementation
- ✅ Smart deletion prevents orphaned edges and nodes
- ✅ Transaction integration ensures atomic operations
- ✅ Performance comparable to previous implementation

### Technical Requirements

- ✅ All new code has 100% test coverage
- ✅ Integration tests verify complex scenarios
- ✅ No breaking changes to existing APIs
- ✅ Memory usage stays within acceptable bounds

### Quality Requirements

- ✅ Code follows TDD practices
- ✅ Documentation covers all new APIs
- ✅ Error handling provides useful context
- ✅ Logging helps with debugging

## Risk Mitigation

### Performance Risks

- **Risk**: Cascading deletions could cause performance issues
- **Mitigation**: Implement depth limits and batch operations

### Data Consistency Risks

- **Risk**: Partial failures during complex operations
- **Mitigation**: Transaction integration and comprehensive rollback

### Integration Risks

- **Risk**: Breaking existing functionality
- **Mitigation**: Comprehensive regression testing

## Files to Create/Modify

### New Test Files

- `apps/bfDb/classes/__tests__/BfNode.lifecycle.test.ts`
- `apps/bfDb/nodeTypes/__tests__/BfEdge.deletion.test.ts`
- `apps/bfDb/classes/__tests__/BfNode.transaction.test.ts`
- `apps/bfDb/classes/__tests__/BfNode.integration.test.ts`
- `apps/bfDb/classes/__tests__/testData/complexGraphs.ts`

### Modified Core Files

- `apps/bfDb/classes/BfNode.ts` - Enhanced lifecycle and deletion
- `apps/bfDb/nodeTypes/BfEdge.ts` - Smart deletion methods
- `apps/bfDb/storage/storage.ts` - Transaction support (if needed)

### Documentation Updates

- `apps/bfDb/memos/guides/lifecycle-management.md`
- `apps/bfDb/memos/guides/smart-deletion.md`
- Update existing API documentation

## Next Steps

After completing Phase 4:

1. **Integration Testing**: Verify all phases work together
2. **Performance Benchmarking**: Compare with old implementation
3. **Production Readiness**: Security audit and deployment preparation
4. **Documentation**: Complete user guides and API references

This plan completes the final phase of BfDb feature parity, providing a robust,
production-ready graph database system with intelligent lifecycle management and
deletion patterns.
