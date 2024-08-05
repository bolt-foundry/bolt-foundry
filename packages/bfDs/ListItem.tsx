import { React } from "deps.ts";
import { Icon, IconType } from "packages/bfDs/Icon.tsx";
import { classnames } from "lib/classnames.ts";

type Props = {
  content: string | React.ReactNode;
  iconRight?: IconType;
  isHighlighted?: boolean;
  footer?: string | React.ReactNode;
  onClick?: () => void;
};

export function ListItem(
  { content, iconRight, isHighlighted, footer, onClick }: Props,
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
          <Icon name={iconRight} color="var(--textSecondary)" />
        </div>
      )}
    </div>
  );
}
