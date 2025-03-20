import type { BfNodeBaseProps } from "packages/bfDb/classes/BfNodeBase.ts";
import { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

export type BfSectionProps = BfNodeBaseProps & {
  title: string;
  content: string;
  order: number;
};

export class BfSection extends BfNode<BfSectionProps> {}
