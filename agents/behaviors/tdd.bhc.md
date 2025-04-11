# Test-Driven Development

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

## Purpose

The TDD protocol ensures that we:

1. Design through testing
2. Maintain high code quality
3. Prevent regressions
4. Document expected behavior
5. Support refactoring with confidence

## Testing Approach

### Use Deno's Standard Testing Tools

All tests should use Deno's built-in testing utilities:

```typescript
// Import standard Deno testing tools
import {
  assert,
  assertEquals,
  assertNotEquals,
  assertRejects,
  assertStrictEquals,
  assertThrows,
} from "https://deno.land/std/testing/mod.ts";

// Basic test structure
Deno.test("descriptive test name", () => {
  // Arrange - set up test data and conditions
  const actual = someFunction();

  // Act & Assert in simple tests
  assertEquals(actual, expected);
});

// For async tests
Deno.test("async operations", async () => {
  const result = await asyncFunction();
  assertEquals(result, expectedValue);
});
```

**Do not** use behavior testing frameworks or custom test runners. Stick with
the native Deno.test functionality.

### Test Organization

- Place tests in `__tests__` directories adjacent to the code being tested
- Name test files with a `.test.ts` suffix
- Begin each test file with a "bff test" shebang: `#!/usr/bin/env -S bff test`
- Group related tests using descriptive test names
- Use setup/teardown with `beforeEach`/`afterEach` when appropriate

```typescript
import {
  afterEach,
  beforeEach,
  describe,
  it,
} from "https://deno.land/std/testing/mod.ts";

describe("Component or Function Group", () => {
  let testData;

  beforeEach(() => {
    testData = setupTestData();
  });

  afterEach(() => {
    cleanupTestData();
  });

  it("should perform specific action", () => {
    // Test code here
  });
});
```

## TDD Workflow (Red-Green-Refactor)

Follow this workflow when implementing new features or fixing bugs:

1. **Red:** Write a failing test that defines the expected behavior
   - Tests should be focused and verify one specific aspect
   - Use descriptive test names that explain what's being tested

2. **Green:** Write the minimal implementation to make the test pass
   - Focus on making the test pass, not on perfect implementation
   - Avoid adding functionality not covered by tests

3. **Refactor:** Improve the implementation while keeping tests passing
   - Clean up the code
   - Remove duplication
   - Improve names and structure
   - Run tests after each change to ensure nothing breaks

## Test Types

### Unit Tests

- Test individual functions, methods, and classes in isolation
- Use mocks or stubs for dependencies
- Focus on input/output relationships and edge cases

### Integration Tests

- Right now we don't typically create integration tests. For anything
requiring integration tests, we opt for e2e tests.

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
import { assertEquals } from "@testing/assert";
import { sum } from "../utils.ts";

Deno.test("sum adds two numbers correctly", () => {
  assertEquals(sum(2, 3), 5);
  assertEquals(sum(-1, 1), 0);
  assertEquals(sum(0, 0), 0);
});
```

## Test Review Checklist


Remember: In TDD, failure counts as done. It's better to have a simple working
solution with good tests than a complex perfect solution that's difficult to
verify.

- Test individual functions, methods, or small components
- Mock dependencies to isolate the unit being tested
- Should be fast and deterministic

### E2E Tests

- Test complete workflows from a user perspective
- Typically involve browser automation (using Deno-compatible tools)
- Place in dedicated e2e directories with `.e2e.test.ts` suffix

## Best Practices

1. **Write tests first** - Design through tests before implementation
2. **Keep tests simple** - Each test should verify one specific thing
3. **Use descriptive test names** - Names should explain what's being tested
4. **Maintain test independence** - Tests should not depend on each other
5. **Avoid test logic** - Minimize conditionals and loops in test code
6. **Test edge cases** - Include error conditions and boundary values
7. **Clean up after tests** - Restore the system to its original state

