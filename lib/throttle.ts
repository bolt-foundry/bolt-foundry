export function throttle<T extends unknown[]>(
  func: (...args: T) => void,
  limit: number,
): (...args: T) => void {
  let lastFunc: ReturnType<typeof setTimeout> | null;
  let lastRan: number | null;

  return function (...args: T) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      if (lastFunc) clearTimeout(lastFunc);
      lastFunc = setTimeout(() => {
        if (Date.now() - (lastRan || 0) >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - (lastRan || 0)));
    }
  };
}
