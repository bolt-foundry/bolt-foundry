import { React } from "aws/client/deps.ts";
const { useEffect } = React;

type Options = {
  isActive?: boolean;
  showConfirmation?: boolean;
  ignoreParent?: boolean;
  excludeElementIds?: string[];
};

const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  callback: () => void,
  {
    isActive = true,
    showConfirmation = false,
    ignoreParent = false,
    excludeElementIds = [],
  }: Options,
) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // ignore clicks on excluded elements
      const excludedElements = excludeElementIds.map((id) =>
        document.getElementById(id)
      );
      if (
        excludedElements.some((element) => element?.contains(target))
      ) {
        return;
      }

      // ignore clicks on parent element
      if (
        ignoreParent &&
        ref.current?.parentElement?.contains(target)
      ) {
        return;
      }

      if (
        isActive && ref.current &&
        !ref.current.contains(target)
      ) {
        if (showConfirmation) {
          if (confirm("You have unsaved changes. Close without saving?")) {
            callback();
          }
        } else {
          callback();
        }
        event.stopPropagation();
      }
    };

    if (isActive) {
      document.addEventListener("mousedown", handleClickOutside, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true);
    };
  }, [ref, callback, isActive, showConfirmation, excludeElementIds]);
};

export default useClickOutside;
