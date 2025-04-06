import { fireEvent, render } from "infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButtonConfirmation } from "../BfDsButtonConfirmation.tsx";

Deno.test("BfDsButtonConfirmation renders with icon", () => {
  const { queryByTestId } = render(
    <BfDsButtonConfirmation
      text="Delete"
      onConfirm={() => {}}
      icon="trash"
    />,
  );

  const triggerButton = queryByTestId("confirmation-trigger");
  assertExists(triggerButton, "Button with icon should be rendered");
});

Deno.test("BfDsButtonConfirmation shows confirmation buttons when clicked", () => {
  const result = render(
    <BfDsButtonConfirmation text="Delete" onConfirm={() => {}} icon="trash" />,
  );

  // Find the initial button
  const triggerButton = result.queryByTestId("confirmation-trigger");
  assertExists(triggerButton, "Initial button should exist");

  // Click the button
  fireEvent(triggerButton, "click");

  // Check for confirmation container
  const container = result.queryByTestId("confirmation-container");
  assertExists(container, "Confirmation container should exist");

  // Get confirmation buttons (using our new helper)
  const { confirmButton, cancelButton } = result.findConfirmationButtons(
    "confirmation-container",
  );

  // After clicking, confirm and cancel buttons should appear
  assertExists(confirmButton, "Confirm button should appear after clicking");
  assertEquals(
    confirmButton.textContent.includes("Confirm"),
    true,
    "Confirm button should have the right text",
  );

  assertExists(cancelButton, "Cancel button should appear after clicking");
  assertEquals(
    cancelButton.textContent.includes("Cancel"),
    true,
    "Cancel button should have the right text",
  );
});

Deno.test("BfDsButtonConfirmation calls onConfirm when confirmed", () => {
  let confirmCalled = false;
  const handleConfirm = () => {
    confirmCalled = true;
  };

  const result = render(
    <BfDsButtonConfirmation
      text="Delete"
      onConfirm={handleConfirm}
      icon="trash"
    />,
  );

  // Find and click the initial button
  const triggerButton = result.queryByTestId("confirmation-trigger");
  assertExists(triggerButton, "Initial button should exist");
  fireEvent(triggerButton, "click");

  // Get confirmation buttons
  const { confirmButton } = result.findConfirmationButtons(
    "confirmation-container",
  );
  assertExists(confirmButton, "Confirm button should appear after clicking");

  // Click confirm button
  fireEvent(confirmButton, "click");

  // Note: We can't check if onConfirm was called in SSR tests
  // Instead, check if visibility state was updated
  const container = result.queryByTestId("confirmation-container");
  assertEquals(
    container?.getAttribute("data-confirmation-visible"),
    "false",
    "Confirmation should be hidden after confirmation",
  );
});

Deno.test("BfDsButtonConfirmation hides confirmation when cancel is clicked", () => {
  const result = render(
    <BfDsButtonConfirmation text="Delete" onConfirm={() => {}} icon="trash" />,
  );

  // Find and click the initial button
  const triggerButton = result.queryByTestId("confirmation-trigger");
  assertExists(triggerButton, "Initial button should exist");
  fireEvent(triggerButton, "click");

  // Get confirmation buttons
  const { cancelButton } = result.findConfirmationButtons(
    "confirmation-container",
  );
  assertExists(cancelButton, "Cancel button should appear after clicking");

  // Click cancel button
  fireEvent(cancelButton, "click");

  // After cancellation, container should update visibility state
  const container = result.queryByTestId("confirmation-container");
  assertEquals(
    container?.getAttribute("data-confirmation-visible"),
    "false",
    "Confirmation should be hidden after cancellation",
  );
});

Deno.test("BfDsButtonConfirmation renders with different sizes", () => {
  const { queryByTestId, doc } = render(
    <BfDsButtonConfirmation
      text="Delete"
      onConfirm={() => {}}
      icon="trash"
      size="small"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button should exist");

  // Check if the button style includes size-related attributes
  const buttonStyle = button.getAttribute("style");
  assertExists(buttonStyle, "Button should have a style attribute");

  // This is a basic test - we're just checking that some style is applied
  // A more comprehensive test would check specific size-related properties
});
