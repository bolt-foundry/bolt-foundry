import { render } from "@bfmono/infra/testing/ui-testing.ts";
import { assertEquals, assertExists } from "@std/assert";
import { type BfDsTabItem, BfDsTabs } from "../BfDsTabs.tsx";

const basicTabs: Array<BfDsTabItem> = [
  {
    id: "tab1",
    label: "Tab 1",
    content: <div>Content 1</div>,
  },
  {
    id: "tab2",
    label: "Tab 2",
    content: <div>Content 2</div>,
  },
  {
    id: "tab3",
    label: "Tab 3",
    content: <div>Content 3</div>,
    disabled: true,
  },
];

const tabsWithIcons: Array<BfDsTabItem> = [
  {
    id: "home",
    label: "Home",
    icon: "arrowRight",
    content: <div>Home content</div>,
  },
  {
    id: "settings",
    label: "Settings",
    icon: "burgerMenu",
    content: <div>Settings content</div>,
  },
];

const tabsWithSubtabs: Array<BfDsTabItem> = [
  {
    id: "docs",
    label: "Documentation",
    content: <div>Docs main content</div>,
    subtabs: [
      {
        id: "getting-started",
        label: "Getting Started",
        content: <div>Getting started content</div>,
      },
      {
        id: "api-reference",
        label: "API Reference",
        content: <div>API reference content</div>,
        disabled: true,
      },
    ],
  },
  {
    id: "support",
    label: "Support",
    content: <div>Support content</div>,
  },
];

Deno.test("BfDsTabs renders basic tab structure", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} />);

  const tabsContainer = doc?.querySelector(".bfds-tabs");
  const tabsHeader = doc?.querySelector(".bfds-tabs__header");
  const tabsContent = doc?.querySelector(".bfds-tabs__content");
  const tabButtons = doc?.querySelectorAll(".bfds-tab");

  assertExists(tabsContainer, "Tabs container should exist");
  assertExists(tabsHeader, "Tabs header should exist");
  assertExists(tabsContent, "Tabs content should exist");
  assertEquals(tabButtons?.length, 3, "Should render three tab buttons");
  assertEquals(
    tabsHeader?.getAttribute("role"),
    "tablist",
    "Header should have tablist role",
  );
});

Deno.test("BfDsTabs renders with default active tab", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} />);

  const activeTab = doc?.querySelector(".bfds-tab--active");
  const panel = doc?.querySelector(".bfds-tabs__panel");

  assertExists(activeTab, "Should have an active tab");
  assertExists(panel, "Should have a content panel");
  assertEquals(
    activeTab?.textContent?.trim(),
    "Tab 1",
    "First tab should be active by default",
  );
  assertEquals(
    panel?.textContent?.trim(),
    "Content 1",
    "Should display first tab's content",
  );
});

Deno.test("BfDsTabs renders with specified default active tab", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} defaultActiveTab="tab2" />);

  const activeTab = doc?.querySelector(".bfds-tab--active");
  const panel = doc?.querySelector(".bfds-tabs__panel");

  assertExists(activeTab, "Should have an active tab");
  assertExists(panel, "Should have a content panel");
  assertEquals(
    activeTab?.textContent?.trim(),
    "Tab 2",
    "Second tab should be active",
  );
  assertEquals(
    panel?.textContent?.trim(),
    "Content 2",
    "Should display second tab's content",
  );
});

Deno.test("BfDsTabs renders controlled active tab", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} activeTab="tab3" />);

  const activeTab = doc?.querySelector(".bfds-tab--active");

  assertExists(activeTab, "Should have an active tab");
  assertEquals(
    activeTab?.textContent?.trim(),
    "Tab 3",
    "Third tab should be active when controlled",
  );
});

Deno.test("BfDsTabs renders disabled tab", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} />);

  const disabledTab = doc?.querySelector(".bfds-tab--disabled");
  const disabledButton = doc?.querySelector("button[disabled]");

  assertExists(disabledTab, "Should have disabled tab styling");
  assertExists(
    disabledButton,
    "Disabled tab button should have disabled attribute",
  );
  assertEquals(
    disabledTab?.textContent?.trim(),
    "Tab 3",
    "Third tab should be disabled",
  );
});

