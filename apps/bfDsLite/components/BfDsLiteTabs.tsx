import * as React from "react";
import { BfDsLiteIcon, type BfDsLiteIconName } from "./BfDsLiteIcon.tsx";

export type BfDsLiteTabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: BfDsLiteIconName;
  disabled?: boolean;
  subtabs?: Array<BfDsLiteTabItem>;
};

export type BfDsLiteTabsProps = {
  tabs: Array<BfDsLiteTabItem>;
  activeTab?: string;
  defaultActiveTab?: string;
  onTabChange?: (tabId: string) => void;
  className?: string;
  variant?: "primary" | "secondary";
  size?: "small" | "medium" | "large";
};

export type BfDsLiteTabsState = {
  activeTab: string;
  activeSubtabs: Record<string, string>; // parentTabId -> activeSubtabId
};

export function BfDsLiteTabs({
  tabs,
  activeTab,
  defaultActiveTab,
  onTabChange,
  className,
  variant = "primary",
  size = "medium",
}: BfDsLiteTabsProps) {
  // Determine if this is controlled or uncontrolled
  const isControlled = activeTab !== undefined;

  // Initialize state
  const [state, setState] = React.useState<BfDsLiteTabsState>(() => {
    const initialActiveTab = activeTab || defaultActiveTab || tabs[0]?.id || "";
    const activeSubtabs: Record<string, string> = {};

    // Initialize subtab states
    tabs.forEach((tab) => {
      if (tab.subtabs && tab.subtabs.length > 0) {
        activeSubtabs[tab.id] = tab.subtabs[0].id;
      }
    });

    return {
      activeTab: initialActiveTab,
      activeSubtabs,
    };
  });

  // Update state when controlled activeTab changes
  React.useEffect(() => {
    if (isControlled && activeTab !== undefined) {
      setState((prev) => ({
        ...prev,
        activeTab,
      }));
    }
  }, [activeTab, isControlled]);

  const currentActiveTab = isControlled ? activeTab! : state.activeTab;

  const handleTabClick = (tabId: string) => {
    if (tabs.find((tab) => tab.id === tabId)?.disabled) return;

    if (!isControlled) {
      setState((prev) => ({
        ...prev,
        activeTab: tabId,
      }));
    }

    onTabChange?.(tabId);
  };

  const handleSubtabClick = (parentTabId: string, subtabId: string) => {
    const parentTab = tabs.find((tab) => tab.id === parentTabId);
    const subtab = parentTab?.subtabs?.find((sub) => sub.id === subtabId);
    if (subtab?.disabled) return;

    setState((prev) => ({
      ...prev,
      activeSubtabs: {
        ...prev.activeSubtabs,
        [parentTabId]: subtabId,
      },
    }));
  };

  const renderTab = (
    tab: BfDsLiteTabItem,
    isActive: boolean,
    _index: number,
    _tabIds: Array<string>,
  ) => {
    const classes = [
      "bfds-lite-tab",
      `bfds-lite-tab--${variant}`,
      `bfds-lite-tab--${size}`,
      isActive && "bfds-lite-tab--active",
      tab.disabled && "bfds-lite-tab--disabled",
    ].filter(Boolean).join(" ");

    return (
      <button
        key={tab.id}
        type="button"
        className={classes}
        onClick={() => handleTabClick(tab.id)}
        disabled={tab.disabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`panel-${tab.id}`}
      >
        {tab.icon && (
          <BfDsLiteIcon
            name={tab.icon}
            size={size === "small"
              ? "small"
              : size === "large"
              ? "large"
              : "medium"}
          />
        )}
        <span>{tab.label}</span>
      </button>
    );
  };

  const renderSubtab = (
    subtab: BfDsLiteTabItem,
    parentTab: BfDsLiteTabItem,
    isActive: boolean,
    _index: number,
    _subtabIds: Array<string>,
  ) => {
    const classes = [
      "bfds-lite-subtab",
      `bfds-lite-subtab--${variant}`,
      `bfds-lite-subtab--${size}`,
      isActive && "bfds-lite-subtab--active",
      subtab.disabled && "bfds-lite-subtab--disabled",
    ].filter(Boolean).join(" ");

    return (
      <button
        key={subtab.id}
        type="button"
        className={classes}
        onClick={() => handleSubtabClick(parentTab.id, subtab.id)}
        disabled={subtab.disabled}
        role="tab"
        aria-selected={isActive}
        aria-controls={`subpanel-${parentTab.id}-${subtab.id}`}
      >
        {subtab.icon && (
          <BfDsLiteIcon
            name={subtab.icon}
            size="small"
          />
        )}
        <span>{subtab.label}</span>
      </button>
    );
  };

  const activeTabData = tabs.find((tab) => tab.id === currentActiveTab);
  const hasSubtabs = activeTabData?.subtabs && activeTabData.subtabs.length > 0;
  const activeSubtabId = hasSubtabs
    ? state.activeSubtabs[currentActiveTab]
    : null;
  const activeSubtabData = hasSubtabs
    ? activeTabData?.subtabs?.find((sub) => sub.id === activeSubtabId)
    : null;

  const tabIds = tabs.map((tab) => tab.id);
  const subtabIds = activeTabData?.subtabs?.map((sub) => sub.id) || [];

  const containerClasses = [
    "bfds-lite-tabs",
    `bfds-lite-tabs--${variant}`,
    `bfds-lite-tabs--${size}`,
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={containerClasses}>
      {/* Main tabs */}
      <div
        className="bfds-lite-tabs__header"
        role="tablist"
        aria-orientation="horizontal"
      >
        {tabs.map((tab, index) =>
          renderTab(tab, tab.id === currentActiveTab, index, tabIds)
        )}
      </div>

      {/* Subtabs */}
      {hasSubtabs && activeTabData?.subtabs && (
        <div
          className="bfds-lite-tabs__subheader"
          role="tablist"
          aria-orientation="horizontal"
        >
          {activeTabData.subtabs.map((subtab, index) =>
            renderSubtab(
              subtab,
              activeTabData,
              subtab.id === activeSubtabId,
              index,
              subtabIds,
            )
          )}
        </div>
      )}

      {/* Content panels */}
      <div className="bfds-lite-tabs__content">
        {/* Main tab content or subtab content */}
        {hasSubtabs && activeSubtabData
          ? (
            <div
              key={`${currentActiveTab}-${activeSubtabId}`}
              id={`subpanel-${currentActiveTab}-${activeSubtabId}`}
              className="bfds-lite-tabs__panel bfds-lite-tabs__subpanel"
              role="tabpanel"
              aria-labelledby={`subtab-${activeSubtabId}`}
            >
              {activeSubtabData.content}
            </div>
          )
          : (
            <div
              key={currentActiveTab}
              id={`panel-${currentActiveTab}`}
              className="bfds-lite-tabs__panel"
              role="tabpanel"
              aria-labelledby={`tab-${currentActiveTab}`}
            >
              {activeTabData?.content}
            </div>
          )}
      </div>
    </div>
  );
}

