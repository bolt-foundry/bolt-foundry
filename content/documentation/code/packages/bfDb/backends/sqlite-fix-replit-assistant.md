
# SQLite Backend Migration Fix Project Plan

## 1. Executive Summary

The Content Foundry database layer is experiencing test failures after migrating from PostgreSQL to SQLite. All failures relate to a specific issue where BigInt values cannot be properly serialized via JSON.stringify(). This project plan outlines the investigation, proposed solutions, and implementation steps to resolve these issues while ensuring compatibility across database backends.

## 2. Problem Analysis

### 2.1 Error Pattern

All test failures exhibit the same error:
```
TypeError: Do not know how to serialize a BigInt
```

This error occurs in multiple locations but can be traced back to a common root cause: attempting to use `JSON.stringify()` on objects containing BigInt values. 

### 2.2 Affected Components

The following components are affected:
- `packages/bfDb/bfDb.ts`: Core database functionality
- `packages/bfDb/coreModels/BfNode.ts`: Node querying functionality
- `packages/bfDb/coreModels/BfEdge.ts`: Edge querying functionality
- Related test files

### 2.3 Root Cause Analysis

1. **Data Type Mismatch**: SQLite handles numeric data differently than PostgreSQL.
   - PostgreSQL can represent large integers natively
   - When migrating to SQLite, numeric ID values are being returned as BigInt
   
2. **Serialization Issue**: JavaScript's `JSON.stringify()` cannot natively serialize BigInt values.
   - The database query functions attempt to log or manipulate these values using JSON serialization
   - This fails with the "Do not know how to serialize a BigInt" TypeError

3. **Test Coverage**: The issue is primarily exposed in query-related tests, suggesting other operations may be unaffected.

## 3. Solution Strategy

We'll implement a comprehensive fix with the following approach:

### 3.1 BigInt Handling

1. **Custom JSON Serializer**: Implement a safe JSON serializer that can handle BigInt values by converting them to strings or numbers.
2. **Type Conversion Layer**: Add a conversion layer that normalizes data types when reading from the database.

### 3.2 Database Backend Interface Standardization

1. **Result Normalization**: Update the DatabaseBackendSqlite implementation to normalize return values to match PostgreSQL types.
2. **Interface Consistency**: Ensure consistent return types across all database backends.

### 3.3 Logging Improvements

1. **Safe Logging**: Update logging to handle BigInt values properly.
2. **Structured Data Logging**: Use a safer approach for logging structured data.

## 4. Implementation Plan

### 4.1 Phase 1: Core Utilities (2-3 hours)

1. **Add a custom BigInt-safe JSON serializer**:
   - Create a utility function `safeBfJsonStringify()` that handles BigInt values
   - Add tests for this utility

2. **Update logging utilities**:
   - Modify code in `packages/logger.ts` to use the safe serializer for object logging

### 4.2 Phase 2: Fix Database Backend (4-6 hours)

1. **Normalize DatabaseBackendSqlite return types**:
   - Update `bfQueryItems`, `bfQueryItemsUnified`, and other query methods
   - Add type conversion utilities to handle BigInt values

2. **Add data type normalization**:
   - Create helper functions to normalize database results
   - Implement consistent type handling across backends

3. **Update Row definition in SQLite backend**:
   - Ensure type definitions match actual runtime types
   - Add proper type conversion for metadata fields

### 4.3 Phase 3: Update Node and Edge Models (2-3 hours)

1. **Fix BfNode query methods**:
   - Update `queryTargets` in BfNode to handle BigInt values
   - Fix serialization in log statements

2. **Fix BfEdge query methods**:
   - Update `querySourceInstances`, `queryTargetInstances`, etc.
   - Ensure consistent type handling across query methods

### 4.4 Phase 4: Test & Validation (3-4 hours)

1. **Create targeted tests**:
   - Write specific tests for BigInt handling
   - Verify database operations with different numeric values

2. **Run existing test suite**:
   - Run tests with different backend types
   - Ensure all tests pass with both SQLite and PostgreSQL backends

3. **Update test utilities**:
   - Add test helpers for comparing database results
   - Ensure test expectations match actual data types

## 5. Specific Code Changes

### 5.1 Create a Safe JSON Serializer

```typescript
// In packages/jsonUtils.ts
export function safeBfJsonStringify(
  value: unknown, 
  replacer?: (key: string, value: any) => any,
  space?: string | number
): string {
  return JSON.stringify(value, (key, val) => {
    // Handle BigInt values by converting to string
    if (typeof val === 'bigint') {
      return val.toString();
    }
    // Use custom replacer if provided
    return replacer ? replacer(key, val) : val;
  }, space);
}
```

