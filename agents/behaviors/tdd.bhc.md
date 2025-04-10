# Test-Driven Development Protocol

This card defines the protocol for test-driven development (TDD) practices in
the Bolt Foundry codebase. Following these practices helps ensure high-quality,
maintainable code that fulfills requirements.

## The TDD Cycle

All new features and significant code changes should follow this TDD cycle:

1. **Red**: Write a failing test that defines the expected behavior
2. **Green**: Implement the minimum code needed to make the test pass
3. **Refactor**: Improve the implementation while keeping the tests passing

## Test Organization

- Place tests in `__tests__` directories, co-located with the code being tested
- Do not use `tests` directories (use `__tests__` instead)
- Follow this naming pattern: `[filename].test.ts` or `[filename].test.tsx`
- Example: For `packages/logger/logger.ts`, tests should be in
  `packages/logger/__tests__/logger.test.ts`

## Test File Organization

Each test file should be organized as follows:

1. **Setup**: Import dependencies and set up test fixtures
2. **Test Cases**: Grouped by functionality using Deno's `Deno.test` function
3. **Teardown**: Clean up resources as needed

## Testing Tools

- Use Deno's native testing tools for unit and integration tests
- Use assertions from `https://deno.land/std/testing/asserts.ts`
- For UI components, use DOM testing tools

## Test Types

### Unit Tests

- Test individual functions, methods, and classes in isolation
- Use mocks or stubs for dependencies
- Focus on input/output relationships and edge cases

### Integration Tests

- Test interactions between components
- Verify functionality across module boundaries
- May require more complex setup and teardown

### E2E Tests

- Test complete user workflows
- End with `.test.e2e.ts` suffix
- Focus on critical user paths

## Mock Guidelines

- Only mock what is necessary (external services, complex dependencies)
- Keep mocks as simple as possible
- Verify mocks are called with expected arguments

## Example Unit Test

```typescript
// packages/util/__tests__/example.test.ts
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { sum } from "../utils.ts";

Deno.test("sum adds two numbers correctly", () => {
  assertEquals(sum(2, 3), 5);
  assertEquals(sum(-1, 1), 0);
  assertEquals(sum(0, 0), 0);
});
```

## Example Integration Test

```typescript
// apps/bfDb/__tests__/integration.test.ts
import {
  assertEquals,
  assertExists,
} from "https://deno.land/std/testing/asserts.ts";
import { BfDb } from "../bfDb.ts";
import { setupTestDatabase, teardownTestDatabase } from "../testUtils.ts";

let db: BfDb;

Deno.test({
  name: "database integration test",
  setup: async () => {
    db = await setupTestDatabase();
  },
  fn: async () => {
    const result = await db.query("SELECT 1 as value");
    assertExists(result);
    assertEquals(result[0].value, 1);
  },
  teardown: async () => {
    await teardownTestDatabase(db);
  },
});
```

## Test Review Checklist

Before submitting code for review, ensure:

- Tests cover the core functionality
- Edge cases and error conditions are tested
- Tests are readable and well-structured
- All tests pass consistently

Remember: In TDD, failure counts as done. It's better to have a simple working
solution with good tests than a complex perfect solution that's difficult to
verify.
