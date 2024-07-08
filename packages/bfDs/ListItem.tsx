import { React } from "deps.ts";
import { Icon } from "packages/bfDs/Icon.tsx";

type Props = {
  content: string | React.ReactNode;
  footer?: string | React.ReactNode;
  onClick?: () => void;
};

export function ListItem({ content, footer, onClick }: Props) {
  function handleClick() {
    if (onClick) {
      onClick();
    }
  }

  return (
    <div className="list-item" onClick={handleClick}>
      <div className="list-item-main">
        <div className="list-item-text">{content}</div>
        {footer && (
          <div className="list-item-meta">
            {footer}
          </div>
        )}
      </div>
      {onClick && (
        <div className="list-item-right">
          <Icon name="arrowRight" color="var(--textSecondary)" />
        </div>
      )}
    </div>
  );
}
