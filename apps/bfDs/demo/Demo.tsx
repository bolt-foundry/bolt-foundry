import { useMemo, useState } from "react";
import { BfDsList } from "../components/BfDsList.tsx";
import { BfDsListItem } from "../components/BfDsListItem.tsx";
import { BfDsButtonExample } from "../components/__examples__/BfDsButton.example.tsx";
import { BfDsIconExample } from "../components/__examples__/BfDsIcon.example.tsx";
import { BfDsTabsExample } from "../components/__examples__/BfDsTabs.example.tsx";
import { BfDsFormExample } from "../components/__examples__/BfDsForm.example.tsx";
import { BfDsInputExample } from "../components/__examples__/BfDsInput.example.tsx";
import { BfDsTextAreaExample } from "../components/__examples__/BfDsTextArea.example.tsx";
import { BfDsFormSubmitButtonExample } from "../components/__examples__/BfDsFormSubmitButton.example.tsx";
import { BfDsListExample } from "../components/__examples__/BfDsList.example.tsx";
import { BfDsListItemExample } from "../components/__examples__/BfDsListItem.example.tsx";
import { BfDsSelectExample } from "../components/__examples__/BfDsSelect.example.tsx";
import { BfDsCheckboxExample } from "../components/__examples__/BfDsCheckbox.example.tsx";
import { BfDsRadioExample } from "../components/__examples__/BfDsRadio.example.tsx";
import { BfDsToggleExample } from "../components/__examples__/BfDsToggle.example.tsx";
import { BfDsCalloutExample } from "../components/__examples__/BfDsCallout.example.tsx";

type ComponentSection = {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType;
  category: "Core" | "Form" | "Navigation";
};

const componentSections: Array<ComponentSection> = [
  {
    id: "button",
    name: "Button",
    description: "Interactive buttons with variants, sizes, and icon support",
    component: BfDsButtonExample,
    category: "Core",
  },
  {
    id: "icon",
    name: "Icon",
    description: "SVG icons with customizable sizes and colors",
    component: BfDsIconExample,
    category: "Core",
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "Tab navigation with nested subtabs and keyboard support",
    component: BfDsTabsExample,
    category: "Navigation",
  },
  {
    id: "form",
    name: "Form",
    description: "Complete form system with context and validation",
    component: BfDsFormExample,
    category: "Form",
  },
  {
    id: "input",
    name: "Input",
    description: "Text inputs with states and dual-mode operation",
    component: BfDsInputExample,
    category: "Form",
  },
  {
    id: "textarea",
    name: "TextArea",
    description: "Multi-line text inputs with resize options",
    component: BfDsTextAreaExample,
    category: "Form",
  },
  {
    id: "submit-button",
    name: "Submit Button",
    description: "Form submission buttons with automatic integration",
    component: BfDsFormSubmitButtonExample,
    category: "Form",
  },
  {
    id: "list",
    name: "List",
    description: "Simple, clean lists with navigation patterns",
    component: BfDsListExample,
    category: "Navigation",
  },
  {
    id: "list-item",
    name: "List Item",
    description: "Individual list items with states and interactions",
    component: BfDsListItemExample,
    category: "Navigation",
  },
  {
    id: "select",
    name: "Select",
    description: "Dropdown selectors with form integration",
    component: BfDsSelectExample,
    category: "Form",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Checkboxes with form integration and accessibility",
    component: BfDsCheckboxExample,
    category: "Form",
  },
  {
    id: "radio",
    name: "Radio",
    description: "Radio button groups with flexible layouts",
    component: BfDsRadioExample,
    category: "Form",
  },
  {
    id: "toggle",
    name: "Toggle",
    description: "Toggle switches with smooth animations and sizes",
    component: BfDsToggleExample,
    category: "Form",
  },
  {
    id: "callout",
    name: "Callout",
    description: "Notification system with variants and auto-dismiss",
    component: BfDsCalloutExample,
    category: "Core",
  },
];

export function BfDsDemo() {
  const [activeSection, setActiveSection] = useState<string>("button");

  const categories = useMemo(() => {
    const categoryMap = new Map<string, Array<ComponentSection>>();
    componentSections.forEach((section) => {
      const existing = categoryMap.get(section.category) || [];
      categoryMap.set(section.category, [...existing, section]);
    });
    return categoryMap;
  }, []);

  const ActiveComponent =
    componentSections.find((s) => s.id === activeSection)?.component ||
    BfDsButtonExample;

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--bfds-background)",
        color: "var(--bfds-text)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: "300px",
          backgroundColor: "var(--bfds-background-hover)",
          borderRight: "1px solid var(--bfds-border)",
          padding: "24px 0",
          overflowY: "auto",
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <div style={{ padding: "0 24px", marginBottom: "32px" }}>
          <h1
            style={{ margin: "0 0 8px 0", fontSize: "24px", fontWeight: "600" }}
          >
            BfDs Demo
          </h1>
          <p
            style={{
              margin: 0,
              color: "var(--bfds-text-secondary)",
              fontSize: "14px",
            }}
          >
            Interactive examples of BfDs design system components
          </p>
        </div>

        {Array.from(categories.entries()).map(([categoryName, sections]) => (
          <div key={categoryName} style={{ marginBottom: "24px" }}>
            <h3
              style={{
                margin: "0 0 12px 0",
                padding: "0 24px",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "var(--bfds-text-muted)",
              }}
            >
              {categoryName}
            </h3>
            <BfDsList>
              {sections.map((section) => (
                <BfDsListItem
                  key={section.id}
                  active={activeSection === section.id}
                  onClick={() => setActiveSection(section.id)}
                  className="demo-sidebar-item"
                >
                  <div style={{ marginBottom: "4px" }}>{section.name}</div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: activeSection === section.id
                        ? "var(--bfds-background)"
                        : "var(--bfds-text-secondary)",
                      lineHeight: "1.3",
                    }}
                  >
                    {section.description}
                  </div>
                </BfDsListItem>
              ))}
            </BfDsList>
          </div>
        ))}
      </nav>

      {/* Main Content */}
      <main
        style={{
          flex: 1,
          overflowY: "auto",
          minWidth: 0, // Prevents flex item from growing beyond container
        }}
      >
        <ActiveComponent />
      </main>
    </div>
  );
}
