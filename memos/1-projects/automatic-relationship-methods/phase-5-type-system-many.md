# Phase 5: Type System for Many Relationships

[← Previous Phase](./phase-4-enforcement-cleanup.md) |
[Back to README](./README.md) |
[Next Phase →](./phase-6-runtime-implementation-many.md)

**Goal**: Extend the type system to handle one-to-many relationships

**Related sections in README:**

- [For .many() relationships](./README.md#for-many-relationships)
- [Key Differences Between .one() and .many()](./README.md#key-differences-between-one-and-many)

## 1. Extend type definitions

- Add `ManyRelationshipMethods<T>` type for `.many()` relationships
- Methods: `findAll{RelationName}()`, `query{RelationName}()`,
  `connectionFor{RelationName}()`, `create{RelationName}()`,
  `add{RelationName}()`, `remove{RelationName}()`, `delete{RelationName}()`
- Return types:
  - `findAll`: arrays/iterators
  - `query`: filtered/sorted array
  - `connectionFor`: GraphQL connection type with edges/nodes/pageInfo
  - `create/add`: single items

## 2. Type test scenarios for `.many()`:

```typescript
Deno.test("Basic many relationship", () => {
  // Node with .many("comment", () => BfComment)
  // Should have findAllComment(), queryComment(), connectionForComment(), createComment(), addComment(), removeComment()
  // findAllComment() returns Promise<BfComment[]> or async iterator
  // queryComment(args) accepts query parameters and returns Promise<BfComment[]>
  // connectionForComment() returns GraphQL connection type
});

Deno.test("Query parameters for many relationships", () => {
  // queryComment({ where: { authorId: "123" }, orderBy: { createdAt: "desc" }, limit: 10 })
  // Accepts parameter object with type-safe filtering
  // where: type-safe filter conditions
  // orderBy: type-safe field and direction
  // limit/offset: pagination support
  // Returns Promise<BfComment[]> with filtered results
});

Deno.test("GraphQL connection for many relationships", () => {
  // connectionForComment({ first: 10, after: "cursor" })
  // Accepts standard GraphQL connection arguments
  // Returns typed connection: { edges: [...], pageInfo: {...}, totalCount }
  // Edge type includes node and cursor
});

Deno.test("Mixed one and many relationships", () => {
  // Node with both .one() and .many() relationships
  // All methods should coexist without conflicts
  // Proper type inference for each relationship type
});
```

## Type Definitions

- Extend existing `RelationshipMethods<T>` to handle `.many()`
- Create proper return types for connections
- Ensure parameter types are properly inferred
- Use consistent findAll{RelationName} pattern

## Success Criteria

- Type safety for all `.many()` methods
- Proper inference of collection types
- GraphQL connection types work correctly
- No conflicts with `.one()` methods

## Next Steps

1. **Run tests in parallel**:
   ```bash
   bft test apps/bfDb/builders/bfDb/__tests__/relationshipTypes.test.ts
   bft test apps/bfDb/
   bft lint apps/bfDb/builders/bfDb/types/
   bft check apps/bfDb/
   ```

2. **Format code**:
   ```bash
   bft format
   ```

3. **Commit changes**:
   ```bash
   bft commit
   ```

4. **Submit PR**:
   ```bash
   sl pr submit
   ```

5. **Monitor PR**:
   - Watch the pull request for CI check results
   - Fix any issues that arise
   - If fixes needed:
     ```bash
     bft amend
     sl pr submit
     ```

6. **Once all checks pass**:
   - Proceed to
     [Phase 6: Runtime Implementation for Many](./phase-6-runtime-implementation-many.md)
   - Begin implementing runtime methods for many relationships

**Important**: Do not proceed to Phase 6 until:

- All type definitions for `.many()` relationships are working
- `ManyRelationshipMethods<T>` types are properly defined
- GraphQL connection types are correctly typed
- Mixed one and many relationships work without conflicts
- PR checks are green
