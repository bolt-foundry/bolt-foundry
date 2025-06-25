import { useState } from "react";
import { classnames } from "@bfmono/lib/classnames.ts";
import {
  type ButtonKind,
  type ButtonSizeType,
  CfDsButton,
} from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { CfDsButtonGroup } from "@bfmono/apps/cfDs/components/CfDsButtonGroup.tsx";
import { CfDsButtonConfirmation } from "@bfmono/apps/cfDs/components/CfDsButtonConfirmation.tsx";
import { CfDsCopyButton } from "@bfmono/apps/cfDs/components/CfDsCopyButton.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import type { CfDsIconType } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";

const logger = getLogger(import.meta);

// Define all button kinds for dynamic creation
const ALL_BUTTON_KINDS: Array<ButtonKind> = [
  "primary",
  "secondary",
  "alert",
  "success",
  "filled",
  "filledSecondary",
  "filledAlert",
  "filledSuccess",
  "outline",
  "outlineDark",
  "outlineAlert",
  "outlineSuccess",
  "overlay",
  "overlayDark",
  "overlaySuccess",
  "accent",
  "gradientOverlay",
  "dan",
];

// Define all button sizes
const ALL_BUTTON_SIZES: Array<ButtonSizeType> = [
  "xlarge",
  "large",
  "medium",
  "small",
];

// Common icons to demonstrate
const COMMON_ICONS: Array<CfDsIconType> = [
  "pencil",
  "download",
  "check",
  "cross",
  "plus",
  "settings",
  "star",
  "starSolid",
  "home",
  "brand-tiktok",
];

// Dynamic button generation helper
const generateButtons = (options: {
  withText?: boolean;
  withIcon?: boolean;
  kinds?: Array<ButtonKind>;
  sizes?: Array<ButtonSizeType>;
  withProgress?: boolean;
  withSpinner?: boolean;
  withSubtext?: boolean;
}) => {
  const kinds = options.kinds || ALL_BUTTON_KINDS;
  const sizes = options.sizes || ["large"];
  const result = [];

  type Props = {
    kind: ButtonKind;
    size: ButtonSizeType;
    text?: string;
    subtext?: string;
    iconLeft?: CfDsIconType;
    progress?: number;
    showSpinner?: boolean;
  };

  for (const kind of kinds) {
    for (const size of sizes) {
      // Skip dark variants in non-dark mode sections
      if (!options.withText && !options.withIcon) continue;

      const props: Props = {
        kind,
        size,
      };

      let name = `${kind}/${size}`;

      if (options.withText) {
        props.text = `${kind}`;
        name = `Button ${name}`;

        if (options.withSubtext) {
          props.subtext = "Subtext";
          name += " with subtext";
        }
      } else {
        name = `Icon ${name}`;
      }

      if (options.withIcon) {
        const iconIndex = kinds.indexOf(kind) % COMMON_ICONS.length;
        props.iconLeft = COMMON_ICONS[iconIndex];

        if (options.withText) {
          name += " with icon";
        }
      }

      if (options.withProgress) {
        props.progress = 45;
        name += " + progress";
      } else if (options.withSpinner) {
        props.showSpinner = true;
        name += " + spinner";
      }

      result.push({
        name,
        component: (
          <CfDsButton
            {...props}
            onClick={() => logger.debug(`Clicked: ${name}`)}
          />
        ),
      });
    }
  }

  return result;
};

