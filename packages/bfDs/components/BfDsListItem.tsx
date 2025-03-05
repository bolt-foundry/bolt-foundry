import { forwardRef, useImperativeHandle, useState } from "react";
import {
  BfDsIcon,
  type BfDsIconType,
} from "packages/bfDs/components/BfDsIcon.tsx";
import { classnames } from "lib/classnames.ts";
import { BfDsToggle } from "packages/bfDs/components/BfDsToggle.tsx";

export type BfDsListItemHandle = {
  setExpand: (value: boolean) => void;
  isExpanded: () => boolean;
};

type Props = {
  action?: React.ReactNode;
  content: string | React.ReactNode;
  expandedContent?: React.ReactNode;
  expandCallback?: (newExpandingState?: boolean) => void;
  iconLeft?: BfDsIconType;
  iconLeftColor?: string;
  iconRight?: BfDsIconType;
  isHighlighted?: boolean;
  footer?: string | React.ReactNode;
  onDoubleClick?: () => void;
  onClick?: () => void;
  toggle?: () => void;
  toggled?: boolean;
  xstyle?: React.CSSProperties;
};

export const BfDsListItem = forwardRef<BfDsListItemHandle, Props>(
  (
    {
      action,
      content,
      expandedContent,
      expandCallback,
      iconLeft,
      iconLeftColor,
      iconRight,
      isHighlighted,
      footer,
      onClick,
      onDoubleClick,
      toggle,
      toggled,
      xstyle,
    },
    ref,
  ) => {
    const [expand, setExpand] = useState(false);

    useImperativeHandle(ref, () => ({
      setExpand: (value: boolean) => {
        setExpand(value);
        expandCallback?.(value);
      },
      isExpanded: () => expand,
    }));

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
      if ((e.target as HTMLElement).closest(".ignore-internal-click")) {
        return;
      }
      const currendExpandedState = expand;
      if (expandedContent) {
        setExpand(!currendExpandedState);
        expandCallback?.(!currendExpandedState);
      }
      if (onClick) {
        onClick();
      }
    }
    const clickable = (typeof onClick === "function" && !isHighlighted) ||
      expandedContent != null;

    const listItemRowClasses = classnames([
      "list-item-row",
      { isHighlighted },
      { clickable },
    ]);

    return (
      <div
        className="list-item"
        style={xstyle}
        onClick={(e) => handleClick(e)}
        onDoubleClick={onDoubleClick}
      >
        <div className={listItemRowClasses}>
          {iconLeft && (
            <div className="list-item-icon">
              <BfDsIcon
                name={iconLeft}
                color={iconLeftColor ?? "var(--textSecondary)"}
              />
            </div>
          )}

          <div className="list-item-main">
            <div className="list-item-text">{content}</div>
            {footer && (
              <div className="list-item-meta">
                {footer}
              </div>
            )}
          </div>
          {expandedContent && (
            <div className="list-item-icon">
              <BfDsIcon
                name={expand ? "arrowUp" : "arrowDown"}
                color="var(--textSecondary)"
              />
            </div>
          )}
          {iconRight && !expandedContent && (
            <div className="list-item-icon">
              <BfDsIcon name={iconRight} color="var(--textSecondary)" />
            </div>
          )}
          {toggle && (
            <div className="list-item-toggle">
              <BfDsToggle value={!!toggled} onChange={toggle} />
            </div>
          )}
          {action && (
            <div className="list-item-action ignore-internal-click">
              {action}
            </div>
          )}
        </div>
        {expandedContent && expand && (
          <div className="list-item-expanded ignore-internal-click">
            {expandedContent}
          </div>
        )}
      </div>
    );
  },
);
