# Test-Driven Development Protocol

This behavior card defines the test-driven development (TDD) workflow for the
Bolt Foundry project, with special focus on using Deno's native testing
capabilities.

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

- Test individual functions, methods, or small components
- Mock dependencies to isolate the unit being tested
- Should be fast and deterministic

### Integration Tests

- Test how components work together
- May involve database connections or API calls
- Use the `--allow-net` and other permissions as needed

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

## Example

```typescript
#!/usr/bin/env -S bff test
// __tests__/sanitize.test.ts
import { assertEquals } from "https://deno.land/std/testing/mod.ts";
import { sanitizePayload } from "../utils/sanitize.ts";

Deno.test("sanitizePayload removes API keys from request body", () => {
  const payload = {
    model: "gpt-4",
    messages: [{ role: "user", content: "Hello" }],
    api_key: "sk-1234567890abcdef",
  };

  const sanitized = sanitizePayload(payload);

  assertEquals(sanitized.api_key, "[REDACTED]");
  assertEquals(sanitized.model, "gpt-4");
  assertEquals(sanitized.messages[0].content, "Hello");
});

Deno.test("sanitizePayload handles nested API keys", () => {
  const payload = {
    request: {
      headers: {
        Authorization: "Bearer sk-1234567890abcdef",
      },
    },
  };

  const sanitized = sanitizePayload(payload);

  assertEquals(sanitized.request.headers.Authorization, "Bearer [REDACTED]");
});
```

By following this protocol, we ensure consistent, high-quality testing across
the Bolt Foundry codebase.
