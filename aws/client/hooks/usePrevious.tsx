import { React } from "aws/client/deps.ts";

const { useEffect, useRef } = React;

export default function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
