import { fireEvent, render } from "infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButtonConfirmation } from "../BfDsButtonConfirmation.tsx";

Deno.test("BfDsButtonConfirmation renders with icon", () => {
  const { doc } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
});

Deno.test("BfDsButtonConfirmation shows confirmation buttons when clicked", () => {
  const { doc } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      testId="delete-btn"
    />,
  );

  // Find the main button and click it
  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");

  fireEvent(button, "click");

  // Check if confirmation buttons appear
  const confirmButton = doc?.querySelector(
    "[data-testid='delete-btn-confirm']",
  );
  const cancelButton = doc?.querySelector("[data-testid='delete-btn-cancel']");

  assertExists(confirmButton, "Confirm button should appear after clicking");
  assertExists(cancelButton, "Cancel button should appear after clicking");
});

Deno.test("BfDsButtonConfirmation calls onConfirm when confirmed", () => {
  let confirmed = false;

  const { doc } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {
        confirmed = true;
      }}
      testId="delete-btn"
    />,
  );

  // Find and click the main button to show confirmation
  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  fireEvent(button, "click");

  // Find and click the confirm button
  const confirmButton = doc?.querySelector(
    "[data-testid='delete-btn-confirm']",
  );
  assertExists(confirmButton, "Confirm button should appear after clicking");

  fireEvent(confirmButton, "click");

  assertEquals(confirmed, true, "onConfirm callback should be called");
});

Deno.test("BfDsButtonConfirmation hides confirmation when cancel is clicked", () => {
  const { doc } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      testId="delete-btn"
    />,
  );

  // Find and click the main button to show confirmation
  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  fireEvent(button, "click");

  // Find and click the cancel button
  const cancelButton = doc?.querySelector("[data-testid='delete-btn-cancel']");
  assertExists(cancelButton, "Cancel button should appear after clicking");

  fireEvent(cancelButton, "click");

  // Confirmation buttons should no longer be present
  const confirmButton = doc?.querySelector(
    "[data-testid='delete-btn-confirm']",
  );
  assertEquals(
    confirmButton,
    null,
    "Confirmation buttons should be hidden after canceling",
  );
});

Deno.test("BfDsButtonConfirmation renders with different sizes", () => {
  const { doc } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      size="small"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");

  // Check if the button has the small size style
  // This is an implementation detail check, but useful to verify the size prop works
  const buttonStyle = button?.getAttribute("style");
  assertExists(buttonStyle, "Button should have style attribute");
});