Deno.test("BfDsTabs renders with icons", () => {
  const { doc } = render(<BfDsTabs tabs={tabsWithIcons} />);

  const icons = doc?.querySelectorAll("svg");
  const tabButtons = doc?.querySelectorAll(".bfds-tab");

  assertEquals(icons?.length, 2, "Should render two icons");
  assertEquals(tabButtons?.length, 2, "Should render two tab buttons");
});

Deno.test("BfDsTabs renders with different variants", () => {
  const { doc: primaryDoc } = render(
    <BfDsTabs tabs={basicTabs} variant="primary" />,
  );
  const { doc: secondaryDoc } = render(
    <BfDsTabs tabs={basicTabs} variant="secondary" />,
  );

  const primaryContainer = primaryDoc?.querySelector(".bfds-tabs");
  const secondaryContainer = secondaryDoc?.querySelector(".bfds-tabs");

  assertExists(primaryContainer, "Primary tabs container should exist");
  assertExists(secondaryContainer, "Secondary tabs container should exist");
  assertEquals(
    primaryContainer?.className.includes("bfds-tabs--primary"),
    true,
    "Primary container should have primary class",
  );
  assertEquals(
    secondaryContainer?.className.includes("bfds-tabs--secondary"),
    true,
    "Secondary container should have secondary class",
  );
});

Deno.test("BfDsTabs renders with different sizes", () => {
  const sizes = ["small", "medium", "large"] as const;

  sizes.forEach((size) => {
    const { doc } = render(<BfDsTabs tabs={basicTabs} size={size} />);
    const container = doc?.querySelector(".bfds-tabs");
    const tabs = doc?.querySelectorAll(".bfds-tab");

    assertExists(container, `Tabs container with ${size} size should exist`);
    assertEquals(
      container?.className.includes(`bfds-tabs--${size}`),
      true,
      `Container should have ${size} class`,
    );

    Array.from(tabs).forEach((tab, index) => {
      assertEquals(
        tab?.className.includes(`bfds-tab--${size}`),
        true,
        `Tab ${index + 1} should have ${size} class`,
      );
    });
  });
});

Deno.test("BfDsTabs renders with custom className", () => {
  const { doc } = render(
    <BfDsTabs tabs={basicTabs} className="custom-tabs-class" />,
  );

  const container = doc?.querySelector(".bfds-tabs");
  assertExists(container, "Tabs container should exist");
  assertEquals(
    container?.className.includes("custom-tabs-class"),
    true,
    "Container should include custom class",
  );
});

Deno.test("BfDsTabs renders with subtabs", () => {
  const { doc } = render(
    <BfDsTabs tabs={tabsWithSubtabs} defaultActiveTab="docs" />,
  );

  const mainHeader = doc?.querySelector(".bfds-tabs__header");
  const subHeader = doc?.querySelector(".bfds-tabs__subheader");
  const subtabButtons = doc?.querySelectorAll(".bfds-subtab");
  const subpanel = doc?.querySelector(".bfds-tabs__subpanel");

  assertExists(mainHeader, "Main tabs header should exist");
  assertExists(subHeader, "Subtabs header should exist");
  assertEquals(subtabButtons?.length, 2, "Should render two subtab buttons");
  assertExists(subpanel, "Subpanel should exist for subtab content");
  assertEquals(
    subHeader?.getAttribute("role"),
    "tablist",
    "Subheader should have tablist role",
  );
});

Deno.test("BfDsTabs subtabs default selection", () => {
  const { doc } = render(
    <BfDsTabs tabs={tabsWithSubtabs} defaultActiveTab="docs" />,
  );

  const activeSubtab = doc?.querySelector(".bfds-subtab--active");
  const subpanel = doc?.querySelector(".bfds-tabs__subpanel");

  assertExists(activeSubtab, "Should have an active subtab");
  assertExists(subpanel, "Should have subpanel");
  assertEquals(
    activeSubtab?.textContent?.trim(),
    "Getting Started",
    "First subtab should be active by default",
  );
  assertEquals(
    subpanel?.textContent?.trim(),
    "Getting started content",
    "Should display first subtab's content",
  );
});

