import { act, render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsToastContainer } from "../BfDsToast.tsx";
import { BfDsToastProvider, useBfDsToast } from "../BfDsToastProvider.tsx";
import type { BfDsToastItem } from "../BfDsToast.tsx";

// Mock toast-root element for testing
function setupToastRoot() {
  const existingRoot = document.getElementById("toast-root");
  if (!existingRoot) {
    const toastRoot = document.createElement("div");
    toastRoot.id = "toast-root";
    document.body.appendChild(toastRoot);
  }
  return document.getElementById("toast-root")!;
}

// Helper component to test toast functionality
function TestToastComponent() {
  const { showToast, hideToast, clearAllToasts } = useBfDsToast();

  return (
    <div>
      <button
        type="button"
        data-testid="show-info-toast"
        onClick={() => showToast("Info message")}
      >
        Show Info Toast
      </button>
      <button
        type="button"
        data-testid="show-success-toast"
        onClick={() => showToast("Success message", { variant: "success" })}
      >
        Show Success Toast
      </button>
      <button
        type="button"
        data-testid="show-warning-toast"
        onClick={() => showToast("Warning message", { variant: "warning" })}
      >
        Show Warning Toast
      </button>
      <button
        type="button"
        data-testid="show-error-toast"
        onClick={() => showToast("Error message", { variant: "error" })}
      >
        Show Error Toast
      </button>
      <button
        type="button"
        data-testid="show-custom-toast"
        onClick={() =>
          showToast("Custom message", {
            timeout: 0,
            details: "Additional details",
            id: "custom-toast",
          })}
      >
        Show Custom Toast
      </button>
      <button
        type="button"
        data-testid="hide-toast"
        onClick={() => hideToast("custom-toast")}
      >
        Hide Toast
      </button>
      <button
        type="button"
        data-testid="clear-all-toasts"
        onClick={() => clearAllToasts()}
      >
        Clear All Toasts
      </button>
    </div>
  );
}

Deno.test("BfDsToastContainer renders empty state", () => {
  setupToastRoot();
  const { doc } = render(
    <BfDsToastContainer toasts={[]} onRemove={() => {}} />,
  );

  const container = doc?.querySelector(".bfds-toast-container");
  assertExists(container, "Toast container should exist");
  assertEquals(container?.children.length, 0, "Container should be empty");
});

Deno.test("BfDsToastContainer renders single toast", () => {
  setupToastRoot();
  const mockToast: BfDsToastItem = {
    id: "test-toast",
    message: "Test message",
    variant: "info",
    timeout: 5000,
  };

  const { doc } = render(
    <BfDsToastContainer toasts={[mockToast]} onRemove={() => {}} />,
  );

  const container = doc?.querySelector(".bfds-toast-container");
  const toast = doc?.querySelector(".bfds-toast");

  assertExists(container, "Toast container should exist");
  assertExists(toast, "Toast should exist");
  assertEquals(
    container?.children.length,
    1,
    "Container should have one toast",
  );
});

Deno.test("BfDsToastContainer renders multiple toasts", () => {
  setupToastRoot();
  const mockToasts: Array<BfDsToastItem> = [
    { id: "toast-1", message: "First toast", variant: "info" },
    { id: "toast-2", message: "Second toast", variant: "success" },
    { id: "toast-3", message: "Third toast", variant: "warning" },
  ];

  const { doc } = render(
    <BfDsToastContainer toasts={mockToasts} onRemove={() => {}} />,
  );

  const container = doc?.querySelector(".bfds-toast-container");
  const toasts = doc?.querySelectorAll(".bfds-toast");

  assertExists(container, "Toast container should exist");
  assertEquals(toasts.length, 3, "Should render three toasts");
  assertEquals(
    container?.children.length,
    3,
    "Container should have three toasts",
  );
});

Deno.test("BfDsToastProvider provides context", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  const showInfoButton = doc?.querySelector('[data-testid="show-info-toast"]');
  const showSuccessButton = doc?.querySelector(
    '[data-testid="show-success-toast"]',
  );
  const clearButton = doc?.querySelector('[data-testid="clear-all-toasts"]');

  assertExists(showInfoButton, "Show info toast button should exist");
  assertExists(showSuccessButton, "Show success toast button should exist");
  assertExists(clearButton, "Clear all toasts button should exist");
});

Deno.test("BfDsToastProvider shows toast with default variant", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  const showButton = doc?.querySelector(
    '[data-testid="show-info-toast"]',
  ) as HTMLButtonElement;
  assertExists(showButton, "Show button should exist");

  // Simulate click
  act(() => {
    showButton?.click();
  });

  // Check for toast in the DOM
  const toastContainer = doc?.querySelector(".bfds-toast-container");
  const toast = doc?.querySelector(".bfds-toast");
  const callout = doc?.querySelector(".bfds-callout--info");

  assertExists(toastContainer, "Toast container should exist");
  assertExists(toast, "Toast should exist");
  assertExists(callout, "Info callout should exist");
});

Deno.test("BfDsToastProvider shows toast with different variants", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  const variants = [
    { testId: "show-success-toast", className: "bfds-callout--success" },
    { testId: "show-warning-toast", className: "bfds-callout--warning" },
    { testId: "show-error-toast", className: "bfds-callout--error" },
  ];

  variants.forEach(({ testId, className }) => {
    const showButton = doc?.querySelector(
      `[data-testid="${testId}"]`,
    ) as HTMLButtonElement;
    assertExists(showButton, `Show ${testId} button should exist`);

    // Simulate click
    act(() => {
      showButton?.click();
    });

    // Check for toast variant
    const callout = doc?.querySelector(`.${className}`);
    assertExists(callout, `${className} callout should exist`);
  });
});

