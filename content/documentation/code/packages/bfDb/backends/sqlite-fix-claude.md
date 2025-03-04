# SQLite Backend Migration Fix Project Plan - Revised

## 1. Executive Summary

The Content Foundry database layer is experiencing test failures after migrating from PostgreSQL to SQLite. All failures consistently show the error `TypeError: Do not know how to serialize a BigInt`, occurring when SQLite returns BigInt values that cannot be properly serialized via JSON.stringify(). This project plan outlines an improved strategy to resolve these issues with minimal risk, focusing on implementing a consistent type normalization layer to ensure compatibility across database backends.

## 2. Problem Analysis

### 2.1 Error Pattern

The test failures consistently show the same error pattern:
```
TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
```

This occurs because:
1. SQLite returns `sort_value` as BigInt for numeric columns
2. These BigInt values are passed to `JSON.stringify()`
3. JavaScript's `JSON.stringify()` cannot natively serialize BigInt values

### 2.2 Affected Components

Based on the test output, the following components are directly affected:

- `packages/bfDb/bfDb.ts`: Core query functions using `JSON.stringify()`
  - `bfQueryItemsUnified`
  - `bfQueryItems`
- `packages/bfDb/coreModels/BfNode.ts`: Node query functionality
  - `queryTargets` method
- `packages/bfDb/coreModels/BfEdge.ts`: Edge query functionality
  - Multiple query methods including `querySourceInstances` and `queryTargetInstances`

### 2.3 Root Cause Analysis

1. **Type Inconsistency Between Backends**: 
   - PostgreSQL returns numeric values as JavaScript numbers
   - SQLite returns larger numeric values as BigInt
   - The codebase expects consistent number types regardless of backend

2. **Serialization Issue**: 
   - The error occurs during debugging log statements that attempt to serialize database results
   - The core issue is not just logging but a fundamental type mismatch

3. **Testing Environment**: 
   - The tests expose the issue because they extensively exercise the query APIs
   - The issue likely affects all operations that handle large integers from SQLite

## 3. Solution Strategy

### 3.1 Custom JSON Serializer

Create a dedicated utility to safely serialize objects that may contain BigInt values:

1. **Implementation Approach**:
   - Create a `safeBfJsonStringify()` function that handles BigInt values
   - Convert BigInt values to numbers or strings based on their magnitude
   - Add graceful fallback for other non-serializable types

2. **Usage Pattern**:
   - Replace all direct calls to `JSON.stringify()` with the safe serializer
   - Focus on critical logging paths in database query methods

### 3.2 Type Normalization Layer

Add a comprehensive type conversion layer to normalize data between database backends:

1. **Row Processing**:
   - Add a `processRow()` method to DatabaseBackendSqlite that normalizes types
   - Ensure all BigInt values are consistently converted to numbers when within safe range
   - Use string representation for extremely large values that exceed safe integer range

2. **Interface Standardization**:
   - Update all methods that return database rows to use consistent normalization
   - Ensure object structure and type consistency across backend implementations

### 3.3 Improved Error Handling

Add robust error handling to prevent serialization failures from crashing the application:

1. **Safe Logging**:
   - Add try/catch blocks around critical logging that involves potentially problematic types
   - Provide fallback representation when complex objects cannot be serialized

2. **Type Checking**:
   - Add explicit type checks before handling numeric values to ensure safe conversion

## 4. Implementation Plan

### 4.1 Phase 1: Safe JSON Serializer (Estimated: 2 hours)

Create a dedicated utility module for safe JSON serialization:

```typescript
// packages/jsonUtils.ts
export function safeBfJsonStringify(
  value: unknown, 
  replacer?: (key: string, value: any) => any,
  space?: string | number
): string {
  return JSON.stringify(value, (key, val) => {
    // Handle BigInt values by converting to number or string
    if (typeof val === 'bigint') {
      // For BigInts within safe integer range, convert to number
      if (val <= BigInt(Number.MAX_SAFE_INTEGER) && val >= BigInt(Number.MIN_SAFE_INTEGER)) {
        return Number(val);
      } else {
        // For larger BigInts, convert to string to preserve value
        return val.toString();
      }
    }
    // Use custom replacer if provided
    return replacer ? replacer(key, val) : val;
  }, space);
}
```

### 4.2 Phase 2: Database Backend Updates (Estimated: 4 hours)

#### 4.2.1 Add Type Normalization to SQLite Backend

