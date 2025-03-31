import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";
import { getLogger } from "packages/logger/logger.ts";

const _logger = getLogger(import.meta);

export type BfBrandBookProps = {
  littleGoldenBook: string;
  goodExamples: Array<string>;
  badExamples: Array<string>;
};
export class BfBrandBook extends BfNode<BfBrandBookProps> {
}
