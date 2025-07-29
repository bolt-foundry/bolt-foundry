import { assertEquals, assertExists } from "@std/assert";
import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { BfDsListBar } from "../BfDsListBar.tsx";

Deno.test("BfDsListBar - renders basic structure", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
    />,
  );

  const listBar = doc?.querySelector(".bfds-list-bar");
  assertExists(listBar, "List bar element should exist");
});

Deno.test("BfDsListBar - renders left content", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
    />,
  );

  const leftContent = doc?.querySelector(".bfds-list-bar__left span");
  assertEquals(leftContent?.textContent, "Left content");
});

Deno.test("BfDsListBar - renders center and right content when provided", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      center={<span>Center content</span>}
      right={<span>Right content</span>}
    />,
  );

  assertEquals(
    doc?.querySelector(".bfds-list-bar__left span")?.textContent,
    "Left content",
  );
  assertEquals(
    doc?.querySelector(".bfds-list-bar__center span")?.textContent,
    "Center content",
  );
  assertEquals(
    doc?.querySelector(".bfds-list-bar__right span")?.textContent,
    "Right content",
  );
});

Deno.test("BfDsListBar - applies active class when active", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      active
    />,
  );

  const listBar = doc?.querySelector(".bfds-list-bar--active");
  assertExists(listBar, "List bar should have active class");
});

Deno.test("BfDsListBar - applies clickable class when clickable", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      clickable
    />,
  );

  const listBar = doc?.querySelector(".bfds-list-bar--clickable");
  assertExists(listBar, "List bar should have clickable class");
});

Deno.test("BfDsListBar - renders onClick handler when provided", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      clickable
      onClick={() => {}}
    />,
  );

  const listBar = doc?.querySelector(".bfds-list-bar");
  assertExists(listBar, "List bar should render with onClick handler");
});

Deno.test("BfDsListBar - applies custom className", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      className="custom-class"
    />,
  );

  const listBar = doc?.querySelector(".custom-class");
  assertExists(listBar, "List bar should have custom class");
});

Deno.test("BfDsListBar - only renders left section if center and right not provided", () => {
  const { doc } = render(
    <BfDsListBar
      left={<span>Left content</span>}
    />,
  );

  const leftSection = doc?.querySelector(".bfds-list-bar__left");
  const centerSection = doc?.querySelector(".bfds-list-bar__center");
  const rightSection = doc?.querySelector(".bfds-list-bar__right");

  assertExists(leftSection, "Left section should exist");
  assertEquals(centerSection, null, "Center section should not exist");
  assertEquals(rightSection, null, "Right section should not exist");
});
