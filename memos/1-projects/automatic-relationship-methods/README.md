# Automatic Relationship Methods for bfDb

## Problem

Currently, when working with bfDb relationships, developers need to manually
write boilerplate code for common operations like finding, creating, and
deleting related nodes. This leads to repetitive code and inconsistent patterns
across the codebase.

## Proposed Solution

Automatically generate relationship methods on bfDb nodes for both one-to-one
and one-to-many relationships.

### For `.one()` relationships:

- `find{RelationName}()` - Find the related node (returns null if not found)
- `findX{RelationName}()` - Find the related node (throws if not found)
- `create{RelationName}(props)` - Create and link a new related node
- `unlink{RelationName}()` - Remove the relationship (edge only)
- `delete{RelationName}()` - Delete the related node and relationship

### For `.many()` relationships:

- `findAll{RelationName}()` - Find all related nodes
- `query{RelationName}(args)` - Query related nodes with filters, ordering, and
  pagination
- `connectionFor{RelationName}(args)` - GraphQL connection with cursor-based
  pagination
- `create{RelationName}(props)` - Create and link a new related node
- `add{RelationName}(node)` - Link an existing node
- `remove{RelationName}(node)` - Remove a node from the relationship (edge only)
- `delete{RelationName}(node)` - Delete the node and remove from relationship

## Example Usage

```typescript
// Define nodes with relationships
class BfBook extends BfNode {
  static bfNodeSpec = this.defineBfNode((f) =>
    f.string("title")
      .one("author", () => BfPerson) // Multiple relationships
      .one("illustrator", () => BfPerson) // to the same type
      .many("review", () => BfReview) // Use singular for relationship name
  );
}

// Automatically generated methods for .one():
const book = await BfBook.findX(cv, bookId);

// Each relationship gets its own set of methods, even for the same target type
const author = await book.findAuthor(); // Returns BfPerson | null
const illustrator = await book.findIllustrator(); // Returns BfPerson | null

const newAuthor = await book.createAuthor({ name: "Jane Smith" });
const newIllustrator = await book.createIllustrator({ name: "John Doe" });

// Remove just the relationship (edge only)
await book.unlinkAuthor();
await book.unlinkIllustrator();

// Delete the node and relationship
await book.deleteAuthor();
await book.deleteIllustrator();

// Automatically generated methods for .many():
const reviews = await book.findAllReview();
const topReviews = await book.queryReview({
  where: { rating: { gte: 4 } },
  orderBy: { createdAt: "desc" },
  limit: 10,
});
const reviewConnection = await book.connectionForReview({
  first: 20,
  after: "cursor123",
  where: { rating: { gte: 4 } },
});
const newReview = await book.createReview({ rating: 5, text: "Great!" });
await book.addReview(existingReview);
await book.removeReview(review); // Just removes from collection
await book.deleteReview(review); // Deletes the review node
```

## Design Decision: Basic Relationships Only

### What We Support

This feature supports basic relationships without roles or edge properties for
both:

- **One-to-one relationships** (`.one()`) - Single related node
- **One-to-many relationships** (`.many()`) - Multiple related nodes

### Why Not Extended Relationships?

While bfDb supports complex edges with roles and properties, we're explicitly
making this an anti-goal because:

1. **Complexity creep**: Supporting roles/edge properties would complicate the
   API and implementation significantly
2. **Unclear patterns**: There's no obvious "right way" to expose these in
   generated methods
3. **Escape hatch exists**: For complex relationships, developers can still use
   the lower-level bfDb APIs directly

### Recommendation

If you need relationships with roles or edge properties, don't use the generated
methods. Instead, use the existing bfDb query and edge creation APIs directly.
This keeps the generated methods simple and predictable for the 80% use case.

## Type Safety Implementation: Generic Type Mapping

We will use a Generic Type Mapping approach for type safety. This provides full
type safety without requiring code generation or build steps.

### Implementation Details

This approach creates a type that maps from spec to methods and applies it
automatically:

