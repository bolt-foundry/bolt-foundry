import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsPill } from "../BfDsPill.tsx";

Deno.test("BfDsPill renders with default props", () => {
  const { doc } = render(<BfDsPill />);

  const pill = doc?.querySelector(".bfds-pill");
  assertExists(pill, "Pill element should exist");
  assertEquals(
    pill?.className,
    "bfds-pill bfds-pill--secondary bfds-pill--label-only",
    "Pill should have default classes",
  );
});

Deno.test("BfDsPill renders with label only", () => {
  const { doc } = render(<BfDsPill label="Status" />);

  const pill = doc?.querySelector(".bfds-pill");
  const label = doc?.querySelector(".bfds-pill__label");

  assertExists(pill, "Pill element should exist");
  assertExists(label, "Label element should exist");
  assertEquals(
    label?.textContent,
    "Status",
    "Label should display correct text",
  );
  assertEquals(
    pill?.className.includes("bfds-pill--label-only"),
    true,
    "Pill should have label-only class",
  );
});

Deno.test("BfDsPill renders with label and text", () => {
  const { doc } = render(<BfDsPill label="Count" text="42" />);

  const pill = doc?.querySelector(".bfds-pill");
  const label = doc?.querySelector(".bfds-pill__label");
  const content = doc?.querySelector(".bfds-pill__content");

  assertExists(pill, "Pill element should exist");
  assertExists(label, "Label element should exist");
  assertExists(content, "Content element should exist");
  assertEquals(
    label?.textContent,
    "Count",
    "Label should display correct text",
  );
  assertEquals(
    content?.textContent,
    "42",
    "Content should display correct text",
  );
  assertEquals(
    pill?.className.includes("bfds-pill--label-only"),
    false,
    "Pill should not have label-only class",
  );
});

Deno.test("BfDsPill renders with label and icon", () => {
  const { doc } = render(<BfDsPill label="Status" icon="check" />);

  const pill = doc?.querySelector(".bfds-pill");
  const label = doc?.querySelector(".bfds-pill__label");
  const content = doc?.querySelector(".bfds-pill__content");
  const icon = doc?.querySelector("svg");

  assertExists(pill, "Pill element should exist");
  assertExists(label, "Label element should exist");
  assertExists(content, "Content element should exist");
  assertExists(icon, "Icon should be rendered");
  assertEquals(
    label?.textContent,
    "Status",
    "Label should display correct text",
  );
});

Deno.test("BfDsPill renders with all variants", () => {
  const variants = [
    "primary",
    "secondary",
    "success",
    "error",
    "warning",
    "info",
  ] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsPill label="Test" variant={variant} />,
    );
    const pill = doc?.querySelector(".bfds-pill");
    assertExists(pill, `Pill with ${variant} variant should exist`);
    assertEquals(
      pill?.className.includes(`bfds-pill--${variant}`),
      true,
      `Pill should have ${variant} class`,
    );
  });
});

Deno.test("BfDsPill renders with text as number", () => {
  const { doc } = render(<BfDsPill label="Count" text={123} />);

  const content = doc?.querySelector(".bfds-pill__content");
  assertExists(content, "Content element should exist");
  assertEquals(
    content?.textContent,
    "123",
    "Content should display number as text",
  );
});

Deno.test("BfDsPill renders with custom action", () => {
  const { doc } = render(
    <BfDsPill
      label="Status"
      action={<button type="button">Delete</button>}
    />,
  );

  const pill = doc?.querySelector(".bfds-pill");
  const label = doc?.querySelector(".bfds-pill__label");
  const content = doc?.querySelector(".bfds-pill__content");
  const button = doc?.querySelector("button");

  assertExists(pill, "Pill element should exist");
  assertExists(label, "Label element should exist");
  assertExists(content, "Content element should exist");
  assertExists(button, "Action button should exist");
  assertEquals(
    button?.textContent,
    "Delete",
    "Action button should display correct text",
  );
});

Deno.test("BfDsPill renders with custom className", () => {
  const { doc } = render(
    <BfDsPill label="Test" className="custom-class" />,
  );

  const pill = doc?.querySelector(".bfds-pill");
  assertExists(pill, "Pill element should exist");
  assertEquals(
    pill?.className.includes("custom-class"),
    true,
    "Pill should include custom class",
  );
});

Deno.test("BfDsPill renders with all content types", () => {
  const { doc } = render(
    <BfDsPill
      label="Complete"
      text="Done"
      icon="check"
      action={<button type="button">×</button>}
    />,
  );

  const pill = doc?.querySelector(".bfds-pill");
  const label = doc?.querySelector(".bfds-pill__label");
  const content = doc?.querySelector(".bfds-pill__content");
  const icon = doc?.querySelector("svg");
  const button = doc?.querySelector("button");

  assertExists(pill, "Pill element should exist");
  assertExists(label, "Label element should exist");
  assertExists(content, "Content element should exist");
  assertExists(icon, "Icon should be rendered");
  assertExists(button, "Action button should exist");
  assertEquals(
    label?.textContent,
    "Complete",
    "Label should display correct text",
  );
  assertEquals(
    content?.textContent?.includes("Done"),
    true,
    "Content should contain text",
  );
  assertEquals(
    button?.textContent,
    "×",
    "Action button should display correct text",
  );
});

Deno.test("BfDsPill renders without content when only label provided", () => {
  const { doc } = render(<BfDsPill label="Simple" />);

  const pill = doc?.querySelector(".bfds-pill");
  const label = doc?.querySelector(".bfds-pill__label");
  const content = doc?.querySelector(".bfds-pill__content");

  assertExists(pill, "Pill element should exist");
  assertExists(label, "Label element should exist");
  assertEquals(
    content,
    null,
    "Content element should not exist when only label is provided",
  );
  assertEquals(
    label?.className.includes("bfds-pill__label--no-content"),
    true,
    "Label should have no-content class",
  );
});
