import type * as React from "react";

type BfDsListProps = {
  /** List items (typically BfDsListItem components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

export function BfDsList({ children, className }: BfDsListProps) {
  const listClasses = [
    "bfds-list",
    className,
  ].filter(Boolean).join(" ");

  return (
    <ul className={listClasses}>
      {children}
    </ul>
  );
}
