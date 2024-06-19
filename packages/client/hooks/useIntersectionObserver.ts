import { React } from "deps.ts";
const { useEffect, useState, useRef } = React;

export const useIntersectionObserver = (threshold = 0.01) => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);
  const domRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        setIsVisible(entry.intersectionRatio >= threshold);
      });

    }, { threshold });

    const currentDomRef = domRef.current;
    if (currentDomRef) {
      observer.observe(currentDomRef);
    }

    return () => {
      if (currentDomRef) {
        observer.unobserve(currentDomRef);
        observer.disconnect();
      }
    };
  }, []);

  return { isVisible, domRef };
};