```typescript
// Import existing types from bfDb
import type {
  AnyBfNodeCtor,
  InferProps,
} from "@bfmono/apps/bfDb/classes/BfNode.ts";
import type { RelationSpec } from "@bfmono/apps/bfDb/builders/bfDb/types.ts";

// Reuse UnionToIntersection from std library
type UnionToIntersection<T> =
  (T extends unknown ? (args: T) => unknown : never) extends
    (args: infer R) => unknown ? R : never;

// Extract relation names from bfNodeSpec
type RelationNames<T extends AnyBfNodeCtor> = T extends
  { bfNodeSpec: { relations: infer R } } ? keyof R
  : never;

// Get the target type for a specific relation
type RelationTarget<T extends AnyBfNodeCtor, K extends string> = T extends
  { bfNodeSpec: { relations: Record<K, RelationSpec> } }
  ? T["bfNodeSpec"]["relations"][K] extends { target: () => infer Target }
    ? Target extends AnyBfNodeCtor ? Target : never
  : never
  : never;

// Detect relationship cardinality
type RelationCardinality<T extends AnyBfNodeCtor, K extends string> = T extends
  { bfNodeSpec: { relations: Record<K, infer R> } }
  ? R extends { cardinality: infer C } ? C : "one"
  : never;

// Generate method signatures for .one() relationships
type OneRelationshipMethods<T extends AnyBfNodeCtor> = UnionToIntersection<
  RelationNames<T> extends string
    ? RelationCardinality<T, RelationNames<T>> extends "one" ?
        & {
          [K in RelationNames<T> as `find${Capitalize<K>}`]: () => Promise<
            InstanceType<RelationTarget<T, K>> | null
          >;
        }
        & {
          [K in RelationNames<T> as `findX${Capitalize<K>}`]: () => Promise<
            InstanceType<RelationTarget<T, K>>
          >;
        }
        & {
          [K in RelationNames<T> as `create${Capitalize<K>}`]: (
            props: InferProps<RelationTarget<T, K>>,
          ) => Promise<InstanceType<RelationTarget<T, K>>>;
        }
        & {
          [K in RelationNames<T> as `unlink${Capitalize<K>}`]: () => Promise<
            void
          >;
        }
        & {
          [K in RelationNames<T> as `delete${Capitalize<K>}`]: () => Promise<
            void
          >;
        }
    : never
    : never
>;

// Query and connection types for .many() relationships
type QueryArgs<T> = {
  where?: Partial<InferProps<T>>;
  orderBy?: { [K in keyof InferProps<T>]?: "asc" | "desc" };
  limit?: number;
  offset?: number;
};

type ConnectionArgs = {
  first?: number;
  after?: string;
  last?: number;
  before?: string;
  where?: any; // Same as QueryArgs where clause
};

// Generate method signatures for .many() relationships
type ManyRelationshipMethods<T extends AnyBfNodeCtor> = UnionToIntersection<
  RelationNames<T> extends string
    ? RelationCardinality<T, RelationNames<T>> extends "many" ?
        & {
          [K in RelationNames<T> as `findAll${Capitalize<K>}`]: () => Promise<
            Array<InstanceType<RelationTarget<T, K>>>
          >;
        }
        & {
          [K in RelationNames<T> as `query${Capitalize<K>}`]: (
            args: QueryArgs<RelationTarget<T, K>>,
          ) => Promise<Array<InstanceType<RelationTarget<T, K>>>>;
        }
        & {
          [K in RelationNames<T> as `connectionFor${Capitalize<K>}`]: (
            args: ConnectionArgs,
          ) => Promise<Connection<InstanceType<RelationTarget<T, K>>>>;
        }
        & {
          [K in RelationNames<T> as `create${Capitalize<K>}`]: (
            props: InferProps<RelationTarget<T, K>>,
          ) => Promise<InstanceType<RelationTarget<T, K>>>;
        }
        & {
          [K in RelationNames<T> as `add${Capitalize<K>}`]: (
            node: InstanceType<RelationTarget<T, K>>,
          ) => Promise<void>;
        }
        & {
          [K in RelationNames<T> as `remove${Capitalize<K>}`]: (
            node: InstanceType<RelationTarget<T, K>>,
          ) => Promise<void>;
        }
        & {
          [K in RelationNames<T> as `delete${Capitalize<K>}`]: (
            node: InstanceType<RelationTarget<T, K>>,
          ) => Promise<void>;
        }
    : never
    : never
>;

// Combine both relationship types
type RelationshipMethods<T extends AnyBfNodeCtor> =
  & OneRelationshipMethods<T>
  & ManyRelationshipMethods<T>;

// Combine with base type - return type for findX, create, etc.
type WithRelationships<T extends BfNode> = T & RelationshipMethods<typeof T>;

// Usage - automatically typed!
const book = await BfBook.findX(cv, id); // Returns WithRelationships<BfBook>
book.findAuthor(); // Promise<BfAuthor | null> - fully typed!
book.findXAuthor(); // Promise<BfAuthor> - throws if not found
book.createAuthor({ name: "...", bio: "..." }); // Promise<BfAuthor>
book.unlinkAuthor(); // Promise<void> - removes edge only
book.deleteAuthor(); // Promise<void> - deletes node and edge
```

