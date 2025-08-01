# Relationship Methods for One-to-One Relations

## Problem

Currently, when working with bfDb relationships, developers need to manually
write boilerplate code for common operations like finding, creating, and
deleting related nodes. This leads to repetitive code and inconsistent patterns
across the codebase.

## Proposed Solution

Automatically generate relationship methods on bfDb nodes specifically for
one-to-one relationships. When a relationship is defined using `.one()`, the
system would generate three methods:

- `find{RelationName}()` - Find the related node
- `create{RelationName}(props)` - Create and link a new related node
- `delete{RelationName}(options?)` - Remove the relationship

## Example Usage

```typescript
// Define a node with a relationship
class BfBook extends BfNode {
  static bfNodeSpec = this.defineBfNode((f) =>
    f.string("title")
      .one("author", () => BfAuthor)
  );
}

// Proposed: automatically generated methods
const book = await BfBook.findX(cv, bookId);
const author = await book.findAuthor();
const newAuthor = await book.createAuthor({ name: "New Author" });
await book.deleteAuthor();
```

## Design Decision: Basic Relationships Only

### What We Support

This feature intentionally supports only basic, simple relationships without
roles or edge properties.

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

## Implementation Options for Type Safety

### Option 1: Codegen Approach

Generate TypeScript interfaces/mixins at build time:

```typescript
// Generated file: BfBook.relationships.ts
interface BfBookRelationships {
  findAuthor(): Promise<BfAuthor | null>;
  createAuthor(props: BfAuthorProps): Promise<BfAuthor>;
  deleteAuthor(options?: { deleteNode?: boolean }): Promise<void>;
}
```

- **Pros**: Full type safety, autocomplete, compile-time checking
- **Cons**: Requires build step, managing generated files, watching for changes

### Option 2: TypeScript Module Augmentation

Use declaration merging to add types:

```typescript
declare module "./BfBook" {
  interface BfBook {
    findAuthor(): Promise<BfAuthor | null>;
    // ... other methods
  }
}
```

- **Pros**: Type safety without changing runtime code
- **Cons**: Still needs generation step, declaration files to manage

### Option 3: Generic Type Mapping (Recommended)

Create a type that maps from spec to methods and apply it automatically:

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

// Generate method signatures for all relationships
type RelationshipMethods<T extends AnyBfNodeCtor> = UnionToIntersection<
  RelationNames<T> extends string ?
      & {
        [K in RelationNames<T> as `find${Capitalize<K>}`]: () => Promise<
          InstanceType<RelationTarget<T, K>> | null
        >;
      }
      & {
        [K in RelationNames<T> as `create${Capitalize<K>}`]: (
          props: InferProps<RelationTarget<T, K>>,
        ) => Promise<InstanceType<RelationTarget<T, K>>>;
      }
      & {
        [K in RelationNames<T> as `delete${Capitalize<K>}`]: (
          options?: { deleteNode?: boolean },
        ) => Promise<void>;
      }
    : never
>;

// Combine with base type - return type for findX, create, etc.
type WithRelationships<T extends BfNode> = T & RelationshipMethods<typeof T>;

// Usage - automatically typed!
const book = await BfBook.findX(cv, id); // Returns WithRelationships<BfBook>
book.findAuthor(); // Promise<BfAuthor | null> - fully typed!
book.createAuthor({ name: "...", bio: "..." }); // Promise<BfAuthor>
book.deleteAuthor(); // Promise<void>
```

- **Pros**:
  - No codegen or build step required
  - Transparent to users - just works
  - Uses TypeScript's existing type system
  - All factory methods (findX, create, query) can return WithRelationships<T>
- **Cons**:
  - Complex type definitions to maintain
  - Need to ensure all node creation paths return the augmented type

### Option 4: Proxy-based Type Provider

Use a typed proxy that provides methods:

```typescript
const book = withRelationships(await BfBook.findX(cv, id));
book.findAuthor(); // Proxy provides typed methods
```

- **Pros**: Clean API, runtime flexibility
- **Cons**: Extra wrapper needed, potential performance overhead

### Recommendation

Implement **Option 3** by modifying BfNode's static methods (findX, create,
query) to return `WithRelationships<T>`. This provides:

- Full type safety and autocomplete
- No build step or generated files
- Transparent API - users get typed methods automatically
- Leverages TypeScript's powerful type system

## Implementation Plan

- Add `generateRelationshipMethods()` function for runtime method creation
- Call it in the BfNode constructor to attach methods to instances
- Type system should use Option 3 (Generic Type Mapping) for full type safety
- Note: Delete functionality may be limited until `BfEdge.delete()` is
  implemented
- Make `createTargetNode` protected to enforce use of generated methods:
  - Initially add as a disabled lint rule to identify call sites
  - Run codemod to update existing usage to use generated methods
  - Enable lint rule and change method visibility to protected

## Files to Modify

- `apps/bfDb/builders/bfDb/relationshipMethods.ts` - New file for core
  implementation
- `apps/bfDb/classes/BfNode.ts` - Add integration in constructor
- `apps/bfDb/builders/bfDb/__tests__/relationshipMethods.test.ts` - Test
  coverage
