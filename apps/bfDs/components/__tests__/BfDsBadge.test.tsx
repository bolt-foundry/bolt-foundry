import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsBadge } from "../BfDsBadge.tsx";

Deno.test("BfDsBadge renders children content", () => {
  const { getByText } = render(<BfDsBadge>Test Badge</BfDsBadge>);

  assertExists(getByText("Test Badge"));
});

Deno.test("BfDsBadge applies variant classes correctly", () => {
  const variants = [
    "default",
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
  ] as const;

  variants.forEach((variant) => {
    const { doc } = render(<BfDsBadge variant={variant}>Test</BfDsBadge>);

    const badge = doc?.querySelector(".bfds-badge");
    assertExists(badge);
    assertEquals(badge.classList.contains(`bfds-badge--${variant}`), true);
  });
});

Deno.test("BfDsBadge applies size classes correctly", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(<BfDsBadge size={size}>Test</BfDsBadge>);

    const badge = doc?.querySelector(".bfds-badge");
    assertExists(badge);
    assertEquals(badge.classList.contains(`bfds-badge--${size}`), true);
  });
});

Deno.test("BfDsBadge renders icon when provided", () => {
  const { doc } = render(
    <BfDsBadge icon="checkCircle">With Icon</BfDsBadge>,
  );

  const icon = doc?.querySelector(".bfds-badge__icon");
  assertExists(icon);
  assertEquals(icon.classList.contains("bfds-icon"), true);
});

Deno.test("BfDsBadge applies outlined modifier", () => {
  const { doc } = render(<BfDsBadge outlined>Outlined</BfDsBadge>);

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.classList.contains("bfds-badge--outlined"), true);
});

Deno.test("BfDsBadge applies rounded modifier", () => {
  const { doc } = render(<BfDsBadge rounded>Rounded</BfDsBadge>);

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.classList.contains("bfds-badge--rounded"), true);
});

Deno.test("BfDsBadge applies clickable class when clickable", () => {
  const { doc } = render(
    <BfDsBadge clickable onClick={() => {}}>
      Clickable
    </BfDsBadge>,
  );

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.classList.contains("bfds-badge--clickable"), true);
  assertEquals(badge.getAttribute("role"), "button");
  assertEquals(badge.getAttribute("tabIndex"), "0");
});

Deno.test("BfDsBadge renders remove button when removable", () => {
  const { doc } = render(
    <BfDsBadge removable onRemove={() => {}}>
      Removable
    </BfDsBadge>,
  );

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.classList.contains("bfds-badge--removable"), true);

  const removeButton = doc?.querySelector(".bfds-badge__remove");
  assertExists(removeButton);
  assertEquals(removeButton.getAttribute("aria-label"), "Remove badge");
});

Deno.test("BfDsBadge applies custom className", () => {
  const { doc } = render(<BfDsBadge className="custom-badge">Test</BfDsBadge>);

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.classList.contains("custom-badge"), true);
});

Deno.test("BfDsBadge renders content in correct structure", () => {
  const { getByText, doc } = render(
    <BfDsBadge icon="star" removable onRemove={() => {}}>
      Content
    </BfDsBadge>,
  );

  const badge = doc?.querySelector(".bfds-badge");
  const icon = doc?.querySelector(".bfds-badge__icon");
  const content = doc?.querySelector(".bfds-badge__content");
  const remove = doc?.querySelector(".bfds-badge__remove");

  assertExists(badge);
  assertExists(icon);
  assertExists(content);
  assertExists(remove);

  assertExists(getByText("Content"));
});

Deno.test("BfDsBadge passes through HTML attributes", () => {
  const { doc } = render(
    <BfDsBadge data-testid="custom-badge" id="test-badge">
      Test
    </BfDsBadge>,
  );

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.getAttribute("data-testid"), "custom-badge");
  assertEquals(badge.id, "test-badge");
});

Deno.test("BfDsBadge is not clickable by default", () => {
  const { doc } = render(<BfDsBadge>Non-clickable</BfDsBadge>);

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);
  assertEquals(badge.classList.contains("bfds-badge--clickable"), false);
  assertEquals(badge.getAttribute("role"), null);
  assertEquals(badge.getAttribute("tabIndex"), null);
});

Deno.test("BfDsBadge renders complete badge with all features", () => {
  const { getByText, doc } = render(
    <BfDsBadge
      variant="primary"
      size="large"
      icon="star"
      outlined
      rounded
      clickable
      removable
      onClick={() => {}}
      onRemove={() => {}}
    >
      Full Badge
    </BfDsBadge>,
  );

  const badge = doc?.querySelector(".bfds-badge");
  assertExists(badge);

  assertEquals(badge.classList.contains("bfds-badge--primary"), true);
  assertEquals(badge.classList.contains("bfds-badge--large"), true);
  assertEquals(badge.classList.contains("bfds-badge--outlined"), true);
  assertEquals(badge.classList.contains("bfds-badge--rounded"), true);
  assertEquals(badge.classList.contains("bfds-badge--clickable"), true);
  assertEquals(badge.classList.contains("bfds-badge--removable"), true);

  assertExists(doc?.querySelector(".bfds-badge__icon"));
  assertExists(doc?.querySelector(".bfds-badge__content"));
  assertExists(doc?.querySelector(".bfds-badge__remove"));
  assertExists(getByText("Full Badge"));
});

Deno.test("BfDsBadge uses correct icon sizes based on badge size", () => {
  const sizes = [
    { badgeSize: "small", expectedIconSize: "small" },
    { badgeSize: "medium", expectedIconSize: "small" },
    { badgeSize: "large", expectedIconSize: "medium" },
  ] as const;

  sizes.forEach(({ badgeSize, expectedIconSize }) => {
    const { doc } = render(
      <BfDsBadge size={badgeSize} icon="star">
        Test
      </BfDsBadge>,
    );

    const icon = doc?.querySelector(".bfds-badge__icon");
    assertExists(icon);
    assertEquals(
      icon.classList.contains(`bfds-icon--${expectedIconSize}`),
      true,
    );
  });
});

Deno.test("BfDsBadge does not render icon or remove button when not provided", () => {
  const { doc } = render(<BfDsBadge>Simple Badge</BfDsBadge>);

  const icon = doc?.querySelector(".bfds-badge__icon");
  const remove = doc?.querySelector(".bfds-badge__remove");

  assertEquals(icon, null);
  assertEquals(remove, null);
});