- **Pros**:
  - No codegen or build step required
  - Transparent to users - just works
  - Uses TypeScript's existing type system
  - All factory methods (findX, create, query) can return WithRelationships<T>
- **Cons**:
  - Complex type definitions to maintain
  - Need to ensure all node creation paths return the augmented type

### Benefits of This Approach

By modifying BfNode's static methods (findX, create, query) to return
`WithRelationships<T>`, we get:

- Full type safety and autocomplete
- No build step or generated files
- Transparent API - users get typed methods automatically
- Leverages TypeScript's powerful type system

## Implementation Plan

The implementation is broken down into 8 phases:

### One-to-One Relationships (`.one()`)

1. **[Phase 1: Type System Foundation](./phase-1-type-system-foundation.md)** -
   Build the TypeScript type system
2. **[Phase 2: Runtime Implementation](./phase-2-runtime-implementation.md)** -
   Implement method generation
3. **[Phase 3: Migration & Adoption](./phase-3-migration-adoption.md)** -
   Migrate existing code
4. **[Phase 4: Enforcement & Cleanup](./phase-4-enforcement-cleanup.md)** -
   Ensure consistent usage

### One-to-Many Relationships (`.many()`)

5. **[Phase 5: Type System for Many](./phase-5-type-system-many.md)** - Extend
   types for collections
6. **[Phase 6: Runtime Implementation for Many](./phase-6-runtime-implementation-many.md)** -
   Implement collection methods
7. **[Phase 7: Advanced Many Features](./phase-7-advanced-many-features.md)** -
   Add batch operations and optimizations
8. **[Phase 8: Many Relationship Migration](./phase-8-many-relationship-migration.md)** -
   Migrate existing patterns

### Infrastructure Completion

9. **[Phase 9: Edge Methods Implementation](./phase-9-edge-methods-implementation.md)** -
   Implement missing BfNode edge methods to enable full functionality

## Important Implementation Notes

### Transaction Context (cv) Parameter

The generated instance methods access the `CurrentViewer` from the node instance
itself, so cv is not needed as a parameter. The cv was already provided when the
node was loaded via static methods like `BfBook.findX(cv, id)`.

### Method Naming Convention

All generated methods use singular forms based on the relationship name:

- `findAllReview()` - find all reviews
- `queryReview()` - query reviews with filters
- `connectionForReview()` - get GraphQL connection for reviews
- `createReview()` - creates one review
- `addReview()` - adds one existing review
- `removeReview()` - removes one review
- `deleteReview()` - deletes one review

### Advanced Features (Phase 7+)

The following features will be added in Phase 7:

- **Batch operations**: `addManyReview([reviews])`,
  `removeManyReview([reviews])`
- **Async iteration**: `iterateReview()` for memory-efficient processing
- **Performance optimizations**: Caching, query batching, and connection pooling

### Error Handling

- `findX{RelationName}()` methods throw `NotFoundError` if the relationship
  doesn't exist
- All methods properly propagate database errors
- Transaction rollback is handled automatically on errors

## Key Differences Between `.one()` and `.many()`

- **Method names**: `findAll{RelationName}` vs `find{RelationName}`
- **Return types**: Arrays/iterators vs single items
- **Additional methods**:
  - `query{RelationName}()` for advanced filtering and sorting
  - `connectionFor{RelationName}()` for GraphQL-compatible connections
  - `add{RelationName}()` for linking existing nodes
- **Query parameters**: Object-based API matching GraphQL patterns
- **GraphQL integration**: Connection-based pagination with cursors
- **Pagination**: Built-in support for large collections
- **Filtering**: Type-safe query parameters through parameter objects

## Files to Modify

- `apps/bfDb/builders/bfDb/relationshipMethods.ts` - New file for core
  implementation of both `.one()` and `.many()` methods
- `apps/bfDb/types/relationshipMethods.ts` - Type definitions for relationship
  methods
- `apps/bfDb/classes/BfNode.ts` - Add integration in constructor
- `apps/bfDb/builders/bfDb/__tests__/relationshipMethods.test.ts` - Test
  coverage
- `apps/bfDb/types/__tests__/relationshipMethods.type.test.ts` - Type tests