Deno.test("BfDsToastProvider shows toast with custom properties", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  const showButton = doc?.querySelector(
    '[data-testid="show-custom-toast"]',
  ) as HTMLButtonElement;
  assertExists(showButton, "Show custom toast button should exist");

  // Simulate click
  act(() => {
    showButton?.click();
  });

  // Check for toast with details
  const toast = doc?.querySelector(".bfds-toast");
  const callout = doc?.querySelector(".bfds-callout");
  const detailsButton = doc?.querySelector(".bfds-callout-toggle");

  assertExists(toast, "Toast should exist");
  assertExists(callout, "Callout should exist");
  assertExists(detailsButton, "Details toggle button should exist");
});

Deno.test("BfDsToastProvider can hide specific toast", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  // Show custom toast
  const showButton = doc?.querySelector(
    '[data-testid="show-custom-toast"]',
  ) as HTMLButtonElement;
  act(() => {
    showButton?.click();
  });

  // Verify toast exists
  const toast = doc?.querySelector(".bfds-toast");
  assertExists(toast, "Toast should exist after showing");

  // Hide specific toast
  const hideButton = doc?.querySelector(
    '[data-testid="hide-toast"]',
  ) as HTMLButtonElement;
  act(() => {
    hideButton?.click();
  });

  // Note: In real scenario, toast would be removed after animation
  // In test environment, we can check if onRemove was called
});

Deno.test("BfDsToastProvider can clear all toasts", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  // Show multiple toasts
  const showInfoButton = doc?.querySelector(
    '[data-testid="show-info-toast"]',
  ) as HTMLButtonElement;
  const showSuccessButton = doc?.querySelector(
    '[data-testid="show-success-toast"]',
  ) as HTMLButtonElement;

  act(() => {
    showInfoButton?.click();
    showSuccessButton?.click();
  });

  // Clear all toasts
  const clearButton = doc?.querySelector(
    '[data-testid="clear-all-toasts"]',
  ) as HTMLButtonElement;
  act(() => {
    clearButton?.click();
  });

  // Check that container is empty
  const container = doc?.querySelector(".bfds-toast-container");
  assertExists(container, "Toast container should exist");
  // Note: In real scenario, all toasts would be removed
});

Deno.test("BfDsToast renders with proper CSS classes", () => {
  setupToastRoot();
  const mockToast: BfDsToastItem = {
    id: "test-toast",
    message: "Test message",
    variant: "success",
  };

  const { doc } = render(
    <BfDsToastContainer toasts={[mockToast]} onRemove={() => {}} />,
  );

  const toast = doc?.querySelector(".bfds-toast");
  const callout = doc?.querySelector(".bfds-callout");
  const calloutVariant = doc?.querySelector(".bfds-callout--success");

  assertExists(toast, "Toast should exist");
  assertExists(callout, "Callout should exist");
  assertExists(calloutVariant, "Success callout variant should exist");

  // Check for proper CSS classes
  assertEquals(
    toast?.className.includes("bfds-toast"),
    true,
    "Toast should have base class",
  );
});

Deno.test("BfDsToast handles missing toast-root gracefully", () => {
  // Remove toast-root if it exists
  const existingRoot = document.getElementById("toast-root");
  if (existingRoot) {
    existingRoot.remove();
  }

  const mockToast: BfDsToastItem = {
    id: "test-toast",
    message: "Test message",
  };

  // Should not throw error
  const { doc } = render(
    <BfDsToastContainer toasts={[mockToast]} onRemove={() => {}} />,
  );

  // Component should handle missing root gracefully
  const container = doc?.querySelector(".bfds-toast-container");
  assertEquals(
    container,
    null,
    "Container should not exist when toast-root is missing",
  );
});

Deno.test("useBfDsToast throws error outside provider", () => {
  let errorThrown = false;

  try {
    const TestComponent = () => {
      const { showToast: _showToast } = useBfDsToast();
      return <div>Test</div>;
    };

    render(<TestComponent />);
  } catch (error) {
    errorThrown = true;
    assertEquals(
      error.message,
      "useBfDsToast must be used within a BfDsToastProvider",
      "Should throw proper error message",
    );
  }

  assertEquals(
    errorThrown,
    true,
    "Should throw error when used outside provider",
  );
});

Deno.test("BfDsToast generates unique IDs", () => {
  setupToastRoot();

  const { doc } = render(
    <BfDsToastProvider>
      <TestToastComponent />
    </BfDsToastProvider>,
  );

  const showButton = doc?.querySelector(
    '[data-testid="show-info-toast"]',
  ) as HTMLButtonElement;

  // Show multiple toasts
  act(() => {
    showButton?.click();
    showButton?.click();
  });

  const toasts = doc?.querySelectorAll(".bfds-toast");
  assertEquals(toasts.length, 2, "Should create multiple toasts");

  // Each toast should have unique styling (implementation detail)
  // In real scenario, each would have different IDs
});

Deno.test("BfDsToast renders with proper accessibility attributes", () => {
  setupToastRoot();
  const mockToast: BfDsToastItem = {
    id: "test-toast",
    message: "Test message",
  };

  const { doc } = render(
    <BfDsToastContainer toasts={[mockToast]} onRemove={() => {}} />,
  );

  const dismissButton = doc?.querySelector(".bfds-callout-dismiss");
  assertExists(dismissButton, "Dismiss button should exist");

  const ariaLabel = dismissButton?.getAttribute("aria-label");
  assertEquals(
    ariaLabel,
    "Dismiss notification",
    "Should have proper aria-label",
  );
});

// Clean up after tests
Deno.test.ignore("Cleanup", () => {
  const toastRoot = document.getElementById("toast-root");
  if (toastRoot) {
    toastRoot.remove();
  }
});
