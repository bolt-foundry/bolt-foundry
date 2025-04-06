# UI Component Testing Project Plan


## Project Purpose

To implement a comprehensive UI component testing strategy that aligns with Bolt
Foundry's Test-Driven Development principles and "Worse is Better" philosophy,
focusing on practical solutions using Deno's native testing capabilities.

## Project Versions Overview

1. **Version 0.1: Foundation**
   - Set up basic testing infrastructure using Deno's web testing approach
   - Establish component testing patterns
   - Create initial examples for core components

Note: Version 0.2 (Integration) and Version 0.3 (Enhancement) features have been
moved to the backlog for future consideration. See `backlog.md` for details.

## User Personas

- **Component Developers**: Need to test UI components in isolation
- **Integration Developers**: Need to test component interactions
- **QA Engineers**: Need to verify UI behavior across components

## Success Metrics

- 90%+ test coverage for UI components
- All BfDs components have comprehensive tests
- Test suite runs in under 2 minutes

## Version 0.1: Foundation Implementation Plan

### Technical Goals

- Create a simple, reliable testing infrastructure for UI components
- Establish patterns for testing React components in Deno
- Implement basic rendering tests for core components

### Components and Implementation

#### 1. Testing Library Setup

Following Deno's recommended approach for web testing:

```typescript
// infra/testing/ui-testing.ts

import { DOMParser, Element } from "jsr:@b-fuze/deno-dom";
import { assertEquals, assertExists } from "jsr:@std/assert";
import { renderToString } from "https://esm.sh/preact-render-to-string@6.0.0";

export function render(component: JSX.Element) {
  const html = renderToString(component);
  const doc = new DOMParser().parseFromString(html, "text/html");

  return {
    getByText: (text: string) => {
      const elements = Array.from(doc?.querySelectorAll("*") || []);
      return elements.find((el) => el.textContent?.includes(text));
    },
    getByRole: (role: string, options?: { name?: string }) => {
      const elements = Array.from(
        doc?.querySelectorAll(`[role="${role}"]`) || [],
      );
      if (options?.name) {
        return elements.find((el) =>
          el.getAttribute("aria-label") === options.name
        );
      }
      return elements[0];
    },
    queryByTestId: (testId: string) => {
      return doc?.querySelector(`[data-testid="${testId}"]`);
    },
    // Add more query helpers as needed
    html,
    doc,
  };
}

// Helper for simulating events
export function fireEvent(element: Element, eventName: string, options = {}) {
  const event = new Event(eventName, { bubbles: true, ...options });
  element.dispatchEvent(event);
  return event;
}
```

#### 2. Test Patterns for Different Component Types

Create test patterns for:

- Simple Display Components
- Interactive Components
- Complex Components with Steps

#### 4. BFF Integration

```typescript
// infra/bff/friends/ui-test.bff.ts

import { register } from "infra/bff/bff.ts";
import { runShellCommand } from "infra/bff/shellBase.ts";
import { getLogger } from "packages/logger/logger.ts";

const logger = getLogger(import.meta);

export async function uiTest(args: string[]): Promise<number> {
  const watchFlag = args.includes("--watch");
  // Remove --watch from args if present
  const filteredArgs = args.filter((arg) => arg !== "--watch");
  const componentPath = filteredArgs[0] || ".";
  const testPattern = `${componentPath}/**/__tests__/*.test.{ts,tsx}`;

  logger.info(
    `Running UI tests${watchFlag ? " in watch mode" : ""} for: ${testPattern}`,
  );

  const testArgs = ["deno", "test", "--allow-net", "--allow-read"];

  if (watchFlag) {
    testArgs.push("--watch");
  }

  testArgs.push(testPattern);

  const result = await runShellCommand(testArgs, undefined, {}, true, true);

  if (!watchFlag && result === 0) {
    logger.info("✨ All UI tests passed!");
  } else if (!watchFlag) {
    logger.error("❌ UI tests failed");
  }

  return result;
}

register(
  "ui-test",
  "Run UI component tests (use --watch flag for watch mode)",
  uiTest,
);
```

### Integration Points

- Integrate with existing BFF test command
- Create a testing library compatible with Deno's test runner
- Ensure tests can be run alongside other unit tests

### Testing Strategy

1. **Component Rendering**: Test that components render correctly with various
   props
2. **Event Handling**: Test that events like clicks are properly handled
3. **Accessibility**: Verify that components meet basic accessibility standards
4. **State Changes**: Test that components update correctly when state changes

## Practical Implementation Steps

1. **Start with Deno's native web testing approach**:
   - Use `deno-dom` for DOM manipulation and testing
   - Leverage Deno's built-in testing and assertion utilities
   - Follow patterns from the Deno web testing documentation

2. **Target highest-value components first**:
   - Button, Input, List, Modal
   - These components are used frequently across the application

3. **Follow the Red-Green-Refactor cycle**:
   - Write a failing test for expected component behavior
   - Implement or fix the component to make the test pass
   - Refactor the component and tests while maintaining passing tests

4. **Document testing patterns**:
   - Create a new behavior card for UI component testing
   - Establish conventions for test file organization and naming

5. **Extend BFF CLI commands**:
   - Add `bff ui-test` for running UI component tests
   - Add `bff ui-test --watch` for TDD workflow

## Future Enhancements

See `backlog.md` for details on planned future enhancements that were previously
in Versions 0.2 and 0.3. These include:

- Integration with BFF CLI tooling
- Visual comparison testing
- More sophisticated interaction testing
- Snapshot testing
- Accessibility testing
- Test reporting
