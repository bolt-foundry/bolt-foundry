import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { CfDsForm } from "../CfDsForm.tsx";
import { CfDsFormSubmitButton } from "../CfDsFormSubmitButton.tsx";

Deno.test("CfDsFormSubmitButton renders with correct text", () => {
  const { getByText } = render(
    <CfDsForm initialData={{}}>
      <CfDsFormSubmitButton text="Save Changes" />
    </CfDsForm>,
  );

  const button = getByText("Save Changes");
  assertExists(button, "Submit button with text should exist");
});

Deno.test("CfDsFormSubmitButton renders as submit type button", () => {
  const { doc } = render(
    <CfDsForm initialData={{}}>
      <CfDsFormSubmitButton text="Submit" />
    </CfDsForm>,
  );

  const button = doc?.querySelector("button[type='submit']");
  assertExists(button, "Button should have type 'submit'");
});

Deno.test("CfDsFormSubmitButton passes kind prop to CfDsButton", () => {
  const { doc } = render(
    <CfDsForm initialData={{}}>
      <CfDsFormSubmitButton text="Submit" kind="primary" />
    </CfDsForm>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button should exist");

  // Check for primary button styling
  // Note: This may need adjustment based on how CfDsButton applies the kind prop
  // It could be a class or inline style depending on your implementation
  const buttonStyle = button?.getAttribute("style");
  assertExists(buttonStyle, "Button should have style attribute");
  assertEquals(
    buttonStyle?.includes("var(--primaryButton)") ||
      button?.classList.contains("primary"),
    true,
    "Button should have primary styling",
  );
});