// Generate specialized button examples
const generateSpecialButtons = () => [
  {
    name: "Disabled button",
    component: <CfDsButton text="Disabled" disabled />,
  },
  {
    name: "Button with link",
    component: <CfDsButton text="Link Button" kind="outline" link="/" />,
  },
  {
    name: "Button with href",
    component: <CfDsButton text="Href Button" kind="outline" href="#" />,
  },
  {
    name: "Button with shadow",
    component: <CfDsButton text="Shadow" shadow />,
  },
  {
    name: "Button with tooltip",
    component: (
      <CfDsButton
        text="Tooltip"
        tooltip="This is a tooltip"
        tooltipPosition="top"
      />
    ),
  },
  {
    name: "Button with menu",
    component: (
      <CfDsButton
        text="Menu"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => logger.debug("Menu 1") },
          { label: "Menu Item 2", onClick: () => logger.debug("Menu 2") },
          { label: "Menu Item 3", onClick: () => logger.debug("Menu 3") },
        ]}
        tooltipPosition="bottom"
        tooltipJustification="end"
      />
    ),
  },
  {
    name: "Icon with menu",
    component: (
      <CfDsButton
        iconLeft="kebabMenu"
        kind="overlay"
        tooltipMenu={[
          { label: "Menu Item 1", onClick: () => logger.debug("Menu 1") },
          { label: "Menu Item 2", onClick: () => logger.debug("Menu 2") },
          { label: "Menu Item 3", onClick: () => logger.debug("Menu 3") },
        ]}
        tooltipPosition="bottom"
        tooltipJustification="end"
      />
    ),
  },
  {
    name: "Button with dropdown menu",
    component: (
      <CfDsButton
        text="Dropdown"
        tooltipMenuDropdown={[
          { label: "Dropdown 1", onClick: () => logger.debug("Dropdown 1") },
          { label: "Dropdown 2", onClick: () => logger.debug("Dropdown 2") },
          { label: "Dropdown 3", onClick: () => logger.debug("Dropdown 3") },
        ]}
        tooltipPosition="bottom"
        tooltipJustification="start"
      />
    ),
  },
  {
    name: "Button with confirmation",
    component: (
      <CfDsButtonConfirmation
        icon="trash"
        onConfirm={() => logger.debug("Confirmed")}
      />
    ),
  },
  {
    name: "Button with copy",
    component: (
      <CfDsCopyButton
        buttonText="Copy Text"
        textToCopy="This text was copied"
      />
    ),
  },
  {
    name: "Button group",
    component: (
      <CfDsButtonGroup
        buttons={[
          <CfDsButton text="Left" kind="secondary" key="left" />,
          <CfDsButton text="Middle" kind="primary" key="middle" />,
          <CfDsButton text="Right" kind="secondary" key="right" />,
        ]}
      />
    ),
  },
];

export function Buttons() {
  const [showAll, setShowAll] = useState(false);

  // Create button groups
  const buttonGroups = [
    {
      name: "Text Buttons",
      elements: generateButtons({
        withText: true,
        kinds: showAll
          ? ALL_BUTTON_KINDS
          : ["primary", "secondary", "alert", "success", "outline"],
      }),
    },
    {
      name: "Size Variations",
      elements: ALL_BUTTON_SIZES.map((size, index) => ({
        name: `${size} size`,
        component: (
          <>
            <CfDsButton text={`${size}`} size={size} />
            <CfDsButton
              kind="secondary"
              iconLeft={COMMON_ICONS[index % COMMON_ICONS.length]}
              size={size}
            />
          </>
        ),
      })),
    },
    {
      name: "Icon Buttons",
      elements: generateButtons({
        withIcon: true,
        withText: false,
        kinds: showAll
          ? ALL_BUTTON_KINDS
          : ["primary", "secondary", "alert", "success", "outline"],
      }),
    },
    {
      name: "Text + Icon Buttons",
      elements: generateButtons({
        withText: true,
        withIcon: true,
        kinds: showAll ? ALL_BUTTON_KINDS : ["primary", "secondary", "outline"],
        sizes: showAll ? ALL_BUTTON_SIZES : ["large"],
      }),
    },
    {
      name: "Progress & Spinner",
      elements: [
        ...generateButtons({
          withText: true,
          withProgress: true,
          kinds: ["primary", "secondary", "success"],
        }),
        ...generateButtons({
          withIcon: true,
          withProgress: true,
          kinds: ["primary", "alert", "success"],
        }),
        ...generateButtons({
          withText: true,
          withSpinner: true,
          kinds: ["primary", "secondary", "success"],
        }),
        ...generateButtons({
          withIcon: true,
          withSpinner: true,
          kinds: ["primary", "alert", "success"],
        }),
      ],
    },
    {
      name: "Special Buttons",
      elements: generateSpecialButtons(),
    },
    {
      name: "Dark Mode Buttons",
      elements: generateButtons({
        withText: true,
        withIcon: true,
        kinds: ["outlineDark", "overlayDark"],
        sizes: ["large", "medium"],
      }),
      dark: true,
    },
  ];

  return (
    <>
      <div className="ui-section">
        <h2>Button Demo</h2>
        <div className="flexRow gapMedium" style={{ marginBottom: 20 }}>
          <CfDsButton
            text={showAll ? "Show Common Buttons" : "Show All Buttons"}
            kind="outline"
            onClick={() => setShowAll(!showAll)}
          />
        </div>
      </div>

      {buttonGroups.map((group, index) => {
        const sectionClasses = classnames([
          "ui-section",
          { "dark": group.dark },
        ]);

        return (
          <div className={sectionClasses} key={index}>
            <h2>{group.name}</h2>
            <div className="ui-group">
              {group.elements.map((element, elementIndex) => (
                <div key={elementIndex} className="flexColumn">
                  <div
                    style={{
                      marginBottom: 5,
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    {element.component}
                  </div>
                  <div
                    className="text-xs text-muted"
                    style={{ fontSize: 10, color: "var(--textSecondary)" }}
                  >
                    {element.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
