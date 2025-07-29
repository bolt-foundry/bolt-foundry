import type * as React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type BfDsListProps = {
  /** List items (typically BfDsListItem components) */
  children: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** When true, only one item can be expanded at a time */
  accordion?: boolean;
  /** Optional header text to display above the list */
  header?: string;
};

type BfDsListContextType = {
  accordion: boolean;
  expandedIndex: number | null;
  setExpandedIndex: (index: number | null) => void;
  getItemIndex: (ref: React.RefObject<HTMLElement | null>) => number | null;
};

const BfDsListContext = createContext<BfDsListContextType | null>(null);

export function BfDsList(
  { children, className, accordion = false, header }: BfDsListProps,
) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listClasses = [
    "bfds-list",
    accordion && "bfds-list--accordion",
    className,
  ].filter(Boolean).join(" ");

  const getItemIndex = useCallback(
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
        {header && <h3 className="bfds-list-header">{header}</h3>}
        {children}
      </ul>
    </BfDsListContext.Provider>
  );
}

export function useBfDsList() {
  const context = useContext(BfDsListContext);
  return context;
}
