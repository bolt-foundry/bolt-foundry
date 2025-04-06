import { fireEvent, render } from "infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButtonConfirmation } from "../BfDsButtonConfirmation.tsx";

Deno.test("BfDsButtonConfirmation renders properly", () => {
  const { queryByTestId } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      testId="delete-confirmation"
    />,
  );

  const container = queryByTestId("confirmation-container");
  assertExists(container, "Confirmation container should exist");

  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
});

Deno.test("BfDsButtonConfirmation shows confirmation buttons when clicked", () => {
  const { queryByTestId, findConfirmationButtons } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      testId="delete-confirmation"
    />,
  );

  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");

  // Initial state should not have confirmation buttons
  let { confirmButton, cancelButton } = findConfirmationButtons(
    "confirmation-container",
  );
  assertEquals(
    confirmButton,
    null,
    "Confirmation button should initially be hidden",
  );
  assertEquals(cancelButton, null, "Cancel button should initially be hidden");

  // Click the trigger to show confirmation
  fireEvent(trigger, "click");

  // Now the confirmation buttons should be visible
  ({ confirmButton, cancelButton } = findConfirmationButtons(
    "confirmation-container",
  ));
  assertExists(
    confirmButton,
    "Confirmation button should be visible after click",
  );
  assertExists(cancelButton, "Cancel button should be visible after click");
});

Deno.test("BfDsButtonConfirmation calls onConfirm when confirmed", () => {
  let confirmed = false;

  // Register a callback
  const handlerId = "testConfirm";
  globalThis.__ui_testing_callbacks = globalThis.__ui_testing_callbacks || {};
  globalThis.__ui_testing_callbacks[handlerId] = () => {
    confirmed = true;
  };

  // Initialize state tracking
  globalThis.__ui_testing_state = globalThis.__ui_testing_state ||
    new Map<string, boolean>();
  globalThis.__ui_testing_state.set("testConfirm-called", false);

  const { queryByTestId, findConfirmationButtons } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={globalThis.__ui_testing_callbacks[handlerId]}
      testId="delete-confirmation"
    />,
  );

  // Manually set the data attribute for the container
  const container = queryByTestId("confirmation-container");
  assertExists(container, "Confirmation container should exist");
  container.setAttribute("data-on-confirm", handlerId);

  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");

  // Click the trigger to show confirmation
  fireEvent(trigger, "click");

  // Get confirm button and click it
  const { confirmButton } = findConfirmationButtons("confirmation-container");
  assertExists(confirmButton, "Confirmation button should be visible");
  fireEvent(confirmButton, "click");

  // Either our local variable or the state map should be set to true
  const wasConfirmed = confirmed ||
    globalThis.__ui_testing_state.get("testConfirm-called") === true;
  assertEquals(wasConfirmed, true, "onConfirm should have been called");

  // Clean up
  delete globalThis.__ui_testing_callbacks[handlerId];
});

Deno.test("BfDsButtonConfirmation hides confirmation when cancel is clicked", () => {
  const { queryByTestId, findConfirmationButtons } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      testId="delete-confirmation"
    />,
  );

  // Click the trigger button to show confirmation buttons
  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  fireEvent(trigger, "click");

  // Get confirmation buttons
  let { confirmButton, cancelButton } = findConfirmationButtons(
    "confirmation-container",
  );
  assertExists(cancelButton, "Cancel button should appear after clicking");

  // Click the cancel button
  fireEvent(cancelButton, "click");

  // After cancel is clicked, confirmation buttons should be hidden
  ({ confirmButton, cancelButton } = findConfirmationButtons(
    "confirmation-container",
  ));
  assertEquals(
    confirmButton,
    null,
    "Confirm button should be hidden after canceling",
  );
  assertEquals(
    cancelButton,
    null,
    "Cancel button should be hidden after canceling",
  );
});

Deno.test("BfDsButtonConfirmation renders with different sizes", () => {
  const { queryByTestId } = render(
    <BfDsButtonConfirmation
      icon="trash"
      onConfirm={() => {}}
      size="small"
      testId="delete-confirmation"
    />,
  );

  const trigger = queryByTestId("confirmation-trigger");
  assertExists(trigger, "Trigger button should exist");
  assertEquals(
    trigger?.getAttribute("data-size"),
    "small",
    "Size should be passed to the trigger button",
  );
});