```typescript
// packages/bfDb/backend/DatabaseBackendSqlite.ts
private processRow(row: Row): DbItem {
  // Parse props if it's a string
  const props = typeof row.props === 'string' 
    ? JSON.parse(row.props) 
    : row.props;
    
  // Normalize metadata fields, particularly numeric values
  const metadata: BfDbMetadata = {
    bfGid: toBfGid(row.bf_gid),
    bfOid: toBfGid(row.bf_oid),
    className: row.class_name,
    bfSid: row.bf_sid ? toBfGid(row.bf_sid) : null,
    bfTid: row.bf_tid ? toBfGid(row.bf_tid) : null,
    bfCid: row.bf_cid ? toBfGid(row.bf_cid) : null,
    bfTClassName: row.bf_t_class_name || null,
    bfSClassName: row.bf_s_class_name || null,
    createdAt: new Date(row.created_at),
    lastUpdated: new Date(row.last_updated),
    // Convert BigInt to Number for consistent behavior
    sortValue: typeof row.sort_value === 'bigint' 
      ? Number(row.sort_value) 
      : row.sort_value,
  };

  return { metadata, props };
}
```

#### 4.2.2 Update Query Methods

Ensure all methods that interact with the database use the `processRow` method for consistency:

```typescript
// Example: Update getItem method
getItem<TProps extends Props = Props>(
  bfOid: BfGid,
  bfGid: BfGid,
): Promise<DbItem<TProps> | null> {
  try {
    logger.trace("getItem", bfOid, bfGid);
    const db = this.getDb();

    let stmt = this._statements.get("getItem");
    if (!stmt) {
      stmt = db.prepare("SELECT * FROM bfdb WHERE bf_oid = ? AND bf_gid = ?");
      stmt.setReadBigInts(true);
      this._statements.set("getItem", stmt);
    }

    const row = stmt.get(bfOid, bfGid);
    if (!row) {
      return Promise.resolve(null);
    }

    // Use processRow for consistent data normalization
    return Promise.resolve(this.processRow<TProps>(row as Row<TProps>));
  } catch (e) {
    logger.error(e);
    throw e;
  }
}
```

### 4.3 Phase 3: Update Core Database Functions (Estimated: 3 hours)

Update all core database functions in `packages/bfDb/bfDb.ts` to use the safe serializer:

```typescript
// packages/bfDb/bfDb.ts
import { safeBfJsonStringify } from "packages/jsonUtils.ts";

export async function bfQueryItemsUnified
  TProps extends Props = Props,
>(
  metadataToQuery: Partial<BfDbMetadata>,
  propsToQuery: Partial<TProps> = {},
  bfGids?: Array<string>,
  orderDirection: "ASC" | "DESC" = "ASC",
  orderBy: string = "sort_value",
  options: {
    useSizeLimit?: boolean;
    cursorValue?: number | string;
    maxSizeBytes?: number;
    batchSize?: number;
    totalLimit?: number;
    countOnly?: boolean;
  } = {},
): Promise<Array<DbItem<TProps>>> {
  // ... existing code ...
  
  // Use safe JSON stringify for logging
  logger.debug({
    metadataToQuery,
    propsToQuery,
    bfGids,
    orderDirection,
    orderBy,
    useSizeLimit,
    cursorValue,
    maxSizeBytes,
    batchSize,
  });

  // ... existing database query code ...

  if (results.length > 0) {
    // Use safe serializer for logging object with potential BigInt values
    logger.debug(
      `First result metadata: ${safeBfJsonStringify(results[0].metadata)}`,
    );
  }
  
  return results;
}
```

### 4.4 Phase 4: Update Node and Edge Classes (Estimated: 2 hours)

Update the BfNode and BfEdge classes to use the safe serializer:

```typescript
// packages/bfDb/coreModels/BfNode.ts
import { safeBfJsonStringify } from "packages/jsonUtils.ts";

// In queryTargets method
async queryTargets
  TTargetProps extends BfNodeBaseProps,
  TTargetClass extends typeof BfNodeBase<TTargetProps>,
>(): Promise<Array<InstanceType<TTargetClass>>> {
  // ... existing code ...
  
  const edges = await bfQueryItemsUnified(
    metadataQuery,
    propsQuery,
    undefined,
    "ASC",
    "sort_value",
    options,
  );

  // Use safe serializer for logging
  logger.debug(`Found ${edges.length} edges from ${this.metadata.bfGid}`);
  if (edges.length > 0) {
    logger.debug(`First edge: ${safeBfJsonStringify(edges[0])}`);
  }
  
  // ... rest of the method ...
}
```

### 4.5 Phase 5: Testing and Validation (Estimated: 4 hours)

Implement a comprehensive testing strategy:

1. **Targeted Tests**:
   - Create specific tests for BigInt handling
   - Test serialization edge cases with extremely large numbers

2. **Cross-Backend Tests**:
   - Test with both SQLite and PostgreSQL to ensure consistent behavior
   - Verify that the same code produces the same results with different backends

3. **Integration Testing**:
   - Run all existing tests to ensure no regressions

## 5. Specific Implementation Details

### 5.1 BigInt Handling Strategy

For BigInt values, we'll implement a smart conversion strategy:

