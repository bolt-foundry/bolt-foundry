# SQLite Backend Migration Fix: Comprehensive Implementation Plan

## 1. Executive Summary

Content Foundry's database layer is experiencing test failures after migrating from PostgreSQL to SQLite. All failures show the same error: `TypeError: Do not know how to serialize a BigInt`. This occurs because SQLite returns numeric columns as BigInt values, which JavaScript's native `JSON.stringify()` can't serialize.

This implementation plan combines the best elements from multiple approaches to provide a robust solution that:
- Adds a custom JSON serializer to safely handle BigInt values
- Implements a consistent type normalization layer across database backends
- Ensures proper numeric precision handling for large values
- Provides comprehensive testing for cross-backend compatibility

The changes will be implemented in phases with minimal impact on the existing codebase while ensuring consistent behavior regardless of the database backend used.

## 2. Problem Analysis

### 2.1 Error Pattern

All test failures present with the same error:
```
TypeError: Do not know how to serialize a BigInt
    at JSON.stringify (<anonymous>)
    at bfQueryItemsUnified (file:///home/runner/workspace/packages/bfDb/bfDb.ts:267:38)
```

### 2.2 Root Cause Analysis

1. **Type Mismatch Between Backends**: 
   - PostgreSQL returns large numeric values as JavaScript numbers
   - SQLite returns the same values as BigInt
   - The codebase expects consistent number types regardless of backend

2. **Serialization Issue**: 
   - `JSON.stringify()` cannot natively handle BigInt values
   - Many database operations use `JSON.stringify()` for logging
   - The type mismatch causes serialization failures

3. **Key Affected Components**:
   - `packages/bfDb/bfDb.ts`: Core query functions 
   - `packages/bfDb/coreModels/BfNode.ts`: Node query functionality
   - `packages/bfDb/coreModels/BfEdge.ts`: Edge query functionality
   - Related database backends

## 3. Solution Strategy

Our solution combines the most effective elements from multiple approaches:

### 3.1 Custom JSON Serializer

Create a dedicated utility function that handles BigInt values intelligently:
- Convert BigInt values to regular numbers if within JavaScript's safe integer range
- Convert to strings for values beyond the safe range to maintain precision
- Handle nested objects containing BigInt values

### 3.2 Type Normalization Layer

Implement a consistent type handling layer to ensure compatibility between backends:
- Add a row processor in the SQLite backend to normalize types
- Ensure consistent return types for all database operations
- Preserve numeric precision for very large values

### 3.3 Error Handling

Add robust error handling to prevent serialization failures:
- Wrap critical serialization operations in try/catch blocks
- Provide safe fallbacks when encountering unexpected types
- Add detailed logging for troubleshooting type issues

## 4. Implementation Plan

### 4.1 Phase 1: Core Utilities (2 hours)

1. **Create Custom JSON Serializer**
   - Add `safeBfJsonStringify()` function that handles BigInt values
   - Implement intelligent value conversion based on numeric range
   - Add unit tests for the serializer

2. **Add Value Normalization Utility**
   - Create `normalizeSortValue()` helper function 
   - Handle type conversion logic for all numeric ranges
   - Add unit tests for normalization logic

### 4.2 Phase 2: SQLite Backend Updates (4 hours)

1. **Update Row Processing**
   - Add `processRow()` method to DatabaseBackendSqlite class
   - Apply type normalization to metadata fields
   - Handle props parsing with BigInt awareness

2. **Enhance Backend Methods**
   - Update all query methods to use the row processor
   - Ensure consistent field types across all operations
   - Add error handling for type conversion edge cases

### 4.3 Phase 3: Core Database Updates (3 hours)

1. **Update Core Functions**
   - Modify `bfQueryItemsUnified` to use safe serialization
   - Update `bfQueryItems` and related functions
   - Ensure all log statements use `safeBfJsonStringify`

2. **Update Node and Edge Classes**
   - Fix serialization in BfNode methods
   - Update BfEdge query methods for consistent type handling
   - Add type checking where needed

### 4.4 Phase 4: Testing and Validation (3 hours)

1. **Add Targeted Tests**
   - Test BigInt serialization specifically
   - Add cross-backend compatibility tests
   - Test boundary conditions for numeric values

2. **Update Test Utilities**
   - Add `compareDbItems` helper for test assertions
   - Ensure test expectations match actual data types

## 5. Specific Code Implementations

### 5.1 Safe JSON Serializer

```typescript
/**
 * Custom JSON serializer that safely handles BigInt values.
 */
export function safeBfJsonStringify(
  value: unknown, 
  replacer?: (key: string, value: any) => any,
  space?: string | number
): string {
  return JSON.stringify(value, (key, val) => {
    // Handle BigInt values by checking if they're within safe integer range
    if (typeof val === 'bigint') {
      // For BigInts within safe integer range, convert to number
      if (val <= BigInt(Number.MAX_SAFE_INTEGER) && val >= BigInt(Number.MIN_SAFE_INTEGER)) {
        return Number(val);
      } else {
        // For larger BigInts, convert to string to preserve precision
        return val.toString();
      }
    }
    // Use custom replacer if provided
    return replacer ? replacer(key, val) : val;
  }, space);
}
```

### 5.2 Type Normalization Helper

```typescript
/**
 * Normalizes numeric values that might be BigInt.
 * Returns a number if within safe range, or a string if larger.
 */
function normalizeSortValue(val: number | bigint): number | string {
  if (typeof val === 'bigint') {
    return (val > Number.MAX_SAFE_INTEGER || val < Number.MIN_SAFE_INTEGER)
      ? val.toString()
      : Number(val);
  }
  return val;
}
```

