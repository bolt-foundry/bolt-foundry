# BfNode Enum Support Implementation

**Date**: 2025-07-29\
**Status**: Ready to implement

## Problem

Currently using strings for fields that should be enums (like status fields). No
compile-time or runtime validation.

## Solution

Add `.enum()` to the BfNode builder. Simple implementation that stores as
strings but provides type safety.

## Implementation

### Step 1: Update type definitions

```typescript
// apps/bfDb/builders/bfDb/types.ts
export type FieldSpec =
  | { kind: "string" }
  | { kind: "number" }
  | { kind: "json" }
  | { kind: "enum"; values: readonly string[] };
```

### Step 2: Add enum to field builder

```typescript
// apps/bfDb/builders/bfDb/makeFieldBuilder.ts
export type FieldBuilder<F, R> = {
  // ... existing methods

  enum<N extends string, const V extends readonly string[]>(
    name: N,
    values: V,
  ): FieldBuilder<F & { [K in N]: { kind: "enum"; values: V } }, R>;
};

// In makeFieldBuilder function:
const enumField = <N extends string, const V extends readonly string[]>(
  name: N,
  values: V,
) =>
  next({
    ...out,
    fields: { ...out.fields, [name]: { kind: "enum", values } },
  });

return {
  string,
  number,
  json,
  enum: enumField, // Add this
  one: addRel("out", "one"),
  _spec: out,
};
```

### Step 3: Update type inference

```typescript
// apps/bfDb/classes/BfNode.ts
type FieldValue<S> = S extends { kind: "string" } ? string
  : S extends { kind: "number" } ? number
  : S extends { kind: "json" } ? JSONValue
  : S extends { kind: "enum"; values: readonly (infer V)[] } ? V
  : never;
```

### Step 4: Add runtime validation

```typescript
// apps/bfDb/classes/BfNode.ts
// In BfNode class, add to beforeCreate():
const spec = (this.constructor as typeof BfNode).bfNodeSpec;

for (const [fieldName, fieldSpec] of Object.entries(spec.fields)) {
  if (fieldSpec.kind === "enum" && this._props[fieldName] !== undefined) {
    const value = this._props[fieldName];
    if (!fieldSpec.values.includes(value as string)) {
      throw new Error(
        `Invalid enum value "${value}" for field "${fieldName}". ` +
          `Valid values: ${fieldSpec.values.join(", ")}`,
      );
    }
  }
}
```

### Step 5: Usage example

```typescript
// Now you can do:
export class BfJob extends BfNode<InferProps<typeof BfJob>> {
  static override bfNodeSpec = this.defineBfNode((node) =>
    node
      .string("type")
      .json("payload")
      .enum(
        "status",
        ["available", "claimed", "running", "completed", "failed"] as const,
      )
      .number("attempts").default(0)
      .string("error").optional()
  );
}

// TypeScript knows job.props.status is "available" | "claimed" | etc.
// Runtime validation ensures only valid values are saved
```

## What about GraphQL?

Skip it for now. The GraphQL layer can treat enums as strings initially. Add
proper GraphQL enum support later if needed.

## Testing

```typescript
// Simple test
const job = await BfJob.create({
  type: "test",
  payload: {},
  status: "invalid", // TypeScript error AND runtime error
  attempts: 0,
}, viewer);
```

## That's it

~50 lines of code for type-safe enums. Ship it.
