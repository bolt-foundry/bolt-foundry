import * as React from "react";
import { BfDsButton } from "@bfmono/apps/bfDs/components/BfDsButton.tsx";

const { useEffect, useState } = React;

export type Tab = {
  name: string;
  count?: number;
  hidden?: boolean;
  testId?: string; // for identifying the tab in posthog
};
type Props = {
  kind?: "header" | "subheader";
  tabs: Array<Tab>;
  onTabSelected: (tabName: string) => void;
  overrideSelectedTab?: string; // External control for selected tab
};

const styles: Record<string, React.CSSProperties> = {
  container: {},
  tabs: {
    display: "flex",
    flexDirection: "row",
  },
  tabsHeader: {
    gap: 16,
  },
  tab: {
    padding: "16px 24px 12px",
    fontSize: 16,
    color: "var(--textSecondary)",
    cursor: "pointer",
    borderBottomWidth: 4,
    borderBottomStyle: "solid",
    borderBottomColor: "transparent",
  },
  tabHeader: {
    padding: "0 0 10px",
    fontSize: "1.5em",
    fontWeight: 600,
  },
  tabSelected: {
    color: "var(--text)",
    borderBottomColor: "var(--secondaryColor)",
  },
  tabHover: {
    color: "var(--text)",
  },
  tabNumber: {
    opacity: 0.5,
    fontSize: "0.8em",
    marginLeft: "0.5em",
  },
};

export function BfDsTabs(
  { kind = "subheader", tabs, onTabSelected, overrideSelectedTab }: Props,
) {
  const [internalSelectedTab, setInternalSelectedTab] = useState<string>(
    tabs[0].name,
  );
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);

  if (!tabs || tabs.length === 0) {
    return null;
  }

  // Use the external overrideSelectedTab if provided, otherwise use internal state
  const selectedTabName = overrideSelectedTab !== undefined
    ? overrideSelectedTab
    : internalSelectedTab;

  useEffect(() => {
    // Only trigger the callback when the internal selection changes
    if (overrideSelectedTab === undefined) {
      onTabSelected(internalSelectedTab);
    }
  }, [internalSelectedTab, overrideSelectedTab, onTabSelected]);

  return (
    <div style={styles.container}>
      <div
        style={{ ...styles.tabs, ...(kind === "header" && styles.tabsHeader) }}
      >
        {tabs.map((tab, index) => {
          if (tab.hidden === true) return null;
          return (
            <div
              key={index}
              style={{
                ...styles.tab,
                ...(kind === "header" && styles.tabHeader),
                ...(hoveredTab === index && styles.tabHover),
                ...(selectedTabName === tab.name && styles.tabSelected),
              }}
              onClick={() =>
                overrideSelectedTab === undefined
                  ? setInternalSelectedTab(tab.name)
                  : onTabSelected(tab.name)}
              onMouseEnter={() => setHoveredTab(index)}
              onMouseLeave={() => setHoveredTab(null)}
              data-bf-testid={tab.testId ?? `tab-${tab.name.toLowerCase()}`}
            >
              {tab.name}
              {Number(tab.count) > 0 && (
                <span style={styles.tabNumber}>{tab.count}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Example component to demonstrate usage of BfDsTabs
export function Example() {
  const [selectedHeaderTab, setSelectedHeaderTab] = useState<string>("Tab 1");
  const [selectedTab, setSelectedTab] = useState<string>("Tab 1");
  const demoTabs: Array<Tab> = [
    { name: "Tab 1", count: 15 },
    { name: "Tab 2" },
    { name: "Tab 3", hidden: true },
    { name: "Tab 4", count: 1, testId: "tab-4" },
  ];

  // Example of how to switch tabs programmatically
  const selectNextTab = () => {
    const visibleTabs = demoTabs.filter((tab) => !tab.hidden);
    const currentIndex = visibleTabs.findIndex((tab) =>
      tab.name === selectedTab
    );
    const nextIndex = (currentIndex + 1) % visibleTabs.length;
    setSelectedTab(visibleTabs[nextIndex].name);
  };

  return (
    <>
      {/* Uncontrolled header tabs */}
      <BfDsTabs
        kind="header"
        tabs={demoTabs}
        onTabSelected={(tabName: string) => setSelectedHeaderTab(tabName)}
      />
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        Selected header tab: {selectedHeaderTab}
      </div>

      {/* Controlled tabs with external state */}
      <BfDsTabs
        tabs={demoTabs}
        overrideSelectedTab={selectedTab}
        onTabSelected={(tabName: string) => setSelectedTab(tabName)}
      />
      <div style={{ marginTop: 20, marginBottom: 20 }}>
        Selected tab: {selectedTab}
      </div>

      {/* Button to demonstrate programmatic tab switching */}
      <BfDsButton
        onClick={selectNextTab}
        text="Switch to Next Tab"
      />
    </>
  );
}
