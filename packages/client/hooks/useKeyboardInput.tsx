import * as React from "react";
const { useEffect } = React;

type Keybindings = {
  [key: string]: () => void;
};

type UseKeyboardInputParams = {
  keybindings: Keybindings;
  keyupBindings?: Keybindings;
  isActive?: boolean;
};

const useKeyboardInput = (
  { keybindings, keyupBindings, isActive = true }: UseKeyboardInputParams,
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActive) {
        return;
      }
      let key = event.key.toLowerCase();
      if (event.code === "Space") {
        key = "space";
      }
      const callback = keybindings[key];
      if (callback) {
        callback();
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (!isActive) return;
      const key = event.key.toLowerCase();
      const callback = keyupBindings?.[key];
      if (callback) {
        callback();
        event.preventDefault();
        event.stopPropagation();
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown, true); // true uses capture phase instead of bubbling phase
    globalThis.addEventListener("keyup", handleKeyUp, true);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown, true);
      globalThis.removeEventListener("keyup", handleKeyUp, true);
    };
  }, [keybindings, keyupBindings, isActive]);
};

export default useKeyboardInput;