1. Values within JavaScript's safe integer range (±2^53-1) will be converted to regular numbers
2. Extremely large values will be converted to strings to preserve precision
3. We'll ensure this behavior is consistent across all backend implementations

### 5.2 Test Helper Functions

Add test helpers for comparing database results with different backends:

```typescript
// Test helper for comparing database items
export function compareDbItems<T extends Props>(
  item1: DbItem<T>, 
  item2: DbItem<T>
): boolean {
  // Compare metadata with type normalization
  const metadataMatch = Object.entries(item1.metadata).every(([key, value]) => {
    const otherValue = item2.metadata[key as keyof typeof item2.metadata];
    
    // Handle BigInt comparison
    if (typeof value === 'bigint' || typeof otherValue === 'bigint') {
      return String(value) === String(otherValue);
    }
    
    return value === otherValue;
  });
  
  // Compare props with type normalization
  const propsMatch = JSON.stringify(item1.props) === JSON.stringify(item2.props);
  
  return metadataMatch && propsMatch;
}
```

## 6. Extended Testing Strategy

In addition to the basic testing approach, we'll add more sophisticated verification:

1. **Data Type Verification Tests**:
   ```typescript
   Deno.test("SQLite returns expected data types for numeric fields", async () => {
     // Setup test data with known numeric values
     const testData = { name: "Test", value: 9007199254740991 }; // Max safe integer
     
     // Insert into database
     const result = await bfPutItem(testData, testMetadata);
     
     // Retrieve and verify
     const retrieved = await bfGetItem(testMetadata.bfOid, testMetadata.bfGid);
     
     // Check that the numeric value is properly handled
     assertEquals(typeof retrieved.metadata.sortValue, "number");
     assertEquals(retrieved.metadata.sortValue, testMetadata.sortValue);
   });
   ```

2. **Cross-Backend Comparison Tests**:
   ```typescript
   Deno.test("SQLite and PostgreSQL return compatible data types", async () => {
     // Only run if both backends are available
     if (!hasPostgres || !hasSqlite) return;
     
     // Set up identical test data
     const testData = { name: "Test", value: 42 };
     
     // Force SQLite backend and insert
     Deno.env.set("FORCE_DB_BACKEND", "sqlite");
     await bfPutItem(testData, testMetadata);
     const sqliteResult = await bfGetItem(testMetadata.bfOid, testMetadata.bfGid);
     
     // Force PostgreSQL backend and insert same data
     Deno.env.set("FORCE_DB_BACKEND", "pg");
     await bfPutItem(testData, testMetadata);
     const pgResult = await bfGetItem(testMetadata.bfOid, testMetadata.bfGid);
     
     // Verify results are compatible
     assert(compareDbItems(sqliteResult, pgResult), "Results should be identical");
   });
   ```

## 7. Risk Management and Mitigations

### 7.1 Potential Risks

1. **Loss of Precision**:
   - **Risk**: Converting BigInt to Number could lose precision for extremely large values
   - **Mitigation**: Implement range checking and use string representation for values beyond safe integer range

2. **Performance Impact**:
   - **Risk**: Additional normalization steps might impact query performance
   - **Mitigation**: Optimize type checking operations, only convert when necessary

3. **Subtle Behavioral Changes**:
   - **Risk**: Different type handling might cause subtle behavior differences
   - **Mitigation**: Comprehensive test coverage and explicit type comparisons

### 7.2 Migration Strategy

1. **Phased Rollout**:
   - Roll out the safe serializer first
   - Then implement backend type normalization
   - Finally, update logging and testing utilities

2. **Backward Compatibility**:
   - Ensure all changes maintain the same API structure
   - Document any type normalization behavior for future reference

## 8. Timeline and Resources

### 8.1 Revised Timeline

- **Phase 1 (Safe JSON Serializer)**: 2 hours
- **Phase 2 (Database Backend Updates)**: 4 hours
- **Phase 3 (Core Database Functions)**: 3 hours
- **Phase 4 (Node and Edge Classes)**: 2 hours
- **Phase 5 (Testing and Validation)**: 4 hours
- **Total Estimated Time**: 15 hours

### 8.2 Required Resources

- **Developer Time**: 2 days of focused development
- **Testing Environment**: Local SQLite and PostgreSQL test instances
- **Code Review**: At least one reviewer familiar with the database layer

## 9. Conclusion

The SQLite migration issues are caused by BigInt values that cannot be properly serialized with standard JSON functionality. Our solution implements a comprehensive approach with three key components:

1. A safe JSON serializer to handle BigInt values in logs and serialization
2. A type normalization layer in the SQLite backend to ensure consistent types
3. Updated query methods that properly handle and normalize types

This approach ensures the database layer works consistently regardless of which backend is used, while maintaining type safety and proper serialization behavior throughout the system.