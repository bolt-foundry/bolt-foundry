import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsCopyButton } from "../BfDsCopyButton.tsx";

Deno.test("BfDsCopyButton renders with default text", () => {
  const { getByText } = render(<BfDsCopyButton textToCopy="Sample text" />);

  const button = getByText("Copy");
  assertExists(button, "Button with default text 'Copy' should exist");
});

Deno.test("BfDsCopyButton renders with custom button text", () => {
  const buttonText = "Copy to Clipboard";
  const { getByText } = render(
    <BfDsCopyButton textToCopy="Sample text" buttonText={buttonText} />,
  );

  const button = getByText(buttonText);
  assertExists(button, `Button with text "${buttonText}" should exist`);
});

Deno.test("BfDsCopyButton renders with specified button kind", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="Sample text" kind="primary" />,
  );
  const button = doc?.querySelector("button");

  assertExists(button, "Button element should exist");

  // BfDsButton uses inline styles for variants, check for primary style
  const buttonStyle = button?.getAttribute("style");
  assertExists(buttonStyle, "Button should have style attribute");
  assertEquals(
    buttonStyle?.includes("var(--primaryButton)"),
    true,
    "Button should have primary button style",
  );
});

// Note: Testing the copy functionality would require a more complex test setup
// with mocking of clipboard API, which would be covered in integration tests
