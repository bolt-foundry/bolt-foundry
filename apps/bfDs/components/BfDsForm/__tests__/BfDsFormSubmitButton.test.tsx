import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsForm } from "../BfDsForm.tsx";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

Deno.test("BfDsFormSubmitButton renders with correct text", () => {
  const { getByText } = render(
    <BfDsForm initialData={{}}>
      <BfDsFormSubmitButton text="Save Changes" />
    </BfDsForm>,
  );

  const button = getByText("Save Changes");
  assertExists(button, "Submit button with text should exist");
});

Deno.test("BfDsFormSubmitButton renders as submit type button", () => {
  const { doc } = render(
    <BfDsForm initialData={{}}>
      <BfDsFormSubmitButton text="Submit" />
    </BfDsForm>,
  );

  const button = doc?.querySelector("button[type='submit']");
  assertExists(button, "Button should have type 'submit'");
});

Deno.test("BfDsFormSubmitButton passes kind prop to BfDsButton", () => {
  const { doc } = render(
    <BfDsForm initialData={{}}>
      <BfDsFormSubmitButton text="Submit" kind="primary" />
    </BfDsForm>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button should exist");

  // Check for primary button styling
  // Note: This may need adjustment based on how BfDsButton applies the kind prop
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
