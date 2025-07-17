import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsCopyButton } from "../BfDsCopyButton.tsx";

Deno.test("BfDsCopyButton renders with default props", () => {
  const { doc } = render(<BfDsCopyButton textToCopy="test text" />);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button"),
    true,
    "Button should have bfds-button class",
  );
  assertEquals(
    button?.className.includes("bfds-button--outline"),
    true,
    "Button should have outline variant by default",
  );
  assertEquals(
    button?.className.includes("bfds-button--icon-only"),
    true,
    "Button should be icon-only by default",
  );
});

Deno.test("BfDsCopyButton renders with custom variant", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="test text" variant="primary" />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--primary"),
    true,
    "Button should have primary variant",
  );
});

Deno.test("BfDsCopyButton renders with custom size", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="test text" size="large" />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--large"),
    true,
    "Button should have large size",
  );
});

Deno.test("BfDsCopyButton renders with text when iconOnly is false", () => {
  const { doc } = render(
    <BfDsCopyButton
      textToCopy="test text"
      iconOnly={false}
      buttonText="Copy Text"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--icon-only"),
    false,
    "Button should not be icon-only",
  );
  assertEquals(
    button?.textContent?.includes("Copy Text"),
    true,
    "Button should display button text",
  );
});

Deno.test("BfDsCopyButton renders with custom buttonText", () => {
  const { doc } = render(
    <BfDsCopyButton
      textToCopy="test text"
      iconOnly={false}
      buttonText="Custom Copy"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.textContent?.includes("Custom Copy"),
    true,
    "Button should display custom button text",
  );
});

Deno.test("BfDsCopyButton renders with clipboard icon by default", () => {
  const { doc } = render(<BfDsCopyButton textToCopy="test text" />);

  const button = doc?.querySelector("button");
  const icon = doc?.querySelector("svg");

  assertExists(button, "Button element should exist");
  assertExists(icon, "Icon should be rendered");
  // The actual icon name is not easily testable in this setup,
  // but we can verify an icon is present
});

Deno.test("BfDsCopyButton renders with custom icon", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="test text" icon="download" />,
  );

  const button = doc?.querySelector("button");
  const icon = doc?.querySelector("svg");

  assertExists(button, "Button element should exist");
  assertExists(icon, "Icon should be rendered");
});

Deno.test("BfDsCopyButton renders with custom className", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="test text" className="custom-class" />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("custom-class"),
    true,
    "Button should include custom class",
  );
});

Deno.test("BfDsCopyButton renders with disabled state", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="test text" disabled />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.hasAttribute("disabled"),
    true,
    "Button should be disabled",
  );
});

Deno.test("BfDsCopyButton renders with aria-label", () => {
  const { doc } = render(
    <BfDsCopyButton
      textToCopy="test text"
      aria-label="Copy to clipboard"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("aria-label"),
    "Copy to clipboard",
    "Button should have aria-label",
  );
});

Deno.test("BfDsCopyButton renders with data attributes", () => {
  const { doc } = render(
    <BfDsCopyButton
      textToCopy="test text"
      data-testid="copy-button"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("data-testid"),
    "copy-button",
    "Button should have data-testid",
  );
});

Deno.test("BfDsCopyButton accepts textToCopy prop", () => {
  const { doc } = render(
    <BfDsCopyButton textToCopy="Hello World" />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  // The textToCopy prop is used internally and not visible in the DOM
  // but we can verify the component renders correctly
});

Deno.test("BfDsCopyButton renders with all size variants", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(
      <BfDsCopyButton textToCopy="test" size={size} />,
    );
    const button = doc?.querySelector("button");
    assertExists(button, `Button with ${size} size should exist`);
    assertEquals(
      button?.className.includes(`bfds-button--${size}`),
      true,
      `Button should have ${size} class`,
    );
  });
});

Deno.test("BfDsCopyButton renders with all variants", () => {
  const variants = ["primary", "secondary", "outline", "ghost"] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsCopyButton textToCopy="test" variant={variant} />,
    );
    const button = doc?.querySelector("button");
    assertExists(button, `Button with ${variant} variant should exist`);
    assertEquals(
      button?.className.includes(`bfds-button--${variant}`),
      true,
      `Button should have ${variant} class`,
    );
  });
});

Deno.test("BfDsCopyButton button type is button by default", () => {
  const { doc } = render(<BfDsCopyButton textToCopy="test text" />);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("type"),
    "button",
    "Button should have type='button'",
  );
});

Deno.test("BfDsCopyButton renders with custom copiedText", () => {
  // This test verifies the prop is accepted, but testing the actual
  // state change would require more complex setup with timers
  const { doc } = render(
    <BfDsCopyButton
      textToCopy="test text"
      copiedText="Copied Successfully!"
      iconOnly={false}
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  // The copiedText is used in state management, not directly visible
});

Deno.test("BfDsCopyButton renders with custom copiedDuration", () => {
  // This test verifies the prop is accepted
  const { doc } = render(
    <BfDsCopyButton
      textToCopy="test text"
      copiedDuration={2000}
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  // The copiedDuration is used in setTimeout, not directly visible
});
