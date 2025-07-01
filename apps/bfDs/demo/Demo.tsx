import * as React from "react";
import { BfDsButton } from "../components/BfDsButton.tsx";
import { BfDsIcon } from "../components/BfDsIcon.tsx";
import { BfDsTabs } from "../components/BfDsTabs.tsx";
import { BfDsForm } from "../components/BfDsForm.tsx";
import { BfDsInput } from "../components/BfDsInput.tsx";
import { BfDsTextArea } from "../components/BfDsTextArea.tsx";
import { BfDsFormSubmitButton } from "../components/BfDsFormSubmitButton.tsx";

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
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                style={{
                  width: "100%",
                  padding: "12px 24px",
                  border: "none",
                  background: activeSection === section.id
                    ? "var(--bfds-primary)"
                    : "transparent",
                  color: activeSection === section.id
                    ? "var(--bfds-background)"
                    : "var(--bfds-text)",
                  textAlign: "left",
                  cursor: "pointer",
                  borderLeft: activeSection === section.id
                    ? "3px solid var(--bfds-primary)"
                    : "3px solid transparent",
                  transition: "all 0.2s ease-in-out",
                  fontSize: "14px",
                  fontWeight: activeSection === section.id ? "500" : "400",
                }}
                onMouseEnter={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor =
                      "var(--bfds-background-active)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeSection !== section.id) {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }
                }}
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
              </button>
            ))}
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
