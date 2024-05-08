import { isBrowser, React } from "deps.ts";

const { useState } = React;

type SetValue<T> = React.Dispatch<React.SetStateAction<T>>;

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, SetValue<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (isBrowser()) { // disable on server side
        // Get from local storage by key
        const item = window.localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      } else {
        return initialValue;
      }
    } catch (error) {
      // If error also return initialValue
      // deno-lint-ignore no-console
      console.log(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue: SetValue<T> = (value) => {
    try {
      if (isBrowser()) { // disable on server side
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function
          ? value(storedValue)
          : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      } else {
        setStoredValue(value);
      }
    } catch (error) {
      // A more advanced implementation would handle the error case
      // deno-lint-ignore no-console
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
