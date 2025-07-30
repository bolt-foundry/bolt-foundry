import type * as React from "react";

export type BfDsListBarProps = {
  /** Content for the left section (usually title and metadata) */
  left: React.ReactNode;
  /** Content for the center section (usually description) */
  center?: React.ReactNode;
  /** Content for the right section (usually actions and status) */
  right?: React.ReactNode;
  /** When true, shows active/selected state styling */
  active?: boolean;
  /** When true, shows hover state and makes clickable */
  clickable?: boolean;
  /** Click handler for the entire bar */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsListBar({
  left,
  center,
  right,
  active = false,
  clickable = false,
  onClick,
  className,
}: BfDsListBarProps) {
  const barClasses = [
    "bfds-list-bar",
    active && "bfds-list-bar--active",
    clickable && "bfds-list-bar--clickable",
    className,
  ].filter(Boolean).join(" ");

  const handleClick = (_e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={barClasses}
      onClick={clickable ? handleClick : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      tabIndex={clickable ? 0 : undefined}
      role={clickable ? "button" : undefined}
    >
      <div className="bfds-list-bar__left">
        {left}
      </div>
      {center && (
        <div className="bfds-list-bar__center">
          {center}
        </div>
      )}
      {right && (
        <div className="bfds-list-bar__right">
          {right}
        </div>
      )}
    </div>
  );
}
