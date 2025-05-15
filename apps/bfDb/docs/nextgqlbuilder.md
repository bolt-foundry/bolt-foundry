# GraphQL Builder Migration Plan

## Overview

We’re replacing the legacy three‑helper GraphQL DSL with a **single‑argument
builder** that mirrors the `bfNodeSpec` field builder. This is a full break from
existing code; everything will migrate to the new API.

```ts
static override gqlSpec = this.defineGqlNode(gql =>
  gql
    // default lookup (props ➜ getter)
    .string("name")
    // scalar with custom resolver + args
    .int("age", {
      args: (a) => a.int("inc"),
      resolve: (root, { inc = 0 }) => root.props.age + inc,
    })
    .boolean("isActive")
    .id("id")
    .object("primaryOrg")
    .connection("teams", {
    additionalArgs: (a) => a.boolean("includeArchived"),
  })
    .mutation("invite", {
    args: (a) => a.string("email")
    // no custom resolver needed – defaults to root.invite()
  })
);
```

---
### Quick-Start Checklist

1. **Remove** legacy builders and run `deno check` – expect node compilation errors.
2. **Convert** one node’s `gqlSpec` to the new fluent builder.
3. **Run tests**; once green, continue mass migration.
---

## Step‑by‑Step Roll‑Out

### 0  Document the DSL (this file)

- Record the fluent API, examples, and design constraints.

### 1  Scaffold the New Builder

**Type aliases** (declare once in `makeGqlBuilder.ts`):

```ts
type ThisNode = InstanceType<typeof CurrentClass>;

type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
};

type RelayConnection<T> = {
  edges: { node: T; cursor: string }[];
  pageInfo: PageInfo;
};

type MaybePromise<T> = T | Promise<T>;

/** Generic placeholder for a mutation's payload */
type NMutationPayload = Record<string, unknown>;
```

**File layout**

- `apps/bfDb/builders/graphql/makeGqlBuilder.ts` – core builder
- `apps/bfDb/graphql/__generated__/graphqlBuilderBarrel.ts` – **barrel
  export**&#x20;

#### Helper signatures

```ts
// Scalar
.string<N extends string>(
  name: N,
  opts?: {
    args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
    resolve?: (
      root: ThisNode,
      args: any,
      ctx: Ctx,
      info: GraphQLResolveInfo
    ) => MaybePromise<string | number | boolean | null>;
  }
): GqlBuilder;
```

_Default scalar resolver order_

1. `root.props[name]` (if present)
2. `root[name]` getter or method (invoked with `args, ctx, info` if a function)

```ts
// Relations
.object<N extends keyof R & string>(name: N): GqlBuilder;

.connection<N extends keyof R & string>(
  name: N,
  opts?: {
    additionalArgs?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
    resolve?: (
      root: ThisNode,
      args: any,
      ctx: Ctx,
      info: GraphQLResolveInfo
    ) => MaybePromise<RelayConnection<any>>;
  }
): GqlBuilder;

// Mutations
// Mutations
.mutation<N extends string>(
  name: N,
  opts?: {
    args?: (ab: ArgsBuilder) => Record<string, GraphQLInputType>;
    /** Optional resolver override. If omitted, defaults to calling root[name](args, ctx, info). */
    resolve?: (
      root: any,
      args: any,
      ctx: Ctx,
      info: GraphQLResolveInfo
    ) => MaybePromise<NMutationPayload>;
  }
): GqlBuilder;
```

### 2  Rewrite `defineGqlNode`

- Accept only `(gql) => …`.
- Delete legacy overloads.

### 3  Purge Old Utilities & Tests 

- Remove `makeGqlFieldBuilder.ts`, `makeGqlRelationBuilder.ts`, and dependent
  tests.
- Repo should compile except for node classes.

### 4  Convert One Example Node

- Pick `BfExamplePerson.ts`.
- Fix type errors until single file compiles.

### 5  Validate Relations

- In `object/connection`, look up `thisNode.bfNodeSpec.relations[name]`.
- Throw at build‑time if missing or wrong cardinality.

### 6  Generate Runtime GraphQL Types

> **How Yoga/Nexus executes node instances**
>
> 1. **Schema creation time** – The builder’s spec is transformed into standard
>    `GraphQLObjectType`s (or Nexus `objectType()` calls). At runtime Yoga is
>    dealing with a normal, static schema.
> 2. **Resolver contract** – Each field’s resolver simply returns what the
>    _next_ resolver expects:
>    - **Scalars** → bare JS values (`string`, `number`, `boolean`) or a Promise
>      thereof.
>    - **Objects/Connections** → we return a rich **`bfDb`**\*\* node
>      instance\*\* (for objects) or a `RelayConnection<T>` (for connections).
>      These become the `root` in the child resolvers.
> 3. **No extra serialization** – GraphQL never attempts to stringify the entire
>    node; it just calls the next resolver for each requested child field.
> 4. **Fallback works with POJOs too** – If a resolver returns a plain JSON
>    object instead of a node, prop‑first lookup still succeeds; only the
>    method/ getter fallback is bypassed.
> 5. **Mutations** – When no custom resolver is supplied, Yoga calls
>    `root[name](args, ctx, info)`; whatever that returns must match the payload
>    type declared in the schema.

- Map `spec.fields` & `spec.rels` to `GraphQLObjectType`.

- **Scalar / Connection / Mutation resolution & arguments**

  - **Scalars** attach `args` builder output directly on the field config.
  - **Objects / Connections** attach `additionalArgs` output (for connections)
    plus the default pagination args, and default resolver returns
    `root.relations[name]` if `opts.resolve` is not supplied.
  - **Mutations** attach `args` output as the mutation's argument map. Defaults
    to calling `root[name](args, ctx, info)` when `resolve` is omitted.

  - **Scalars** (detailed):

    1. If `opts.resolve` provided ⇒ use it.
    2. Else read `root.props[name]` (if present).
    3. Else look for a getter/method `root[name]` and invoke with
       `(args, ctx, info)` if it’s a function.

**Relation helpers** build `object` or `connection` fields automatically with
correct args (default pagination + `additionalArgs`). Support Relay-style
connections.

### 7  Mass‑Convert Remaining Nodes

- Search/replace helpers, update relation calls.
- Compile and fix typos.

### 8  Write Red Tests for the New API

- Snapshot builder output.
- Integration: introspect schema for one node.

### 9  Delete Dead Code & Update Docs

- Rip out any remaining references to the legacy API.
- Update README and internal docs.

---

## Immediate Next Steps

1. **Implement Step 1** — create `makeGqlBuilder.ts` skeleton that compiles.
2. **Push PR** for early review before moving to Steps 2‑3.

Feel free to edit, reorder, or comment inline as we refine the plan.
