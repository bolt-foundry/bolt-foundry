import { React } from "deps.ts";
const { useEffect } = React;

type Keybindings = {
  [key: string]: () => void;
};

const useKeyboardInput = (keybindings: Keybindings, isActive = true) => {
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

    globalThis.addEventListener("keydown", handleKeyDown, true); // true uses capture phase instead of bubbling phase

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown, true);
    };
  }, [keybindings, isActive]);
};

export default useKeyboardInput;
