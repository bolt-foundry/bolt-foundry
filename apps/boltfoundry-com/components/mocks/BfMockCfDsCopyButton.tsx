import { BfDsButton } from "@bfmono/apps/bfDs/index.ts";

type BfMockCfDsCopyButtonProps = {
  textToCopy: string;
  "aria-label"?: string;
};

export function BfMockCfDsCopyButton({
  textToCopy,
  "aria-label": ariaLabel,
}: BfMockCfDsCopyButtonProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
  };

  return (
    <BfDsButton
      variant="secondary"
      size="small"
      onClick={handleCopy}
      aria-label={ariaLabel || "Copy to clipboard"}
    >
      <span className="icon-copy" />
    </BfDsButton>
  );
}
