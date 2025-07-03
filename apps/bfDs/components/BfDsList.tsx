import * as React from "react";

type BfDsListProps = {
  /** List items (typically BfDsListItem components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** When true, only one item can be expanded at a time */
  accordion?: boolean;
};

type BfDsListContextType = {
  accordion: boolean;
  expandedIndex: number | null;
  setExpandedIndex: (index: number | null) => void;
  getItemIndex: (ref: React.RefObject<HTMLElement | null>) => number | null;
};

const BfDsListContext = React.createContext<BfDsListContextType | null>(null);

export function BfDsList(
  { children, className, accordion = false }: BfDsListProps,
) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);
  const listRef = React.useRef<HTMLUListElement>(null);

  const listClasses = [
    "bfds-list",
    accordion && "bfds-list--accordion",
    className,
  ].filter(Boolean).join(" ");

  const getItemIndex = React.useCallback(
    (ref: React.RefObject<HTMLElement | null>) => {
      if (!ref.current || !listRef.current) return null;

      const listItems = Array.from(listRef.current.children);
      const index = listItems.indexOf(ref.current);
      return index >= 0 ? index : null;
    },
    [],
  );

  const contextValue: BfDsListContextType = {
    accordion,
    expandedIndex,
    setExpandedIndex,
    getItemIndex,
  };

  return (
    <BfDsListContext.Provider value={contextValue}>
      <ul ref={listRef} className={listClasses}>
        {children}
      </ul>
    </BfDsListContext.Provider>
  );
}

export function useBfDsList() {
  const context = React.useContext(BfDsListContext);
  return context;
}
