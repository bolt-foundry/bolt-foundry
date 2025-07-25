import { assertEquals } from "@std/assert";
import { render } from "@testing-library/react";
import { BfDsListBar } from "../BfDsListBar.tsx";

Deno.test("BfDsListBar - renders basic structure", () => {
  const { container } = render(
    <BfDsListBar
      left={<span>Left content</span>}
    />,
  );

  const listBar = container.querySelector(".bfds-list-bar");
  assertEquals(listBar !== null, true);
});

Deno.test("BfDsListBar - renders left content", () => {
  const { getByText } = render(
    <BfDsListBar
      left={<span>Left content</span>}
    />,
  );

  assertEquals(getByText("Left content") !== null, true);
});

Deno.test("BfDsListBar - renders center and right content when provided", () => {
  const { getByText } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      center={<span>Center content</span>}
      right={<span>Right content</span>}
    />,
  );

  assertEquals(getByText("Left content") !== null, true);
  assertEquals(getByText("Center content") !== null, true);
  assertEquals(getByText("Right content") !== null, true);
});

Deno.test("BfDsListBar - applies active class when active", () => {
  const { container } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      active
    />,
  );

  const listBar = container.querySelector(".bfds-list-bar--active");
  assertEquals(listBar !== null, true);
});

Deno.test("BfDsListBar - applies clickable class when clickable", () => {
  const { container } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      clickable
    />,
  );

  const listBar = container.querySelector(".bfds-list-bar--clickable");
  assertEquals(listBar !== null, true);
});

Deno.test("BfDsListBar - calls onClick when clicked", () => {
  let clicked = false;
  const { container } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      clickable
      onClick={() => {
        clicked = true;
      }}
    />,
  );

  const listBar = container.querySelector(".bfds-list-bar") as HTMLElement;
  listBar.click();
  assertEquals(clicked, true);
});

Deno.test("BfDsListBar - applies custom className", () => {
  const { container } = render(
    <BfDsListBar
      left={<span>Left content</span>}
      className="custom-class"
    />,
  );

  const listBar = container.querySelector(".custom-class");
  assertEquals(listBar !== null, true);
});

Deno.test("BfDsListBar - only renders left section if center and right not provided", () => {
  const { container } = render(
    <BfDsListBar
      left={<span>Left content</span>}
    />,
  );

  const leftSection = container.querySelector(".bfds-list-bar__left");
  const centerSection = container.querySelector(".bfds-list-bar__center");
  const rightSection = container.querySelector(".bfds-list-bar__right");

  assertEquals(leftSection !== null, true);
  assertEquals(centerSection === null, true);
  assertEquals(rightSection === null, true);
});
