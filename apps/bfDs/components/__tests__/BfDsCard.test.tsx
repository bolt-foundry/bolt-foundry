import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsCard } from "../BfDsCard.tsx";

Deno.test("BfDsCard renders children content", () => {
  const { getByText } = render(
    <BfDsCard>
      <div>Test content</div>
    </BfDsCard>,
  );

  assertExists(getByText("Test content"));
});

Deno.test("BfDsCard renders header when provided", () => {
  const { getByText } = render(
    <BfDsCard header={<div>Header content</div>}>
      <div>Body content</div>
    </BfDsCard>,
  );

  assertExists(getByText("Header content"));
  assertExists(getByText("Body content"));
});

Deno.test("BfDsCard renders footer when provided", () => {
  const { getByText } = render(
    <BfDsCard footer={<div>Footer content</div>}>
      <div>Body content</div>
    </BfDsCard>,
  );

  assertExists(getByText("Footer content"));
  assertExists(getByText("Body content"));
});

Deno.test("BfDsCard applies variant classes correctly", () => {
  const variants = ["default", "elevated", "outlined", "flat"] as const;

  variants.forEach((variant) => {
    const { doc } = render(
      <BfDsCard variant={variant}>
        <div>Test content</div>
      </BfDsCard>,
    );

    const card = doc?.querySelector(".bfds-card");
    assertExists(card);
    assertEquals(card.classList.contains(`bfds-card--${variant}`), true);
  });
});

Deno.test("BfDsCard applies size classes correctly", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(
      <BfDsCard size={size}>
        <div>Test content</div>
      </BfDsCard>,
    );

    const card = doc?.querySelector(".bfds-card");
    assertExists(card);
    assertEquals(card.classList.contains(`bfds-card--${size}`), true);
  });
});

Deno.test("BfDsCard applies clickable class when clickable", () => {
  const { doc } = render(
    <BfDsCard clickable onClick={() => {}}>
      <div>Clickable card</div>
    </BfDsCard>,
  );

  const card = doc?.querySelector(".bfds-card");
  assertExists(card);
  assertEquals(card.classList.contains("bfds-card--clickable"), true);
  assertEquals(card.getAttribute("role"), "button");
  assertEquals(card.getAttribute("tabIndex"), "0");
});

Deno.test("BfDsCard applies selected state correctly", () => {
  const { doc } = render(
    <BfDsCard clickable selected>
      <div>Selected card</div>
    </BfDsCard>,
  );

  const card = doc?.querySelector(".bfds-card");
  assertExists(card);
  assertEquals(card.classList.contains("bfds-card--selected"), true);
  assertEquals(card.getAttribute("aria-pressed"), "true");
});

Deno.test("BfDsCard applies disabled state correctly", () => {
  const { doc } = render(
    <BfDsCard clickable disabled onClick={() => {}}>
      <div>Disabled card</div>
    </BfDsCard>,
  );

  const card = doc?.querySelector(".bfds-card");
  assertExists(card);
  assertEquals(card.classList.contains("bfds-card--disabled"), true);
  assertEquals(card.getAttribute("aria-disabled"), "true");
  assertEquals(card.getAttribute("tabIndex"), null);
});

Deno.test("BfDsCard applies custom className", () => {
  const { doc } = render(
    <BfDsCard className="custom-card">
      <div>Test content</div>
    </BfDsCard>,
  );

  const card = doc?.querySelector(".bfds-card");
  assertExists(card);
  assertEquals(card.classList.contains("custom-card"), true);
});

Deno.test("BfDsCard renders complete card with all sections", () => {
  const { getByText, doc } = render(
    <BfDsCard
      header={<div>Header</div>}
      footer={<div>Footer</div>}
      variant="elevated"
      size="large"
      clickable
      selected
    >
      <div>Body content</div>
    </BfDsCard>,
  );

  assertExists(getByText("Header"));
  assertExists(getByText("Body content"));
  assertExists(getByText("Footer"));

  const card = doc?.querySelector(".bfds-card");
  assertExists(card);
  assertEquals(card.classList.contains("bfds-card--elevated"), true);
  assertEquals(card.classList.contains("bfds-card--large"), true);
  assertEquals(card.classList.contains("bfds-card--clickable"), true);
  assertEquals(card.classList.contains("bfds-card--selected"), true);

  const header = doc?.querySelector(".bfds-card__header");
  const body = doc?.querySelector(".bfds-card__body");
  const footer = doc?.querySelector(".bfds-card__footer");

  assertExists(header);
  assertExists(body);
  assertExists(footer);
});

Deno.test("BfDsCard passes through HTML attributes", () => {
  const { doc } = render(
    <BfDsCard data-testid="custom-card" id="test-card">
      <div>Test content</div>
    </BfDsCard>,
  );

  const card = doc?.querySelector(".bfds-card");
  assertExists(card);
  assertEquals(card.getAttribute("data-testid"), "custom-card");
  assertEquals(card.id, "test-card");
});
