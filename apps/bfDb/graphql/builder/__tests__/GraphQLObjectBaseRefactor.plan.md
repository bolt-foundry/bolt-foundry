# GraphQLObjectBase Refactor Plan — **BREAKING EDITION**

_(Updated 2025‑04‑23 — mutation helpers dropped by consensus.)_

---

## 1 • Context & Problem

- `Query.ts` needs a `relation.one("me")` field that returns the
  **CurrentViewer** object.
- **CurrentViewer** already defines a `gqlSpec` but is **not** a `BfNodeBase`,
  so it can’t use helper chains today.
- GraphQL‑builder logic is duplicated across multiple classes and tangled with
  persistence concerns.

## 2 • Finalised Goals

1. **Centralise** all GraphQL helper logic in a single base class:
   **`GraphQLObjectBase`**.
2. **Decouple** schema definition from persistence—any class can expose GraphQL
   just by extending `GraphQLObjectBase`.
3. Always expose an **`id()` helper** from the field‑builder even if a subclass
   ultimately resolves it to `undefined/null`.
4. **Remove generic mutation helpers** (`create`, `update`, `delete`). Each
   class must explicitly declare any mutations it supports.
5. Ship the change **immediately**; no shims, no migration path.
6. Unblock `Query.ts → me: CurrentViewer!` and keep future extensions easy.

## 3 • Proposed Class Diagram

```
GraphQLObjectBase            // NEW — owns GraphQL helpers only (in `graphql/` pkg)
│
├── BfNodeBase               // now: persistence + metadata only
│     └── BfNode             // concrete DB‑backed node impls
├── BfEdgeBase               // lightweight edges, non‑DB but shares helpers
├── CurrentViewer            // lightweight auth‑context object
└── QueryRoot                // GraphQL root object
```

### 3.1 `GraphQLObjectBase` responsibilities

- Static `defineGqlNode(cb)` → returns & caches `gqlSpec`.
- Helper builders
  - **Field** helpers: `string`, `int`, `boolean`, `json`, `id` (always
    provided).
  - **Relation** helpers: `one`, `many`.
- _No_ built‑in mutation helpers — subclasses add custom mutation fields via
  `mutation.custom(cb)` or similar API.
- **No** persistence, metadata, or DB coupling.
- Utility guard: `isGraphQLObjectBase(ctor): boolean`.

### 3.2 Changes to existing classes

| Class             | New Base                    | Notes                                       |
| ----------------- | --------------------------- | ------------------------------------------- |
| **BfNodeBase**    | `extends GraphQLObjectBase` | Removes duplicated GraphQL helpers.         |
| **BfEdgeBase**    | `extends GraphQLObjectBase` | Ditto.                                      |
| **CurrentViewer** | `extends GraphQLObjectBase` | Gains relation helpers so `Query.me` works. |
| **Query**         | `extends GraphQLObjectBase` | `me` and other root fields live here.       |

## 4 • Implementation Steps

| # | Task                                                                                                                                | Effort |
| - | ----------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1 | **Create package `graphql/`** and add `GraphQLObjectBase.ts` with all helper code lifted from `BfNodeBase` (minus mutation helpers) | 2 h    |
| 2 | Refactor **BfNodeBase** & **BfEdgeBase** to extend `GraphQLObjectBase`; delete local helper copies                                  | 1 h    |
| 3 | Update **CurrentViewer.ts** to inherit from `GraphQLObjectBase`; define minimal `gqlSpec`                                           | 1 h    |
| 4 | Update **Query.ts** (or equivalent root) to inherit from `GraphQLObjectBase` and add `relation.one("me")`                           | 30 m   |
| 5 | **Schema builder:** instead of scanning subclasses of `BfNodeBase`, include **any** class that satisfies `isGraphQLObjectBase`      | 1 h    |
| 6 | Hard‑remove all legacy shims (`defineGqlNode` re‑export, old mutation helpers, etc.)                                                | 30 m   |
| 7 | Run full test suite, update imports, fix typing errors                                                                              | 3 h    |
| 8 | Update docs & examples to reflect custom‑only mutation model                                                                        | 1 h    |

Total ⏱ **9 h** (unchanged).

## 5 • Decision Log (Resolved Questions)

| Question                                                          | Decision                                                   |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| Should the base expose `id()` even for objects without a real ID? | **Yes** — returns `undefined` when not overridden.         |
| Are generic mutation helpers provided?                            | **No** — only **custom** mutations declared by each class. |
| Naming                                                            | **GraphQLObjectBase** (final).                             |
| File path                                                         | Move to **`graphql/` package**.                            |

---
Ready for the breakage. 🚀
---

## 6 • "Red" Tests to Drive the Refactor

_(These intentionally fail until the new architecture is in place.)_

| Test File                                                                       | What it Should Assert (will fail today)                                                                                                                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`graphql/__tests__/GraphQLObjectBaseBasics.test.ts`**                         | • `class Foo extends GraphQLObjectBase {}` compiles & ends up with a static `gqlSpec` after calling `defineGqlNode`. <br>• Re‑calling `Foo.defineGqlNode` throws or returns the cached spec (no duplicates). |
| **`apps/bfDb/classes/__tests__/BfNodeBase_Inherits_GraphQLObjectBase.test.ts`** | Import `BfNodeBase` and assert `BfNodeBase.prototype` is instance of `GraphQLObjectBase`; also that `BfNodeBase.gqlSpec` still exists.                                                                       |
| **`apps/bfDb/classes/__tests__/CurrentViewer_GraphQL.test.ts`**                 | 1) `relation.one("me")` returns `CurrentViewer` type in generated SDL. <br>2) `CurrentViewer.gqlSpec` includes `id` field (even if resolver returns `null`).                                                 |
| **`graphql/__tests__/NoGenericMutationHelpers.test.ts`**                        | Attempting `mutation.update()` inside `defineGqlNode` should **throw** a clear error advising to create custom mutation.                                                                                     |
| **`schema/__tests__/SchemaBuilderUsesGraphQLObjectBase.test.ts`**               | Given a dummy class `Extra` extending `GraphQLObjectBase` but not `BfNodeBase`, the schema builder should include its SDL. Expect failure because current builder only scans `BfNodeBase` subclasses.        |

### Example Skeleton (first test)

```ts
import { GraphQLObjectBase } from "graphql/GraphQLObjectBase.ts";

class Foo extends GraphQLObjectBase {
  static gqlSpec = this.defineGqlNode((field) => {
    field.string("bar");
  });
}

deno.test("Foo gains gqlSpec", () => {
  if (!("gqlSpec" in Foo)) throw new Error("gqlSpec missing");
});
```

> **Run:** All five tests should **fail red** until we land each implementation
> step above.
