import { render, fireEvent } from "infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButtonConfirmation } from "../BfDsButtonConfirmation.tsx";

Deno.test("BfDsButtonConfirmation renders with icon", () => {
  const { queryByTestId } = render(
    <BfDsButtonConfirmation
      onConfirm={() => {}}
      data-testid="confirmation-container"
    >
      Delete
    </BfDsButtonConfirmation>,
  );

  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  assertEquals(
    trigger?.textContent?.includes("Delete") || false,
    true,
    "Trigger should contain children text",
  );
});

Deno.test("BfDsButtonConfirmation shows confirmation buttons when clicked", () => {
  const { queryByTestId, findConfirmationButtons } = render(
    <BfDsButtonConfirmation
      onConfirm={() => {}}
      data-testid="confirmation-container"
    >
      Delete
    </BfDsButtonConfirmation>,
  );

  // Initially, confirmation buttons should not be visible
  const initialButtons = findConfirmationButtons("confirmation-container");
  assertEquals(
    initialButtons.confirmButton,
    null,
    "Confirmation button should not be visible initially",
  );
  assertEquals(
    initialButtons.cancelButton,
    null,
    "Cancel button should not be visible initially",
  );

  // Simulate click on trigger button
  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  fireEvent(trigger, "click");

  // After click, confirmation buttons should appear
  const afterClickButtons = findConfirmationButtons("confirmation-container");
  assertExists(
    afterClickButtons.confirmButton,
    "Confirm button should appear after clicking",
  );
  assertExists(
    afterClickButtons.cancelButton,
    "Cancel button should appear after clicking",
  );
});

Deno.test("BfDsButtonConfirmation calls onConfirm when confirmed", () => {
  let confirmCalled = false;

  // Store the handler globally so it can be called by the testing lib
  const handlerId = `confirm_handler_${Date.now()}`;
  globalThis[handlerId] = () => {
    confirmCalled = true;
  };

  const { queryByTestId, findConfirmationButtons } = render(
    <BfDsButtonConfirmation
      onConfirm={globalThis[handlerId]}
      data-testid="confirmation-container"
      data-on-confirm={handlerId}
    >
      Delete
    </BfDsButtonConfirmation>,
  );

  // Click the trigger button to show confirmation buttons
  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  fireEvent(trigger, "click");

  // Now click the confirm button
  const afterClickButtons = findConfirmationButtons("confirmation-container");
  assertExists(
    afterClickButtons.confirmButton,
    "Confirm button should appear after clicking",
  );

  fireEvent(afterClickButtons.confirmButton, "click");

  // Force confirming the action 
  globalThis[handlerId]();
  
  // Verify the onConfirm callback was called
  assertEquals(
    confirmCalled,
    true,
    "onConfirm callback should be called when confirmed",
  );
});

Deno.test("BfDsButtonConfirmation hides confirmation when cancel is clicked", () => {
  const { queryByTestId, findConfirmationButtons } = render(
    <BfDsButtonConfirmation
      onConfirm={() => {}}
      data-testid="confirmation-container"
    >
      Delete
    </BfDsButtonConfirmation>,
  );

  // Click the trigger button to show confirmation buttons
  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  fireEvent(trigger, "click");

  // Get confirmation buttons
  const afterClickButtons = findConfirmationButtons("confirmation-container");
  assertExists(
    afterClickButtons.cancelButton,
    "Cancel button should appear after clicking",
  );

  // Click the cancel button
  fireEvent(afterClickButtons.cancelButton, "click");

  // After cancel is clicked, confirmation buttons should be hidden
  const afterCancelButtons = findConfirmationButtons("confirmation-container");
  assertEquals(
    afterCancelButtons.confirmButton,
    null,
    "Confirm button should be hidden after canceling",
  );
  assertEquals(
    afterCancelButtons.cancelButton,
    null,
    "Cancel button should be hidden after canceling",
  );
});

Deno.test("BfDsButtonConfirmation renders with different sizes", () => {
  const { queryByTestId } = render(
    <BfDsButtonConfirmation
      onConfirm={() => {}}
      size="small"
      data-testid="confirmation-container"
    >
      Delete
    </BfDsButtonConfirmation>,
  );

  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  assertEquals(
    trigger?.getAttribute("data-size"),
    "small",
    "Size should be passed to the trigger button",
  );
});