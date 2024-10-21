import type { React } from "packages/logger/logger.ts";
import { BfDsIcon, type BfDsIconType } from "packages/bfDs/BfDsIcon.tsx";
import { classnames } from "lib/classnames.ts";
import { BfDsToggle } from "packages/bfDs/BfDsToggle.tsx";

type Props = {
  content: string | React.ReactNode;
  iconRight?: BfDsIconType;
  isHighlighted?: boolean;
  footer?: string | React.ReactNode;
  onClick?: () => void;
  toggle?: () => void;
  toggled?: boolean;
};

export function ListItem(
  { content, iconRight, isHighlighted, footer, onClick, toggle, toggled }:
    Props,
) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }
  const clickable = typeof onClick === "function" && !isHighlighted;

  const listItemClasses = classnames([
    "list-item",
    { isHighlighted },
    { clickable },
  ]);

  return (
    <div className={listItemClasses} onClick={handleClick}>
      <div className="list-item-main">
        <div className="list-item-text">{content}</div>
        {footer && (
          <div className="list-item-meta">
            {footer}
          </div>
        )}
      </div>
      {iconRight && (
        <div className="list-item-right">
          <BfDsIcon name={iconRight} color="var(--textSecondary)" />
        </div>
      )}
      {toggle &&
        (
          <div className="list-item-toggle">
            <BfDsToggle value={!!toggled} onChange={toggle} />
          </div>
        )}
    </div>
  );
}