BfDsLiteTabs.Example = function BfDsLiteTabsExample() {
  const [controlledActiveTab, setControlledActiveTab] = React.useState("tab1");

  const basicTabs: Array<BfDsLiteTabItem> = [
    {
      id: "tab1",
      label: "Overview",
      icon: "autoframe",
      content: (
        <div style={{ padding: "20px" }}>
          <h3>Overview Content</h3>
          <p>
            This is the overview tab content. It provides a general summary of
            the application features and functionality.
          </p>
        </div>
      ),
    },
    {
      id: "tab2",
      label: "Settings",
      icon: "burgerMenu",
      content: (
        <div style={{ padding: "20px" }}>
          <h3>Settings Content</h3>
          <p>
            Configure your application settings here. Adjust preferences,
            themes, and other options.
          </p>
        </div>
      ),
    },
    {
      id: "tab3",
      label: "Analytics",
      icon: "arrowsLeftRight",
      disabled: true,
      content: (
        <div style={{ padding: "20px" }}>
          <h3>Analytics Content</h3>
          <p>View your analytics and performance metrics here.</p>
        </div>
      ),
    },
  ];

  const tabsWithSubtabs: Array<BfDsLiteTabItem> = [
    {
      id: "docs",
      label: "Documentation",
      icon: "brand-github",
      content: (
        <div style={{ padding: "20px" }}>
          Documentation main content
        </div>
      ),
      subtabs: [
        {
          id: "getting-started",
          label: "Getting Started",
          content: (
            <div style={{ padding: "20px" }}>
              <h3>Getting Started</h3>
              <p>
                Welcome to our documentation! Here's how to get started with the
                platform.
              </p>
              <ul>
                <li>Create an account</li>
                <li>Set up your first project</li>
                <li>Invite team members</li>
              </ul>
            </div>
          ),
        },
        {
          id: "api-reference",
          label: "API Reference",
          icon: "arrowRight",
          content: (
            <div style={{ padding: "20px" }}>
              <h3>API Reference</h3>
              <p>Complete API documentation with examples and code snippets.</p>
              <pre
                style={{
                  background: "#f5f5f5",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
{`GET /api/users
POST /api/users
PUT /api/users/:id
DELETE /api/users/:id`}
              </pre>
            </div>
          ),
        },
        {
          id: "examples",
          label: "Examples",
          content: (
            <div style={{ padding: "20px" }}>
              <h3>Code Examples</h3>
              <p>
                Real-world examples and use cases to help you implement features
                quickly.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: "support",
      label: "Support",
      icon: "brand-discord",
      content: <div style={{ padding: "20px" }}>Support main content</div>,
      subtabs: [
        {
          id: "faq",
          label: "FAQ",
          content: (
            <div style={{ padding: "20px" }}>
              <h3>Frequently Asked Questions</h3>
              <p>
                Find answers to commonly asked questions about our platform.
              </p>
            </div>
          ),
        },
        {
          id: "contact",
          label: "Contact Us",
          disabled: true,
          content: (
            <div style={{ padding: "20px" }}>
              <h3>Contact Support</h3>
              <p>
                Get in touch with our support team for personalized assistance.
              </p>
            </div>
          ),
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      icon: "arrowUp",
      content: (
        <div style={{ padding: "20px" }}>
          <h3>Account Management</h3>
          <p>Manage your account settings, billing, and profile information.</p>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        padding: "24px",
        backgroundColor: "var(--bfds-lite-background)",
        color: "var(--bfds-lite-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2>BfDsLiteTabs Examples</h2>

      <div style={{ marginBottom: "32px" }}>
        <h3>Basic Tabs</h3>
        <BfDsLiteTabs tabs={basicTabs} defaultActiveTab="tab1" />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Controlled Tabs</h3>
        <p
          style={{
            marginBottom: "16px",
            fontSize: "14px",
            color: "var(--bfds-lite-text-secondary)",
          }}
        >
          Active tab: {controlledActiveTab}
        </p>
        <BfDsLiteTabs
          tabs={basicTabs}
          activeTab={controlledActiveTab}
          onTabChange={setControlledActiveTab}
        />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Tabs with Subtabs</h3>
        <BfDsLiteTabs tabs={tabsWithSubtabs} defaultActiveTab="docs" />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Size Variants</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h4>Small</h4>
            <BfDsLiteTabs
              tabs={basicTabs.slice(0, 2)}
              size="small"
              defaultActiveTab="tab1"
            />
          </div>
          <div>
            <h4>Medium (Default)</h4>
            <BfDsLiteTabs
              tabs={basicTabs.slice(0, 2)}
              size="medium"
              defaultActiveTab="tab1"
            />
          </div>
          <div>
            <h4>Large</h4>
            <BfDsLiteTabs
              tabs={basicTabs.slice(0, 2)}
              size="large"
              defaultActiveTab="tab1"
            />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Variant Styles</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h4>Primary (Default)</h4>
            <BfDsLiteTabs
              tabs={basicTabs.slice(0, 2)}
              variant="primary"
              defaultActiveTab="tab1"
            />
          </div>
          <div>
            <h4>Secondary</h4>
            <BfDsLiteTabs
              tabs={basicTabs.slice(0, 2)}
              variant="secondary"
              defaultActiveTab="tab1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
