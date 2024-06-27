import { React } from "deps.ts";
import { Button } from "packages/bfDs/Button.tsx";
import { useCopyToClipboard } from "packages/bfDs/hooks/useCopyToClipboard.ts";
type Props = {
  textToCopy: string;
  buttonText?: string;
};
const { useState } = React;
export function CopyButton({ textToCopy, buttonText = "Copy" }: Props) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();
  const handleCopy = () => {
    copy(textToCopy);
    setCopied(true);
    globalThis.setTimeout(() => (setCopied(false)), 1000);
  };

  const text = copied ? "Copied!" : buttonText;

  return <Button kind="overlay" text={text} onClick={handleCopy} />;
}
