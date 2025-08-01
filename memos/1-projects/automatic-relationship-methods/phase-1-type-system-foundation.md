# Phase 1: Type System Foundation

[← Back to README](./README.md) |
[Next Phase →](./phase-2-runtime-implementation.md)

**Goal**: Get the TypeScript types working correctly with full type safety and
autocomplete

**Related sections in README:**

- [Type Safety Implementation](./README.md#type-safety-implementation-generic-type-mapping)
- [For .one() relationships](./README.md#for-one-relationships)

## 1. Create type test file with mock types

Create `apps/bfDb/types/__tests__/relationshipMethods.type.test.ts`

Start by testing the `WithRelationships` type in isolation:

```typescript
// Mock types to test WithRelationships without full BfNode complexity
// These mock types should mirror the actual bfNodeSpec structure
type MockNodeSpec = {
  relations: {
    author: { cardinality: "one"; target: () => MockAuthorNode };
    illustrator: { cardinality: "one"; target: () => MockPersonNode };
  };
};

class MockBookNode {
  static bfNodeSpec: MockNodeSpec;
  id: string;
}

class MockAuthorNode {
  static bfNodeSpec: {};
  id: string;
  name: string;
}

class MockPersonNode {
  static bfNodeSpec: {};
  id: string;
  name: string;
}

Deno.test("WithRelationships type augments node correctly", () => {
  // Test that WithRelationships<MockBookNode> has the expected methods
  // This lets us validate the type logic before integrating with real BfNode

  type BookWithRels = WithRelationships<MockBookNode>;

  // These should type-check once WithRelationships is implemented:
  // const book: BookWithRels;
  // book.findAuthor() // should return Promise<MockAuthorNode | null>
  // book.findXAuthor() // should return Promise<MockAuthorNode>
  // book.createAuthor({ name: "..." }) // should accept author props
  // book.unlinkAuthor() // should return Promise<void>
  // book.deleteAuthor() // should return Promise<void>

  // Same for illustrator relationship
  // book.findIllustrator() // should return Promise<MockPersonNode | null>
});
```

## 2. Create initial type definitions (`apps/bfDb/builders/bfDb/relationshipMethods.ts`)

Note: We're placing type definitions in the builders directory alongside the
runtime implementation, not in a separate types directory.

Focus on getting the basic type mapping working:

```typescript
// Start simple - just extract relationship names and generate method signatures
type RelationshipMethods<T> = {
  // For each relationship in T.bfNodeSpec.relations
  // Generate find{Name}, findX{Name}, create{Name}, unlink{Name}, delete{Name}
  // Instance methods access cv from the node instance itself
};

type WithRelationships<T> = T & RelationshipMethods<T>;
```

## 3. Iteratively refine the types

- Get relationship name extraction working
- Add method generation for each relationship
- Handle the target type resolution
- Test with mock types until it works correctly

## 4. Expand test scenarios with real BfNode types

### Core type tests:

```typescript
Deno.test("Basic single relationship", () => {
  // Node with one .one() relationship should have findAuthor(), findXAuthor(), createAuthor(), unlinkAuthor(), and deleteAuthor() methods
  // findAuthor() should return Promise<BfAuthor | null>
  // findXAuthor() should return Promise<BfAuthor> and throw if not found
  // createAuthor(props) should require BfAuthor properties and return Promise<BfAuthor>
  // unlinkAuthor() removes the edge only
  // deleteAuthor() deletes the node and edge
  // Instance methods use cv from the node instance
});

Deno.test("Multiple relationships on same node", () => {
  // Node with multiple .one() relationships (e.g., author, publisher, editor)
  // Each relationship should generate its own set of methods
  // All methods should be available on the same node instance
});

Deno.test("TypeScript compile-time error scenarios", () => {
  // book.findPublisher() when BfBook has no publisher relationship - should be TS error
  // book.createAuthor({ wrongProp: "value" }) - should be TS error for invalid props
  // Methods on nodes without relationships should not exist
});
```

## 5. Handle edge cases in types

Test edge case scenarios:

```typescript
Deno.test("Node with no relationships", () => {
  // Should not have any generated methods
  // Type system should handle this gracefully without errors
});

Deno.test("Circular relationship references", () => {
  // Node A has .one("nodeB", () => BfNodeB)
  // Node B has .one("nodeA", () => BfNodeA)
  // Type system should not create infinite loops
});

Deno.test("Self-referential relationship", () => {
  // Node with .one("manager", () => BfEmployee)
  // findManager() and findXManager() should both work
  // Type inference should work with same type as source and target
});
```

## 6. Update BfNode type signatures

- Modify return types of `findX`, `create`, `query` to use
  `WithRelationships<T>`
- Integration tests:

```typescript
Deno.test("Integration with BfNode factory methods", () => {
  // Methods available on BfBook.findX() result
  // Methods available on BfBook.create() result
  // Type augmentation shouldn't break existing BfNode functionality
});
```

## Success Criteria

- Mock type tests validate `WithRelationships` works correctly
- Type extraction from `bfNodeSpec` works for relationship names and cardinality
- Method signatures are correctly generated for each relationship
- Return types are properly inferred from target nodes
- Instance methods access cv from the node instance (no cv parameter needed)
- Type definitions are in `apps/bfDb/builders/bfDb/relationshipMethods.ts`
- **Do not proceed to Phase 2 until `WithRelationships` type is fully working**

### Validation before moving on:

```typescript
// This should compile without errors:
type BookWithRels = WithRelationships<MockBookNode>;
declare const book: BookWithRels;
declare const cv: CurrentViewer;

// All these should have correct types (no cv parameter for instance methods):
const a1: Promise<MockAuthorNode | null> = book.findAuthor();
const a2: Promise<MockAuthorNode> = book.findXAuthor();
const a3: Promise<MockAuthorNode> = book.createAuthor({ name: "test" });
const a4: Promise<void> = book.unlinkAuthor();
const a5: Promise<void> = book.deleteAuthor();
```

## Next Steps

1. **Run tests in parallel**:
   ```bash
   bft test apps/bfDb/types/__tests__/relationshipMethods.type.test.ts
   bft lint apps/bfDb/types/
   bft check apps/bfDb/types/
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
     [Phase 2: Runtime Implementation](./phase-2-runtime-implementation.md)
   - Begin implementing the runtime method generation

**Important**: Do not proceed to Phase 2 until:

- All type tests pass
- `WithRelationships` type works correctly with mock types
- PR checks are green
