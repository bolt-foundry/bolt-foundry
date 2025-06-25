import * as React from "react";
import { classnames } from "@bfmono/lib/classnames.ts";
import { BfDsIcon } from "@bfmono/apps/bfDs/components/BfDsIcon.tsx";
import { BfDsListItem } from "@bfmono/apps/bfDs/components/BfDsListItem.tsx";
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

export function BfDsList(
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
      "BfDsList: A header is required when collapsible is true.",
    );
  }
  if (defaultCollapsed && !collapsible) {
    throw new BfError(
      "BfDsList: defaultCollapsed can only be used when colllapsible is true.",
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
                <BfDsIcon name="arrowDown" />
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
      <BfDsList header="List header">
        <BfDsListItem content="Item 1" />
        <BfDsListItem content="Item 2" expandedContent="Item 2 more content" />
        <BfDsListItem content="Item 3" iconRight="home" />
        <BfDsListItem
          content="Item 4 clickable"
          onClick={() => logger.log("clicked")}
        />
        <BfDsListItem
          content="Item 5"
          isHighlighted
          footer="Footer"
          toggle={() => logger.log("toggled")}
        />
      </BfDsList>
      <BfDsList header="List with separators" separator>
        <BfDsListItem content="Item 1" />
        <BfDsListItem content="Item 2" />
        <BfDsListItem content="Item 3" />
      </BfDsList>
      <BfDsList header="Collapsible" collapsible>
        <BfDsListItem content="Item 1" />
        <BfDsListItem content="Item 2" />
        <BfDsListItem content="Item 3" />
      </BfDsList>
      <BfDsList
        header="Default collapsed"
        collapsible
        defaultCollapsed
      >
        <BfDsListItem content="Item 1" />
        <BfDsListItem content="Item 2" />
        <BfDsListItem content="Item 3" />
      </BfDsList>
      <BfDsList
        header="Mutually Exclusive Expanding"
        mutuallyExclusive
      >
        <BfDsListItem
          content="Expandable Item 1"
          expandedContent={<div style={expandStyle}>Content for Item 1</div>}
        />
        <BfDsListItem
          content="Expandable Item 2"
          expandedContent={<div style={expandStyle}>Content for Item 2</div>}
        />
        <BfDsListItem
          content="Expandable Item 3"
          expandedContent={<div style={expandStyle}>Content for Item 3</div>}
        />
        <BfDsListItem
          content="Expandable Item 4"
          expandedContent={<div style={expandStyle}>Content for Item 4</div>}
        />
      </BfDsList>
    </div>
  );
}
