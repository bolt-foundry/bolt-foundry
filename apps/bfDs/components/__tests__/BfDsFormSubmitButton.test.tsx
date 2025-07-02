import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsFormSubmitButton } from "../BfDsFormSubmitButton.tsx";

Deno.test("BfDsFormSubmitButton renders with default text", () => {
  const { doc } = render(<BfDsFormSubmitButton />);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.textContent,
    "Submit",
    "Button should display default submit text",
  );
  assertEquals(
    button?.getAttribute("type"),
    "submit",
    "Button should have submit type",
  );
});

Deno.test("BfDsFormSubmitButton renders with custom text", () => {
  const { doc } = render(<BfDsFormSubmitButton text="Save Changes" />);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.textContent,
    "Save Changes",
    "Button should display custom text",
  );
});

Deno.test("BfDsFormSubmitButton renders with children instead of text", () => {
  const { doc } = render(
    <BfDsFormSubmitButton text="Ignored Text">
      <span>Custom Content</span>
    </BfDsFormSubmitButton>,
  );

  const button = doc?.querySelector("button");
  const span = doc?.querySelector("span");

  assertExists(button, "Button element should exist");
  assertExists(span, "Custom content should exist");
  assertEquals(
    span?.textContent,
    "Custom Content",
    "Button should display children content",
  );
});

Deno.test("BfDsFormSubmitButton renders with icon", () => {
  const { doc } = render(
    <BfDsFormSubmitButton
      text="Submit with Icon"
      icon="check"
    />,
  );

  const button = doc?.querySelector("button");
  const icon = doc?.querySelector("svg");

  assertExists(button, "Button element should exist");
  assertExists(icon, "Icon should be rendered");
  assertEquals(
    button?.textContent?.includes("Submit with Icon"),
    true,
    "Button should include text content",
  );
});

Deno.test("BfDsFormSubmitButton renders with different variants", () => {
  const variants = ["primary", "secondary", "outline", "ghost"] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsFormSubmitButton variant={variant} text={variant} />,
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

Deno.test("BfDsFormSubmitButton renders with different sizes", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(<BfDsFormSubmitButton size={size} text={size} />);
    const button = doc?.querySelector("button");
    assertExists(button, `Button with ${size} size should exist`);
    assertEquals(
      button?.className.includes(`bfds-button--${size}`),
      true,
      `Button should have ${size} class`,
    );
  });
});

Deno.test("BfDsFormSubmitButton renders in disabled state", () => {
  const { doc } = render(
    <BfDsFormSubmitButton disabled text="Disabled Submit" />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.hasAttribute("disabled"),
    true,
    "Button should be disabled",
  );
});

Deno.test("BfDsFormSubmitButton has correct type attribute", () => {
  const { doc } = render(<BfDsFormSubmitButton text="Submit Form" />);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("type"),
    "submit",
    "Button should always have submit type",
  );
});

Deno.test("BfDsFormSubmitButton renders with custom className", () => {
  const { doc } = render(
    <BfDsFormSubmitButton
      text="Custom Class"
      className="custom-submit-class"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("custom-submit-class"),
    true,
    "Button should include custom class",
  );
  assertEquals(
    button?.className.includes("bfds-button"),
    true,
    "Button should include base button class",
  );
});

Deno.test("BfDsFormSubmitButton renders with icon positions", () => {
  const { doc } = render(
    <BfDsFormSubmitButton
      text="Right Icon"
      icon="arrowRight"
      iconPosition="right"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.textContent?.includes("Right Icon"),
    true,
    "Button should contain text",
  );
});

Deno.test("BfDsFormSubmitButton renders icon-only button", () => {
  const { doc } = render(
    <BfDsFormSubmitButton
      icon="check"
      iconOnly
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--icon-only"),
    true,
    "Button should have icon-only class",
  );
});

Deno.test("BfDsFormSubmitButton renders with HTML attributes", () => {
  const { doc } = render(
    <BfDsFormSubmitButton
      text="Test Button"
      data-testid="submit-button"
      aria-label="Submit the form"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("data-testid"),
    "submit-button",
    "Button should have data-testid attribute",
  );
  assertEquals(
    button?.getAttribute("aria-label"),
    "Submit the form",
    "Button should have aria-label attribute",
  );
});

Deno.test("BfDsFormSubmitButton inherits all button classes", () => {
  const { doc } = render(
    <BfDsFormSubmitButton
      text="All Classes"
      variant="secondary"
      size="large"
    />,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");

  // Should have all the standard BfDsButton classes
  assertEquals(
    button?.className.includes("bfds-button"),
    true,
    "Should have base button class",
  );
  assertEquals(
    button?.className.includes("bfds-button--secondary"),
    true,
    "Should have variant class",
  );
  assertEquals(
    button?.className.includes("bfds-button--large"),
    true,
    "Should have size class",
  );
});
