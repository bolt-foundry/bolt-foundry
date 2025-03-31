import { getLogger } from "packages/logger/logger.ts";
import { BfNode } from "apps/bfDb/coreModels/BfNode.ts";

const _logger = getLogger(import.meta);

export type BfAccountProps = {
  name: string;
};

export class BfAccount extends BfNode<BfAccountProps> {}
