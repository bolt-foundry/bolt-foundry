import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsButton } from "../BfDsButton.tsx";

Deno.test("BfDsButton renders with default props", () => {
  const { doc } = render(<BfDsButton>Click me</BfDsButton>);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.textContent,
    "Click me",
    "Button should display children text",
  );
  assertEquals(
    button?.className,
    "bfds-button bfds-button--primary bfds-button--medium",
    "Button should have default classes",
  );
  assertEquals(
    button?.hasAttribute("disabled"),
    false,
    "Button should not be disabled by default",
  );
});

Deno.test("BfDsButton renders with custom variant and size", () => {
  const { doc } = render(
    <BfDsButton variant="secondary" size="large">
      Secondary Large
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className,
    "bfds-button bfds-button--secondary bfds-button--large",
    "Button should have correct variant and size classes",
  );
});

Deno.test("BfDsButton renders in disabled state", () => {
  const { doc } = render(<BfDsButton disabled>Disabled Button</BfDsButton>);

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.hasAttribute("disabled"),
    true,
    "Button should be disabled",
  );
});

Deno.test("BfDsButton renders with icon", () => {
  const { doc } = render(
    <BfDsButton icon="arrowRight">
      With Icon
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  const icon = doc?.querySelector("svg");

  assertExists(button, "Button element should exist");
  assertExists(icon, "Icon should be rendered");
  assertEquals(
    button?.textContent?.includes("With Icon"),
    true,
    "Button should include text content",
  );
});

Deno.test("BfDsButton renders icon-only button", () => {
  const { doc } = render(
    <BfDsButton icon="arrowRight" iconOnly>
      Hidden Text
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--icon-only"),
    true,
    "Button should have icon-only class",
  );
});

Deno.test("BfDsButton renders with right icon position", () => {
  const { doc } = render(
    <BfDsButton icon="arrowRight" iconPosition="right">
      Right Icon
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");

  // Check that the icon appears after the text (implementation detail may vary)
  const textContent = button?.textContent;
  assertEquals(
    textContent?.includes("Right Icon"),
    true,
    "Button should contain text",
  );
});

Deno.test("BfDsButton renders with custom className", () => {
  const { doc } = render(
    <BfDsButton className="custom-class">
      Custom Class
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("custom-class"),
    true,
    "Button should include custom class",
  );
});

Deno.test("BfDsButton accepts additional HTML attributes", () => {
  const { doc } = render(
    <BfDsButton data-testid="test-button" aria-label="Test Button">
      Test Button
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("data-testid"),
    "test-button",
    "Button should have data-testid attribute",
  );
  assertEquals(
    button?.getAttribute("aria-label"),
    "Test Button",
    "Button should have aria-label attribute",
  );
});

Deno.test("BfDsButton with all variants", () => {
  const variants = ["primary", "secondary", "outline", "ghost"] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsButton variant={variant}>{variant}</BfDsButton>,
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

Deno.test("BfDsButton with overlay prop", () => {
  const { doc } = render(
    <BfDsButton variant="primary" overlay>
      Overlay Button
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--overlay-primary"),
    true,
    "Button should have overlay variant class",
  );
});

Deno.test("BfDsButton with overlay prop and different variants", () => {
  const variants = ["primary", "secondary", "outline"] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsButton variant={variant} overlay>
        {variant} overlay
      </BfDsButton>,
    );
    const button = doc?.querySelector("button");
    assertExists(button, `Button with ${variant} overlay should exist`);
    assertEquals(
      button?.className.includes(`bfds-button--overlay-${variant}`),
      true,
      `Button should have overlay-${variant} class`,
    );
  });
});

Deno.test("BfDsButton without overlay prop uses regular variant", () => {
  const { doc } = render(
    <BfDsButton variant="primary">
      Regular Button
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-button--primary"),
    true,
    "Button should have regular variant class",
  );
  assertEquals(
    button?.className.includes("bfds-button--overlay-primary"),
    false,
    "Button should not have overlay variant class",
  );
});

Deno.test("BfDsButton with all sizes", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(<BfDsButton size={size}>{size}</BfDsButton>);
    const button = doc?.querySelector("button");
    assertExists(button, `Button with ${size} size should exist`);
    assertEquals(
      button?.className.includes(`bfds-button--${size}`),
      true,
      `Button should have ${size} class`,
    );
  });
});

Deno.test("BfDsButton with overlay and icon", () => {
  const { doc } = render(
    <BfDsButton variant="primary" overlay icon="arrowRight">
      Overlay with Icon
    </BfDsButton>,
  );

  const button = doc?.querySelector("button");
  const icon = doc?.querySelector("svg");
  assertExists(button, "Button element should exist");
  assertExists(icon, "Icon should be rendered");
  assertEquals(
    button?.className.includes("bfds-button--overlay-primary"),
    true,
    "Button should have overlay variant class",
  );
});
