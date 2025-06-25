import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { BfDsBreadcrumbs } from "../BfDsBreadcrumbs.tsx";

Deno.test("BfDsBreadcrumbs renders with crumbs", () => {
  const crumbs = [
    { name: "Page One", link: "/page1" },
    { name: "Page Two", link: "/page2" },
  ];
  const { doc } = render(<BfDsBreadcrumbs crumbs={crumbs} />);

  const breadcrumbItems = doc?.querySelectorAll(".breadcrumb-item");
  assertExists(breadcrumbItems, "Breadcrumb items should exist");
  assertEquals(breadcrumbItems.length, 2, "Should render two breadcrumb items");

  const links = doc?.querySelectorAll(".breadcrumb-item a");
  assertEquals(links?.length, 2, "Should render two links");
  assertEquals(
    links?.[0].getAttribute("href"),
    "/page1",
    "First link should have correct href",
  );
  assertEquals(
    links?.[1].getAttribute("href"),
    "/page2",
    "Second link should have correct href",
  );
  assertEquals(
    links?.[0].textContent,
    "Page One",
    "First link should have correct text",
  );
  assertEquals(
    links?.[1].textContent,
    "Page Two",
    "Second link should have correct text",
  );
});

Deno.test("BfDsBreadcrumbs renders with homeLink", () => {
  const crumbs = [{ name: "Page One", link: "/page1" }];
  const homeLink = "/home";
  const { doc } = render(
    <BfDsBreadcrumbs crumbs={crumbs} homeLink={homeLink} />,
  );

  const breadcrumbItems = doc?.querySelectorAll(".breadcrumb-item");
  assertExists(breadcrumbItems, "Breadcrumb items should exist");
  assertEquals(
    breadcrumbItems.length,
    2,
    "Should render two breadcrumb items including home",
  );

  const links = doc?.querySelectorAll(".breadcrumb-item a");
  assertEquals(links?.length, 2, "Should render two links including home");
  assertEquals(
    links?.[0].getAttribute("href"),
    "/home",
    "Home link should have correct href",
  );
});

Deno.test("BfDsBreadcrumbs renders back icon for crumb with back=true", () => {
  const crumbs = [
    { name: "Back", link: "/back", back: true },
    { name: "Current", link: "/current" },
  ];
  const { doc } = render(<BfDsBreadcrumbs crumbs={crumbs} />);

  const firstCrumbContent = doc?.querySelector(
    ".breadcrumb-item:first-child a",
  );
  assertExists(firstCrumbContent, "First breadcrumb item should exist");

  const backIcon = firstCrumbContent?.querySelector("svg");
  assertExists(backIcon, "Back icon should exist in the first breadcrumb");
});

Deno.test("BfDsBreadcrumbs renders with correct accessibility attributes", () => {
  const crumbs = [{ name: "Page One", link: "/page1" }];
  const { doc } = render(<BfDsBreadcrumbs crumbs={crumbs} />);

  const nav = doc?.querySelector("nav");
  assertExists(nav, "Navigation element should exist");
  assertEquals(
    nav?.getAttribute("aria-label"),
    "Breadcrumbs",
    "Nav should have correct aria-label",
  );
});
