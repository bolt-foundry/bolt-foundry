import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsFormToggle } from "../BfDsFormToggle.tsx";

Deno.test("BfDsFormToggle renders with correct label and initial state", () => {
  const initialData = { subscribed: true };
  const { doc, getByText } = render(
    <BfDsForm initialData={initialData}>
      <BfDsFormToggle id="subscribed" title="Subscribe to newsletter" />
    </BfDsForm>,
  );

  // Check if label is rendered correctly
  const label = getByText("Subscribe to newsletter");
  assertExists(label, "Label should exist");

  // Check if the toggle has the correct initial state
  // Note: Since the rendering is to string, we need to check for indicators that
  // the toggle is in the "on" state in the HTML
  const inputElement = doc?.querySelector("input[type='checkbox']");
  assertExists(inputElement, "Toggle input element should exist");

  // The value attribute or checked state should reflect the initial state
  // Check for toggle element rendered by BfDsToggle by looking for input checkbox
  const toggleElement = doc?.querySelector("input[type='checkbox']")
    ?.parentElement;
  assertExists(toggleElement, "Toggle container should exist");

  // Verify the checked state matches our initial data
  // We already have inputElement defined above, so we can reuse it
  assertEquals(
    inputElement?.hasAttribute("checked") ||
      inputElement?.getAttribute("aria-checked") === "true" ||
      inputElement?.getAttribute("value") === "true",
    true,
    "Toggle should be checked initially",
  );
});
