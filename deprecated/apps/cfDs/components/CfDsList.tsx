import * as React from "react";
import { classnames } from "@bfmono/lib/classnames.ts";
import { CfDsIcon } from "@bfmono/apps/cfDs/components/CfDsIcon.tsx";
import { CfDsListItem } from "@bfmono/apps/cfDs/components/CfDsListItem.tsx";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
const logger = getLogger(import.meta);
const BfError = Error;

type Props = {
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  header?: string;
  separator?: boolean;
  mutuallyExclusive?: boolean;
};

// Context for handling mutually exclusive expanding
export const ListItemExpandContext = React.createContext<{
  mutuallyExclusive: boolean;
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}>({
  mutuallyExclusive: false,
  activeItem: null,
  setActiveItem: () => {},
});

export function CfDsList(
  {
    children,
    collapsible,
    defaultCollapsed,
    header,
    separator,
    mutuallyExclusive = false,
  }: React.PropsWithChildren<Props>,
) {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed ?? false);
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  if (collapsible && !header) {
    throw new BfError(
      "CfDsList: A header is required when collapsible is true.",
    );
  }
  if (defaultCollapsed && !collapsible) {
    throw new BfError(
      "CfDsList: defaultCollapsed can only be used when colllapsible is true.",
    );
  }

  const listClasses = classnames([
    "list",
    { bottomSeparator: separator },
  ]);

  const expandClasses = classnames([
    "list-expandIcon",
    { collapsed },
  ]);

  const showContent = collapsible ? !collapsed : true;

  return (
    <div className={listClasses}>
      {header && (
        <div className="list-header">
          <div className="list-header-title">{header}</div>
          {collapsible && (
            <div
              className="list-header-toggle"
              onClick={() => setCollapsed(!collapsed)}
            >
              <div className={expandClasses}>
                <CfDsIcon name="arrowDown" />
              </div>
            </div>
          )}
        </div>
      )}
      <ListItemExpandContext.Provider
        value={{ mutuallyExclusive, activeItem, setActiveItem }}
      >
        {showContent && children}
      </ListItemExpandContext.Provider>
    </div>
  );
}

export function Example() {
  const expandStyle = {
    border: "1px solid var(--border)",
    borderRadius: 8,
    padding: "8px 12px",
    background: "var(--alwaysDark)",
    color: "var(--alwaysLight)",
  };
  return (
    <div className="flexColumn gapLarge">
      <CfDsList header="List header">
        <CfDsListItem content="Item 1" />
        <CfDsListItem content="Item 2" expandedContent="Item 2 more content" />
        <CfDsListItem content="Item 3" iconRight="home" />
        <CfDsListItem
          content="Item 4 clickable"
          onClick={() => logger.log("clicked")}
        />
        <CfDsListItem
          content="Item 5"
          isHighlighted
          footer="Footer"
          toggle={() => logger.log("toggled")}
        />
      </CfDsList>
      <CfDsList header="List with separators" separator>
        <CfDsListItem content="Item 1" />
        <CfDsListItem content="Item 2" />
        <CfDsListItem content="Item 3" />
      </CfDsList>
      <CfDsList header="Collapsible" collapsible>
        <CfDsListItem content="Item 1" />
        <CfDsListItem content="Item 2" />
        <CfDsListItem content="Item 3" />
      </CfDsList>
      <CfDsList
        header="Default collapsed"
        collapsible
        defaultCollapsed
      >
        <CfDsListItem content="Item 1" />
        <CfDsListItem content="Item 2" />
        <CfDsListItem content="Item 3" />
      </CfDsList>
      <CfDsList
        header="Mutually Exclusive Expanding"
        mutuallyExclusive
      >
        <CfDsListItem
          content="Expandable Item 1"
          expandedContent={<div style={expandStyle}>Content for Item 1</div>}
        />
        <CfDsListItem
          content="Expandable Item 2"
          expandedContent={<div style={expandStyle}>Content for Item 2</div>}
        />
        <CfDsListItem
          content="Expandable Item 3"
          expandedContent={<div style={expandStyle}>Content for Item 3</div>}
        />
        <CfDsListItem
          content="Expandable Item 4"
          expandedContent={<div style={expandStyle}>Content for Item 4</div>}
        />
      </CfDsList>
    </div>
  );
}
