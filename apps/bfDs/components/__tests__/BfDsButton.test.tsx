import { render } from "infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButton } from "../BfDsButton.tsx";

Deno.test("BfDsButton renders with text", () => {
  const buttonText = "Click Me";
  const { getByText } = render(<BfDsButton text={buttonText} />);

  const button = getByText(buttonText);
  assertExists(button, `Button with text "${buttonText}" should exist`);
});

Deno.test("BfDsButton renders with correct variant style", () => {
  const { doc } = render(<BfDsButton text="Primary Button" kind="primary" />);
  const button = doc?.querySelector("button");

  assertExists(button, "Button element should exist");

  // BfDsButton uses inline styles rather than classes for variants
  const buttonStyle = button?.getAttribute("style");
  assertExists(buttonStyle, "Button should have style attribute");
  assertEquals(
    buttonStyle?.includes("var(--primaryButton)"),
    true,
    "Button should have primary button style",
  );
});

Deno.test("BfDsButton renders as disabled when disabled prop is true", () => {
  const { doc } = render(<BfDsButton text="Disabled Button" disabled />);
  const button = doc?.querySelector("button");

  assertExists(button, "Button element should exist");
  assertEquals(
    button?.hasAttribute("disabled"),
    true,
    "Button should have disabled attribute",
  );
});
