import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsListItem } from "../BfDsListItem.tsx";

Deno.test("BfDsListItem renders as li element by default", () => {
  const { doc } = render(
    <BfDsListItem>Default Item</BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  assertExists(listItem, "List item element should exist");
  assertEquals(
    listItem?.textContent,
    "Default Item",
    "List item should display content",
  );
  assertEquals(
    listItem?.className,
    "bfds-list-item",
    "List item should have default class",
  );
});

Deno.test("BfDsListItem renders in active state", () => {
  const { doc } = render(
    <BfDsListItem active>Active Item</BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  assertExists(listItem, "List item element should exist");
  assertEquals(
    listItem?.className.includes("bfds-list-item--active"),
    true,
    "List item should have active class",
  );
});

Deno.test("BfDsListItem renders in disabled state", () => {
  const { doc } = render(
    <BfDsListItem disabled>Disabled Item</BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  assertExists(listItem, "List item element should exist");
  assertEquals(
    listItem?.className.includes("bfds-list-item--disabled"),
    true,
    "List item should have disabled class",
  );
});

Deno.test("BfDsListItem renders as button when onClick provided", () => {
  const { doc } = render(
    <BfDsListItem onClick={() => {}}>Clickable Item</BfDsListItem>,
  );

  const button = doc?.querySelector("button");
  const listItem = doc?.querySelector("li");

  assertExists(button, "Button element should exist");
  assertEquals(listItem, null, "Li element should not exist");
  assertEquals(
    button?.textContent,
    "Clickable Item",
    "Button should display content",
  );
  assertEquals(
    button?.getAttribute("type"),
    "button",
    "Button should have correct type",
  );
  assertEquals(
    button?.className.includes("bfds-list-item--clickable"),
    true,
    "Button should have clickable class",
  );
});

Deno.test("BfDsListItem renders as li when disabled with onClick", () => {
  const { doc } = render(
    <BfDsListItem onClick={() => {}} disabled>
      Disabled Clickable Item
    </BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  const button = doc?.querySelector("button");

  assertExists(listItem, "List item element should exist when disabled");
  assertEquals(button, null, "Button element should not exist when disabled");
  assertEquals(
    listItem?.className.includes("bfds-list-item--disabled"),
    true,
    "List item should have disabled class",
  );
  assertEquals(
    listItem?.className.includes("bfds-list-item--clickable"),
    false,
    "List item should not have clickable class when disabled",
  );
});

Deno.test("BfDsListItem renders with custom className", () => {
  const { doc } = render(
    <BfDsListItem className="custom-item-class">
      Custom Class Item
    </BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  assertExists(listItem, "List item element should exist");
  assertEquals(
    listItem?.className.includes("custom-item-class"),
    true,
    "List item should include custom class",
  );
  assertEquals(
    listItem?.className.includes("bfds-list-item"),
    true,
    "List item should include base class",
  );
});

Deno.test("BfDsListItem renders with combined states", () => {
  const { doc } = render(
    <BfDsListItem active onClick={() => {}}>
      Active Clickable Item
    </BfDsListItem>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.className.includes("bfds-list-item--active"),
    true,
    "Button should have active class",
  );
  assertEquals(
    button?.className.includes("bfds-list-item--clickable"),
    true,
    "Button should have clickable class",
  );
});

Deno.test("BfDsListItem renders complex children", () => {
  const { doc } = render(
    <BfDsListItem>
      <span>Icon</span>
      <div>
        <h4>Title</h4>
        <p>Description</p>
      </div>
    </BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  const span = doc?.querySelector("span");
  const h4 = doc?.querySelector("h4");
  const p = doc?.querySelector("p");

  assertExists(listItem, "List item element should exist");
  assertExists(span, "Span should exist");
  assertExists(h4, "H4 should exist");
  assertExists(p, "Paragraph should exist");
  assertEquals(span?.textContent, "Icon", "Span should have correct content");
  assertEquals(h4?.textContent, "Title", "H4 should have correct content");
  assertEquals(
    p?.textContent,
    "Description",
    "Paragraph should have correct content",
  );
});

Deno.test("BfDsListItem button has correct attributes", () => {
  const { doc } = render(
    <BfDsListItem onClick={() => {}}>Button Item</BfDsListItem>,
  );

  const button = doc?.querySelector("button");
  assertExists(button, "Button element should exist");
  assertEquals(
    button?.getAttribute("type"),
    "button",
    "Button should have correct type attribute",
  );
});

Deno.test("BfDsListItem filters boolean classes correctly", () => {
  const { doc } = render(
    <BfDsListItem active={false} disabled={false}>Normal Item</BfDsListItem>,
  );

  const listItem = doc?.querySelector("li");
  assertExists(listItem, "List item element should exist");
  assertEquals(
    listItem?.className,
    "bfds-list-item",
    "List item should only have base class when flags are false",
  );
});

Deno.test("BfDsListItem class combinations", () => {
  const testCases = [
    { props: { active: true }, expectedClass: "bfds-list-item--active" },
    { props: { disabled: true }, expectedClass: "bfds-list-item--disabled" },
    {
      props: { onClick: () => {} },
      expectedClass: "bfds-list-item--clickable",
    },
    {
      props: { active: true, disabled: true },
      expectedClasses: ["bfds-list-item--active", "bfds-list-item--disabled"],
    },
  ];

  testCases.forEach(({ props, expectedClass, expectedClasses }) => {
    const { doc } = render(<BfDsListItem {...props}>Test Item</BfDsListItem>);
    const element = doc?.querySelector("li, button");
    assertExists(element, "Element should exist");

    if (expectedClasses) {
      expectedClasses.forEach((cls) => {
        assertEquals(
          element?.className.includes(cls),
          true,
          `Element should have ${cls} class`,
        );
      });
    } else if (expectedClass) {
      assertEquals(
        element?.className.includes(expectedClass),
        true,
        `Element should have ${expectedClass} class`,
      );
    }
  });
});