Deno.test("BfDsTabs disabled subtab", () => {
  const { doc } = render(
    <BfDsTabs tabs={tabsWithSubtabs} defaultActiveTab="docs" />,
  );

  const disabledSubtab = doc?.querySelector(".bfds-subtab--disabled");
  const disabledSubtabButton = doc?.querySelector(
    "button.bfds-subtab--disabled",
  );

  assertExists(disabledSubtab, "Should have disabled subtab styling");
  assertExists(
    disabledSubtabButton,
    "Disabled subtab button should have disabled attribute",
  );
});

Deno.test("BfDsTabs accessibility attributes", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} />);

  const tabButtons = doc?.querySelectorAll(".bfds-tab");
  const panel = doc?.querySelector(".bfds-tabs__panel");

  Array.from(tabButtons).forEach((button, index) => {
    assertEquals(
      button?.getAttribute("role"),
      "tab",
      `Tab button ${index + 1} should have tab role`,
    );
    assertEquals(
      button?.getAttribute("aria-selected") !== null,
      true,
      `Tab button ${index + 1} should have aria-selected attribute`,
    );
    assertEquals(
      button?.getAttribute("aria-controls") !== null,
      true,
      `Tab button ${index + 1} should have aria-controls attribute`,
    );
  });

  assertExists(panel, "Panel should exist");
  assertEquals(
    panel?.getAttribute("role"),
    "tabpanel",
    "Panel should have tabpanel role",
  );
  assertEquals(
    panel?.getAttribute("aria-labelledby") !== null,
    true,
    "Panel should have aria-labelledby attribute",
  );
});

Deno.test("BfDsTabs subtabs accessibility", () => {
  const { doc } = render(
    <BfDsTabs tabs={tabsWithSubtabs} defaultActiveTab="docs" />,
  );

  const subtabButtons = doc?.querySelectorAll(".bfds-subtab");
  const subpanel = doc?.querySelector(".bfds-tabs__subpanel");

  Array.from(subtabButtons).forEach((button, index) => {
    assertEquals(
      button?.getAttribute("role"),
      "tab",
      `Subtab button ${index + 1} should have tab role`,
    );
    assertEquals(
      button?.getAttribute("aria-selected") !== null,
      true,
      `Subtab button ${index + 1} should have aria-selected attribute`,
    );
  });

  assertExists(subpanel, "Subpanel should exist");
  assertEquals(
    subpanel?.getAttribute("role"),
    "tabpanel",
    "Subpanel should have tabpanel role",
  );
});

Deno.test("BfDsTabs fallback when no tabs provided", () => {
  const { doc } = render(<BfDsTabs tabs={[]} />);

  const container = doc?.querySelector(".bfds-tabs");
  const header = doc?.querySelector(".bfds-tabs__header");
  const content = doc?.querySelector(".bfds-tabs__content");

  assertExists(container, "Container should exist even with empty tabs");
  assertExists(header, "Header should exist even with empty tabs");
  assertExists(content, "Content should exist even with empty tabs");
});

Deno.test("BfDsTabs tab without icon", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} />);

  const firstTab = doc?.querySelector(".bfds-tab");
  const icon = firstTab?.querySelector("svg");

  assertExists(firstTab, "First tab should exist");
  assertEquals(icon, null, "Tab without icon should not have SVG element");
});

Deno.test("BfDsTabs default variant and size", () => {
  const { doc } = render(<BfDsTabs tabs={basicTabs} />);

  const container = doc?.querySelector(".bfds-tabs");
  assertExists(container, "Container should exist");
  assertEquals(
    container?.className.includes("bfds-tabs--primary"),
    true,
    "Should have primary variant by default",
  );
  assertEquals(
    container?.className.includes("bfds-tabs--medium"),
    true,
    "Should have medium size by default",
  );
});
