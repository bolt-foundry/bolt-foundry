import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import {
  BfDsButton,
  type ButtonKind,
  type ButtonSizeType,
} from "../BfDsButton.tsx";

Deno.test("BfDsButton renders with text", () => {
  const buttonText = "Click Me";
  const { getByText } = render(<BfDsButton text={buttonText} />);

  const button = getByText(buttonText);
  assertExists(button, `Button with text "${buttonText}" should exist`);
});

Deno.test("BfDsButton renders with correct variant styles", () => {
  const variants = [
    { kind: "primary", style: "var(--primaryButton)" },
    { kind: "secondary", style: "var(--secondaryButton)" },
    { kind: "accent", style: "var(--accentButton)" },
    { kind: "alert", style: "var(--alert)" },
  ];

  variants.forEach(({ kind, style }) => {
    const { doc } = render(
      <BfDsButton text={`${kind} Button`} kind={kind as ButtonKind} />,
    );
    const button = doc?.querySelector("button");

    assertExists(button, `${kind} button element should exist`);

    const buttonStyle = button?.getAttribute("style");
    assertExists(buttonStyle, `${kind} button should have style attribute`);
    assertEquals(
      buttonStyle?.includes(`background-color:${style}`),
      true,
      `Button should have ${kind} button style`,
    );
  });
});

Deno.test("BfDsButton renders with correct size", () => {
  const sizeVariants = [
    { size: "small", minHeight: 20, iconHeight: 22 },
    { size: "medium", minHeight: 26, iconHeight: 32 },
    { size: "large", minHeight: 32, iconHeight: 40 },
    { size: "xlarge", minHeight: 38, iconHeight: 64 },
  ];

  // Regular buttons
  sizeVariants.forEach(({ size, minHeight }) => {
    const { doc } = render(
      <BfDsButton text={`Size ${size}`} size={size as ButtonSizeType} />,
    );
    const button = doc?.querySelector("button");

    assertExists(button, `Button element for size ${size} should exist`);

    const buttonStyle = button?.getAttribute("style");
    assertExists(buttonStyle, `${size} button should have style attribute`);
    assertEquals(
      buttonStyle?.includes(`min-height:${minHeight}px`),
      true,
      `Button should have min-height of ${minHeight}px for size ${size}`,
    );
  });

  // Icon buttons
  sizeVariants.forEach(({ size, iconHeight }) => {
    const { doc } = render(
      <BfDsButton iconLeft="settings" size={size as ButtonSizeType} />,
    );
    const button = doc?.querySelector("button");

    assertExists(button, `Icon button element for size ${size} should exist`);

    const buttonStyle = button?.getAttribute("style");
    assertExists(
      buttonStyle,
      `${size} icon button should have style attribute`,
    );
    assertEquals(
      buttonStyle?.includes(`height:${iconHeight}px`),
      true,
      `Icon button should have height of ${iconHeight}px for size ${size}`,
    );
  });
});

Deno.test("BfDsButton renders with icon and no text", () => {
  const { doc } = render(<BfDsButton iconLeft="settings" />);
  const button = doc?.querySelector("button");
  assertExists(button, "Icon button element should exist");

  const icon = button?.querySelector(".bfds-button-icon");
  const text = button?.querySelector(".bfds-button-text");

  const isIconButton = `Icon: ${icon != null ? "Y" : "N"} | Text: ${
    text != null ? "Y" : "N"
  }`;
  assertEquals(
    isIconButton,
    "Icon: Y | Text: N",
    "Icon button should have icon and no text",
  );
});

Deno.test("BfDsButton renders with icon and text", () => {
  const { doc } = render(<BfDsButton iconLeft="settings" text="Button text" />);
  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");

  const icon = button?.querySelector(".bfds-button-icon");
  const text = button?.querySelector(".bfds-button-text");

  const isIconButton = `Icon: ${icon != null ? "Y" : "N"} | Text: ${
    text != null ? "Y" : "N"
  }`;
  assertEquals(
    isIconButton,
    "Icon: Y | Text: Y",
    "Button should have icon and text",
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

Deno.test("BfDsButton passes through HTML button attributes", () => {
  const { doc } = render(
    <BfDsButton
      text="Attribute Test"
      aria-label="test button"
      autoFocus
      name="testName"
    />,
  );
  const button = doc?.querySelector("button");

  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("aria-label"),
    "test button",
    "Button should have aria-label attribute",
  );
  assertEquals(
    button?.hasAttribute("autofocus"),
    true,
    "Button should have autofocus attribute",
  );
  assertEquals(
    button?.getAttribute("name"),
    "testName",
    "Button should have name attribute",
  );
});
