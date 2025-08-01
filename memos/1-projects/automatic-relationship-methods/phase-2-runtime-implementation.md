# Phase 2: Runtime Implementation

[← Previous Phase](./phase-1-type-system-foundation.md) |
[Back to README](./README.md) | [Next Phase →](./phase-3-migration-adoption.md)

**Goal**: Implement the actual method generation once types are solid

**Related sections in README:**

- [Example Usage](./README.md#example-usage)
- [For .one() relationships](./README.md#for-one-relationships)

## 1. Create `apps/bfDb/builders/bfDb/relationshipMethods.ts`

- Implement `generateRelationshipMethods()` function
- Add runtime method generation for `find`, `findX`, `create`, `unlink`, and
  `delete` operations
- Ensure methods match the type signatures exactly

## 2. Integrate with BfNode

- Call `generateRelationshipMethods()` in BfNode constructor
- Ensure runtime behavior matches type expectations
- Handle edge cases (missing relationships, null values)

## 3. Unit tests (`apps/bfDb/builders/bfDb/__tests__/relationshipMethods.test.ts`)

### Runtime behavior tests:

```typescript
Deno.test("Complex property types in target node", () => {
  // Target node has complex required properties (objects, arrays, enums)
  // createRelation() should require all properties with correct types
  // Optional vs required properties should be preserved
});

Deno.test("Relationship name transformations", () => {
  // .one("authorInfo") → findAuthorInfo(), createAuthorInfo()
  // Handle various naming patterns correctly
});
```

## 4. Integration testing

### Advanced integration tests:

```typescript
Deno.test("Type inference through method chaining", () => {
  // const author = await book.findAuthor()
  // author should be typed as BfAuthor | null
  // Further chaining should work if author has relationships
});

Deno.test("Async type propagation", () => {
  // Promise<WithRelationships<BfBook>> should properly unwrap
  // Array methods: books.map(book => book.findAuthor()) should type correctly
});
```

## Implementation Notes

- Methods should be added dynamically in the constructor
- Use proper error handling for `findX` variants (throw NotFound)
- Ensure transaction context (cv) is properly passed through
- Handle null/undefined cases gracefully

## Success Criteria

- All runtime tests pass
- Methods behave exactly as types indicate
- No performance regression
- Error messages are helpful and clear

## Next Steps

1. **Run tests in parallel**:
   ```bash
   bft test apps/bfDb/builders/bfDb/__tests__/relationshipMethods.test.ts
   bft test apps/bfDb/
   bft lint apps/bfDb/builders/bfDb/relationshipMethods.ts
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
   - Proceed to [Phase 3: Migration & Adoption](./phase-3-migration-adoption.md)
   - Begin implementing migration tooling and code updates

**Important**: Do not proceed to Phase 3 until:

- All unit tests pass for relationship method generation
- Integration tests demonstrate proper type inference
- Runtime behavior matches type expectations exactly
- PR checks are green
