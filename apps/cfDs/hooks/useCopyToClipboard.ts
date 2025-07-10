// Adapted from https://usehooks-ts.com/react-hook/use-copy-to-clipboard
import * as React from "react";
const { useState } = React;
const logger = console;

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success
const useEffect = React.useEffect;
export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  useEffect(() => {
    setTimeout(() => {
      setCopiedText(null);
    }, 2000);
  }, [copiedText]);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      logger.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      logger.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}