### 5.2 Update SQLite Backend Row Processing

```typescript
// In packages/bfDb/backend/DatabaseBackendSqlite.ts
private processRow(row: Row): DbItem {
  const props = typeof row.props === 'string' 
    ? JSON.parse(row.props) 
    : row.props;
    
  // Convert numeric fields that might be BigInt
  const metadata: BfDbMetadata = {
    bfGid: row.bf_gid,
    bfOid: row.bf_oid,
    className: row.class_name,
    bfSid: row.bf_sid || null,
    bfTid: row.bf_tid || null,
    bfCid: row.bf_cid || null,
    bfTClassName: row.bf_t_class_name || null,
    bfSClassName: row.bf_s_class_name || null,
    createdAt: row.created_at,
    lastUpdated: row.last_updated,
    sortValue: typeof row.sort_value === 'bigint' 
      ? Number(row.sort_value) 
      : row.sort_value,
  };

  return { metadata, props };
}
```

### 5.3 Update Query Methods

```typescript
// In packages/bfDb/bfDb.ts
export async function bfQueryItemsUnified<TProps extends Props>(
  query: Query,
  options: QueryOptions = {},
): Promise<DbItem<TProps>[]> {
  const backend = await getBackend();
  const results = await backend.queryItems<TProps>(query, options);
  
  // Use safe logging that handles BigInt
  logger.debug(`Query results: ${safeBfJsonStringify(results)}`);
  
  return results;
}
```

## 6. Testing Strategy

### 6.1 New Test Cases

1. **BigInt Serialization Tests**:
   - Test the `safeBfJsonStringify` function with various input types
   - Verify it handles BigInt, nested objects with BigInt, etc.

2. **SQLite-specific Tests**:
   - Test numeric field handling in SQLite
   - Verify type consistency between read and write operations

3. **Cross-backend Compatibility Tests**:
   - Test the same operations on both SQLite and PostgreSQL backends
   - Verify consistent behavior and data types

### 6.2 Test Updates

Update existing tests to handle BigInt values properly:

```typescript
// Example test update
Deno.test("Database backends compatibility test", async () => {
  // ... existing test setup ...
  
  // Verify numeric values are handled consistently
  const item = await bfGetItem(testBfGid);
  
  // Use Number() to normalize BigInt if present
  const sortValue = typeof item.metadata.sortValue === 'bigint' 
    ? Number(item.metadata.sortValue) 
    : item.metadata.sortValue;
    
  assertEquals(sortValue > 0, true);
  
  // ... rest of test ...
});
```

## 7. Risks and Mitigations

### 7.1 Risks

1. **Performance Impact**: Type conversion might impact performance
   - **Mitigation**: Profile before/after and optimize conversion logic

2. **Numeric Precision**: Converting BigInt to Number could lose precision
   - **Mitigation**: Use string representation for values exceeding safe integer range

3. **Database Compatibility**: Different backend behavior could cause inconsistencies
   - **Mitigation**: Comprehensive cross-backend testing and consistent abstraction layer

### 7.2 Backward Compatibility

Ensure that the changes maintain backward compatibility:

1. **API Consistency**: Database API should behave the same before and after changes
2. **Data Integrity**: Existing data should be readable and writable with no loss
3. **Type Safety**: TypeScript interfaces should remain consistent

## 8. Timeline and Resources

### 8.1 Timeline

- **Phase 1 (Core Utilities)**: 2-3 hours
- **Phase 2 (Database Backend Fix)**: 4-6 hours
- **Phase 3 (Model Updates)**: 2-3 hours
- **Phase 4 (Testing)**: 3-4 hours
- **Total Estimated Time**: 11-16 hours

### 8.2 Required Resources

- **Developer Time**: 1-2 days of focused development
- **Testing Environment**: Local SQLite and PostgreSQL test instances
- **Code Review**: At least one reviewer familiar with the database layer

## 9. Conclusion

The SQLite migration issues stem from type handling differences between PostgreSQL and SQLite, specifically around BigInt serialization. By implementing a comprehensive type normalization layer and updating the serialization logic, we can ensure consistent behavior across database backends.

The fixes will be implemented using a phased approach, prioritizing core utility functions followed by database backend adaptations and model updates. Comprehensive testing will ensure the changes resolve the issues without introducing regressions.
