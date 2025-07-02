import * as React from "react";
import { BfDsButton } from "../components/BfDsButton.tsx";
import { BfDsIcon } from "../components/BfDsIcon.tsx";
import { BfDsTabs } from "../components/BfDsTabs.tsx";
import { BfDsForm } from "../components/BfDsForm.tsx";
import { BfDsInput } from "../components/BfDsInput.tsx";
import { BfDsTextArea } from "../components/BfDsTextArea.tsx";
import { BfDsFormSubmitButton } from "../components/BfDsFormSubmitButton.tsx";
import { BfDsList } from "../components/BfDsList.tsx";
import { BfDsListItem } from "../components/BfDsListItem.tsx";
import { BfDsSelect } from "../components/BfDsSelect.tsx";
import { BfDsCheckbox } from "../components/BfDsCheckbox.tsx";
import { BfDsRadio } from "../components/BfDsRadio.tsx";
import { BfDsToggle } from "../components/BfDsToggle.tsx";

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
    component: BfDsButton.Example,
    category: "Core",
  },
  {
    id: "icon",
    name: "Icon",
    description: "SVG icons with customizable sizes and colors",
    component: BfDsIcon.Example,
    category: "Core",
  },
  {
    id: "tabs",
    name: "Tabs",
    description: "Tab navigation with nested subtabs and keyboard support",
    component: BfDsTabs.Example,
    category: "Navigation",
  },
  {
    id: "form",
    name: "Form",
    description: "Complete form system with context and validation",
    component: BfDsForm.Example,
    category: "Form",
  },
  {
    id: "input",
    name: "Input",
    description: "Text inputs with states and dual-mode operation",
    component: BfDsInput.Example,
    category: "Form",
  },
  {
    id: "textarea",
    name: "TextArea",
    description: "Multi-line text inputs with resize options",
    component: BfDsTextArea.Example,
    category: "Form",
  },
  {
    id: "submit-button",
    name: "Submit Button",
    description: "Form submission buttons with automatic integration",
    component: BfDsFormSubmitButton.Example,
    category: "Form",
  },
  {
    id: "list",
    name: "List",
    description: "Simple, clean lists with navigation patterns",
    component: BfDsList.Example,
    category: "Navigation",
  },
  {
    id: "list-item",
    name: "List Item",
    description: "Individual list items with states and interactions",
    component: BfDsListItem.Example,
    category: "Navigation",
  },
  {
    id: "select",
    name: "Select",
    description: "Dropdown selectors with form integration",
    component: BfDsSelect.Example,
    category: "Form",
  },
  {
    id: "checkbox",
    name: "Checkbox",
    description: "Checkboxes with form integration and accessibility",
    component: BfDsCheckbox.Example,
    category: "Form",
  },
  {
    id: "radio",
    name: "Radio",
    description: "Radio button groups with flexible layouts",
    component: BfDsRadio.Example,
    category: "Form",
  },
  {
    id: "toggle",
    name: "Toggle",
    description: "Toggle switches with smooth animations and sizes",
    component: BfDsToggle.Example,
    category: "Form",
  },
];

export function BfDsDemo() {
  const [activeSection, setActiveSection] = React.useState<string>("button");

  const categories = React.useMemo(() => {
    const categoryMap = new Map<string, Array<ComponentSection>>();
    componentSections.forEach((section) => {
      const existing = categoryMap.get(section.category) || [];
      categoryMap.set(section.category, [...existing, section]);
    });
    return categoryMap;
  }, []);

  const ActiveComponent =
    componentSections.find((s) => s.id === activeSection)?.component ||
    BfDsButton.Example;

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
