import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { CfDsCopyButton } from "../CfDsCopyButton.tsx";

Deno.test("CfDsCopyButton renders with default text", () => {
  const { getByText } = render(<CfDsCopyButton textToCopy="Sample text" />);

  const button = getByText("Copy");
  assertExists(button, "Button with default text 'Copy' should exist");
});

Deno.test("CfDsCopyButton renders with custom button text", () => {
  const buttonText = "Copy to Clipboard";
  const { getByText } = render(
    <CfDsCopyButton textToCopy="Sample text" buttonText={buttonText} />,
  );

  const button = getByText(buttonText);
  assertExists(button, `Button with text "${buttonText}" should exist`);
});

Deno.test("CfDsCopyButton renders with specified button kind", () => {
  const { doc } = render(
    <CfDsCopyButton textToCopy="Sample text" kind="primary" />,
  );
  const button = doc?.querySelector("button");

  assertExists(button, "Button element should exist");

  // CfDsButton uses inline styles for variants, check for primary style
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
