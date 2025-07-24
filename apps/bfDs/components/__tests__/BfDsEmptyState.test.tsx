import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsEmptyState } from "../BfDsEmptyState.tsx";

Deno.test("BfDsEmptyState renders title", () => {
  const { getByText, doc } = render(
    <BfDsEmptyState title="No items found" />,
  );

  const titleElement = getByText("No items found");
  assertExists(titleElement);

  // Check if it's an h3 element
  const h3 = doc?.querySelector("h3");
  assertExists(h3);
  assertEquals(h3.textContent, "No items found");
});

Deno.test("BfDsEmptyState renders description when provided", () => {
  const { getByText } = render(
    <BfDsEmptyState
      title="No items"
      description="Add some items to get started"
    />,
  );

  assertExists(getByText("Add some items to get started"));
});

Deno.test("BfDsEmptyState renders icon when provided", () => {
  const { doc } = render(
    <BfDsEmptyState
      title="No files"
      icon="computer"
    />,
  );

  const iconContainer = doc?.querySelector(".bfds-empty-state__icon");
  assertExists(iconContainer);
  const icon = iconContainer?.querySelector(".bfds-icon");
  assertExists(icon);
});

Deno.test("BfDsEmptyState applies size classes correctly", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(
      <BfDsEmptyState title="Test" size={size} />,
    );

    const emptyState = doc?.querySelector(".bfds-empty-state");
    assertExists(emptyState);
    assertEquals(
      emptyState.classList.contains(`bfds-empty-state--${size}`),
      true,
    );
  });
});

Deno.test("BfDsEmptyState renders children content", () => {
  const { getByText } = render(
    <BfDsEmptyState title="Error">
      <div>Custom error details</div>
    </BfDsEmptyState>,
  );

  assertExists(getByText("Custom error details"));
});

Deno.test("BfDsEmptyState applies custom className", () => {
  const { doc } = render(
    <BfDsEmptyState
      title="Test"
      className="custom-empty-state"
    />,
  );

  const emptyState = doc?.querySelector(".bfds-empty-state");
  assertExists(emptyState);
  assertEquals(emptyState.classList.contains("custom-empty-state"), true);
});

Deno.test("BfDsEmptyState uses correct icon size based on empty state size", () => {
  const { doc } = render(
    <BfDsEmptyState
      title="Large"
      icon="computer"
      size="large"
    />,
  );

  const icon = doc?.querySelector(".bfds-icon");
  assertExists(icon);
  assertEquals(icon.classList.contains("bfds-icon--xlarge"), true);
});

Deno.test("BfDsEmptyState renders without icon", () => {
  const { doc } = render(
    <BfDsEmptyState title="No icon example" />,
  );

  const iconContainer = doc?.querySelector(".bfds-empty-state__icon");
  assertEquals(iconContainer, null);
});

Deno.test("BfDsEmptyState renders complete empty state with all props", () => {
  const { getByText, doc } = render(
    <BfDsEmptyState
      icon="exclamationCircle"
      title="No results found"
      description="Try adjusting your search criteria"
      size="medium"
      className="search-empty"
    >
      <p>Additional help text</p>
    </BfDsEmptyState>,
  );

  assertExists(getByText("No results found"));
  assertExists(getByText("Try adjusting your search criteria"));
  assertExists(getByText("Additional help text"));
  assertExists(doc?.querySelector(".bfds-icon"));

  const emptyState = doc?.querySelector(".bfds-empty-state");
  assertExists(emptyState);
  assertEquals(emptyState.classList.contains("search-empty"), true);
});
