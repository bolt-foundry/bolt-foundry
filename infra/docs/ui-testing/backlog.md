# UI Component Testing Backlog

This document tracks features, enhancements, and technical improvements that are
being considered for future versions of the UI Component Testing framework.

## Completed Features

### Version 0.1: Foundation

- ✅ Basic testing library with DOM querying capabilities
- ✅ Event simulation support
- ✅ Component rendering utilities
- ✅ Integration with Deno's native testing capabilities
- ✅ BFF CLI command for UI testing

## Backlog Items

### Integration Features (From Version 0.2)

**Priority**: Medium | **Type**: Feature | **Complexity**: Moderate

**Description**: Integration with BFF CLI tooling, visual comparison
capabilities, and comprehensive test coverage for BfDs components.

**Components and Implementation Details**:

#### 1. Enhanced Test Utilities

```typescript
// Enhanced fireEvent with more specific event types
export function fireEvent(element: Element, eventName: string, options = {}) {
  // Implement event simulation with extended capabilities
}

export function createSnapshot(component: JSX.Element) {
  // Create snapshot for comparison
}
```

#### 2. Visual Comparison

```typescript
// Visual comparison testing
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

### Enhancement Features (From Version 0.3)

**Priority**: Low | **Type**: Enhancement | **Complexity**: Complex

**Description**: Snapshot testing capabilities, accessibility testing, and
comprehensive test reporting.

**Components and Implementation Details**:

#### 1. Snapshot Testing

```typescript
// Snapshot testing implementation
export async function matchSnapshot(componentName: string, html: string) {
  // Read existing snapshot or create new one
  // Compare against current output
}
```

#### 2. Accessibility Testing

```typescript
// Accessibility testing
export function checkAccessibility(html: string) {
  // Perform basic accessibility checks
  // Verify ARIA attributes, etc.
}
```

#### 3. Test Reporting

```typescript
// Test reporting utilities
export function generateReport(testResults: TestResult[]) {
  // Generate HTML report with component previews
}
```

## Next Steps

When ready to resume UI testing development:

1. Add comprehensive coverage for all BfDs components
2. Implement visual comparison testing for critical components
3. Add test reporting with component previews
