
import { BfNodeBase } from "packages/bfDb/classes/BfNodeBase.ts";
import type { BfNodeBaseProps } from "packages/bfDb/classes/BfNodeBase.ts";

export type BfContentItemProps = BfNodeBaseProps & {
  title: string;
  body: string;
  slug: string;
  filePath?: string;
  summary?: string;
  author?: string;
  cta?: string;
  href?: string;
};

export class BfContentItem extends BfNodeBase<BfContentItemProps> {
  // The implementation will be added later after passing the red test
  // For now, this is intentionally minimal to create a failing test
}
