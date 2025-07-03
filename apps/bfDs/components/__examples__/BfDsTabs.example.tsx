import * as React from "react";
import { type BfDsTabItem, BfDsTabs } from "../BfDsTabs.tsx";

export function BfDsTabsExample() {
  const [controlledActiveTab, setControlledActiveTab] = React.useState("tab1");

  const basicTabs: Array<BfDsTabItem> = [
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

  const tabsWithSubtabs: Array<BfDsTabItem> = [
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
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <h2>BfDsTabs Examples</h2>

      <div style={{ marginBottom: "32px" }}>
        <h3>Basic Tabs</h3>
        <BfDsTabs tabs={basicTabs} defaultActiveTab="tab1" />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Controlled Tabs</h3>
        <p
          style={{
            marginBottom: "16px",
            fontSize: "14px",
            color: "var(--bfds-text-secondary)",
          }}
        >
          Active tab: {controlledActiveTab}
        </p>
        <BfDsTabs
          tabs={basicTabs}
          activeTab={controlledActiveTab}
          onTabChange={setControlledActiveTab}
        />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Tabs with Subtabs</h3>
        <BfDsTabs tabs={tabsWithSubtabs} defaultActiveTab="docs" />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3>Size Variants</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h4>Small</h4>
            <BfDsTabs
              tabs={basicTabs.slice(0, 2)}
              size="small"
              defaultActiveTab="tab1"
            />
          </div>
          <div>
            <h4>Medium (Default)</h4>
            <BfDsTabs
              tabs={basicTabs.slice(0, 2)}
              size="medium"
              defaultActiveTab="tab1"
            />
          </div>
          <div>
            <h4>Large</h4>
            <BfDsTabs
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
            <BfDsTabs
              tabs={basicTabs.slice(0, 2)}
              variant="primary"
              defaultActiveTab="tab1"
            />
          </div>
          <div>
            <h4>Secondary</h4>
            <BfDsTabs
              tabs={basicTabs.slice(0, 2)}
              variant="secondary"
              defaultActiveTab="tab1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