### 5.3 Row Processing in SQLite Backend

```typescript
/**
 * Process a database row, normalizing any BigInt values.
 * This ensures consistent type handling across different backends.
 */
private processRow(row: Row): DbItem {
  const props = typeof row.props === 'string' 
    ? JSON.parse(row.props) 
    : row.props;

  // Convert numeric fields that might be BigInt
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
    // Normalize sort_value using our helper function
    sortValue: normalizeSortValue(row.sort_value),
  };

  return { metadata, props };
}
```

### 5.4 Updated Query Method

```typescript
/**
 * Update to bfQueryItemsUnified to use safe JSON serialization.
 */
export async function bfQueryItemsUnified<TProps extends Props>(
  query: Query,
  options: QueryOptions = {},
): Promise<DbItem<TProps>[]> {
  try {
    const backend = await getBackend();
    const results = await backend.queryItems<TProps>(query, options);

    // Use safe logging that handles BigInt values
    logger.debug(`Query results: ${safeBfJsonStringify(results)}`);

    return results;
  } catch (e) {
    logger.error(`Error in bfQueryItemsUnified: ${e}`);
    throw e;
  }
}
```

### 5.5 Test Helper

```typescript
/**
 * Helper for comparing database items with possibly different numeric types
 */
export function compareDbItems<T extends Props>(
  item1: DbItem<T>, 
  item2: DbItem<T>
): boolean {
  // Compare metadata with type normalization
  const metadataMatch = Object.entries(item1.metadata).every(([key, value]) => {
    const otherValue = item2.metadata[key as keyof typeof item2.metadata];

    // Handle BigInt comparison by converting to string
    if (typeof value === 'bigint' || typeof otherValue === 'bigint') {
      return String(value) === String(otherValue);
    }

    return value === otherValue;
  });

  // Compare props with type normalization
  const propsMatch = safeBfJsonStringify(item1.props) === safeBfJsonStringify(item2.props);

  return metadataMatch && propsMatch;
}
```

## 6. Testing Strategy

### 6.1 Unit Tests

1. **BigInt Serialization Tests**
   - Test safe serialization of different numeric ranges
   - Verify handling of nested objects with BigInt values
   - Test with custom replacer functions

2. **Type Normalization Tests**
   - Test conversion of values at numeric boundaries
   - Verify string representation maintains precision

### 6.2 Integration Tests

1. **Cross-Backend Tests**
   - Run identical operations on both SQLite and PostgreSQL
   - Verify consistent results across backends
   - Test large numeric values specifically

2. **Edge Case Tests**
   - Test values exceeding JavaScript's safe integer range
   - Verify query results with different sort values
   - Test complex objects with BigInt at various depths

### 6.3 Example Test

```typescript
Deno.test("SQLite backend handles large numbers correctly", async () => {
  // Skip test if not using SQLite backend
  if (getConfigurationVariable("FORCE_DB_BACKEND") !== "sqlite") {
    return;
  }

  // Create a test item with a numeric value at the boundary of safe integers
  const testProps = { name: "Big Number Test" };
  const testMetadata = {
    bfGid: toBfGid("test-big-number"),
    bfOid: toBfGid("test-org"),
    className: "TestBigNumber",
    sortValue: Number.MAX_SAFE_INTEGER + 10, // Intentionally beyond safe range
    createdAt: new Date(),
    lastUpdated: new Date()
  };

  await bfPutItem(testProps, testMetadata);

  // Retrieve the item and verify the type
  const item = await bfGetItem(testMetadata.bfOid, testMetadata.bfGid);
  assertEquals(typeof item.metadata.sortValue, "string", 
    "Very large numbers should be returned as strings");

  // Clean up after test
  await bfDeleteItem(testMetadata.bfOid, testMetadata.bfGid);
});
```

## 7. Risks and Mitigations

### 7.1 Numeric Precision Issues

**Risk**: Converting between BigInt and Number could lose precision  
**Mitigation**: Values outside safe integer range are stored as strings to maintain precision

### 7.2 Performance Impact

**Risk**: Additional type checking adds overhead  
**Mitigation**: Optimize type conversions to minimal necessary operations

### 7.3 Breaking API Changes

**Risk**: Type changes could break client code expectations  
**Mitigation**: Ensure consistent behavior and add clear documentation

### 7.4 Test Coverage Gaps

**Risk**: Some edge cases might be missed  
**Mitigation**: Comprehensive test scenarios across numeric ranges

## 8. Timeline and Resources

### 8.1 Estimated Timeline

- **Phase 1 (Core Utilities)**: 2 hours
- **Phase 2 (SQLite Backend)**: 4 hours
- **Phase 3 (Core Database)**: 3 hours
- **Phase 4 (Testing)**: 3 hours
- **Total**: 12 hours of focused work

### 8.2 Required Resources

- **Development**: 1-2 days of engineer time
- **Testing**: Test environments with both SQLite and PostgreSQL backends
- **Code Review**: At least one engineer familiar with database layer

## 9. Conclusion

This comprehensive approach addresses the BigInt serialization issues by implementing a consistent type normalization layer and safe serialization utilities. The solution maintains backward compatibility while ensuring consistent behavior across database backends.

The implementation will proceed in phases, beginning with core utilities and gradually extending to all affected components. By the end of this implementation, the database layer will work seamlessly with both SQLite and PostgreSQL, properly handling numeric values of any magnitude.