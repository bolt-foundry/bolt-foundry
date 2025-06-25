import * as React from "react";
import {
  type ButtonKind,
  CfDsButton,
} from "@bfmono/apps/cfDs/components/CfDsButton.tsx";
import { useCopyToClipboard } from "@bfmono/apps/cfDs/hooks/useCopyToClipboard.ts";
type Props = {
  textToCopy: string;
  buttonText?: string;
  kind?: ButtonKind;
};
const { useState } = React;
export function CfDsCopyButton(
  { textToCopy, buttonText = "Copy", kind = "dan" }: Props,
) {
  const [copied, setCopied] = useState(false);
  const [, copy] = useCopyToClipboard();
  const handleCopy = () => {
    copy(textToCopy);
    setCopied(true);
    globalThis.setTimeout(() => (setCopied(false)), 1000);
  };

  const text = copied ? "Copied!" : buttonText;

  return (
    <CfDsButton
      kind={copied ? "primary" : kind}
      text={text}
      onClick={handleCopy}
      xstyle={{ minWidth: 86 }}
    />
  );
}
