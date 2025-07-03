import * as React from "react";
import { BfDsIcon } from "./BfDsIcon.tsx";
import { useBfDsList } from "./BfDsList.tsx";

export type BfDsListItemProps = {
  /** Content to display in the list item */
  children: React.ReactNode;
  /** When true, shows active state styling */
  active?: boolean;
  /** When true, disables interaction and shows disabled styling */
  disabled?: boolean;
  /** Click handler - when provided, renders as button instead of li */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Content to show when expanded - makes item expandable if provided */
  expandContents?: React.ReactNode;
};

export function BfDsListItem({
  children,
  active = false,
  disabled = false,
  onClick,
  className,
  expandContents,
}: BfDsListItemProps) {
  const [localIsExpanded, setLocalIsExpanded] = React.useState(false);
  const listContext = useBfDsList();
  const itemRef = React.useRef<HTMLLIElement>(null);
  const [listIndex, setListIndex] = React.useState<number | null>(null);
  const isExpandable = !!expandContents;

  // Get the item index from the list context after mounting
  React.useEffect(() => {
    if (listContext && itemRef.current) {
      const index = listContext.getItemIndex(itemRef);
      setListIndex(index);
    }
  }, [listContext]);

  // Use accordion state if available, otherwise use local state
  const isExpanded = listContext?.accordion && typeof listIndex === "number"
    ? listContext.expandedIndex === listIndex
    : localIsExpanded;

  const itemClasses = [
    "bfds-list-item",
    active && "bfds-list-item--active",
    disabled && "bfds-list-item--disabled",
    (onClick || isExpandable) && !disabled && "bfds-list-item--clickable",
    isExpandable && "bfds-list-item--expandable",
    isExpanded && "bfds-list-item--expanded",
    onClick && isExpandable && "bfds-list-item--has-separate-expand",
    className,
  ].filter(Boolean).join(" ");

  const handleExpandClick = () => {
    if (disabled) return;

    if (listContext?.accordion && typeof listIndex === "number") {
      // Accordion mode: toggle via context
      listContext.setExpandedIndex(isExpanded ? null : listIndex);
    } else {
      // Independent mode: toggle local state
      setLocalIsExpanded(!localIsExpanded);
    }
  };

  const handleMainClick = () => {
    if (disabled) return;
    if (onClick) {
      onClick();
    }
  };

  const element = onClick && !disabled ? "button" : "li";
  const buttonProps = element === "button"
    ? {
      type: "button" as const,
      onClick: handleMainClick,
    }
    : {};

  const mainContent = (
    <div className="bfds-list-item__content">
      <div className="bfds-list-item__main">
        {children}
      </div>
      {isExpandable && (
        <div className="bfds-list-item__icon">
          <BfDsIcon
            name={isExpanded ? "arrowDown" : "arrowLeft"}
            size="small"
          />
        </div>
      )}
    </div>
  );

  const expandedContent = isExpandable && isExpanded && expandContents && (
    <div className="bfds-list-item__expanded-content">
      {expandContents}
    </div>
  );

  // For expandable items, we need a wrapper li to contain both the button and expanded content
  if (isExpandable) {
    return (
      <li ref={itemRef} className={itemClasses}>
        <button
          type="button"
          className="bfds-list-item__button"
          onClick={onClick ? handleMainClick : handleExpandClick}
          disabled={disabled}
        >
          {onClick
            ? (
              // If there's an onClick, show content without expand icon since expansion will be via separate trigger
              <div className="bfds-list-item__content">
                <div className="bfds-list-item__main">
                  {children}
                </div>
              </div>
            )
            : mainContent}
        </button>
        {onClick && (
          // Separate expand button when there's also an onClick
          <button
            type="button"
            className="bfds-list-item__expand-button"
            onClick={handleExpandClick}
            disabled={disabled}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <BfDsIcon
              name={isExpanded ? "arrowDown" : "arrowLeft"}
              size="small"
            />
          </button>
        )}
        {expandedContent}
      </li>
    );
  }

  // For non-expandable items, use the original structure
  return React.createElement(
    element,
    {
      ref: itemRef,
      className: itemClasses,
      ...buttonProps,
    },
    mainContent,
  );
}
