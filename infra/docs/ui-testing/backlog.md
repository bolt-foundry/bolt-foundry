# UI Component Testing Backlog

This document tracks features, enhancements, and technical improvements that are
being considered for future versions of the UI Component Testing framework.

## Integration Features (From Version 0.2)

**Priority**: Medium **Type**: Feature **Complexity**: Moderate **Target
Version**: Future

**Description**: Integration with BFF CLI tooling, visual comparison
capabilities, and comprehensive test coverage for BfDs components.

**Justification**: These features enhance the testing framework with better
tooling integration and visual testing capabilities.

**Dependencies**: Core testing foundation must be stable.

**Acceptance Criteria**:

- Integration with CI/CD pipeline
- Visual comparison testing implemented
- BFF CLI integration complete
- Full test coverage for BfDs components

**Why aren't we working on this yet?** Focusing on establishing the core testing
infrastructure first before adding more advanced features.

### Components and Implementation Details

#### 1. Enhanced Test Utilities

```typescript
// infra/testing/ui-testing.ts additions

export function fireEvent(element: Element, eventName: string, options = {}) {
  // Implement event simulation
}

export function createSnapshot(component: JSX.Element) {
  // Create snapshot for comparison
}
```

#### 2. Visual Comparison

```typescript
// infra/testing/visual-comparison.ts

export async function compareVisual(componentName: string, html: string) {
  // Create a visual fingerprint of the component
  // Compare against baseline
}
```

#### 3. Interaction Tests

```typescript
// Example interaction test
Deno.test("BfDsButton triggers onClick when clicked", () => {
  let clicked = false;
  const { doc } = render(
    <BfDsButton
      text="Click Me"
      onClick={() => {
        clicked = true;
      }}
    />,
  );
  const button = doc?.querySelector("button");
  assertExists(button);

  fireEvent(button, "click");
  assertEquals(clicked, true);
});
```

## Enhancement Features (From Version 0.3)

**Priority**: Low **Type**: Enhancement **Complexity**: Complex **Target
Version**: Future

**Description**: Snapshot testing capabilities, accessibility testing, and
comprehensive test reporting.

**Justification**: These features provide more advanced testing capabilities and
better reporting for UI components.

**Dependencies**: Core testing foundation and integration features must be
stable.

**Acceptance Criteria**:

- Snapshot testing implemented
- Accessibility testing integrated
- Comprehensive test reporting working

**Why aren't we working on this yet?** Focusing on establishing the core testing
infrastructure first before adding more advanced features.

### Components and Implementation Details

#### 1. Snapshot Testing

```typescript
// infra/testing/snapshot.ts

export async function matchSnapshot(componentName: string, html: string) {
  // Read existing snapshot or create new one
  // Compare against current output
}
```

#### 2. Accessibility Testing

```typescript
// infra/testing/a11y.ts

export function checkAccessibility(html: string) {
  // Perform basic accessibility checks
  // Verify ARIA attributes, etc.
}
```

#### 3. Test Reporting

```typescript
// infra/reporting/test-report.ts

export function generateReport(testResults: TestResult[]) {
  // Generate HTML report with component previews
}
```
