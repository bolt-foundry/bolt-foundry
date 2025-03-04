import { getLogger } from "packages/logger.ts";
import { testBfNodeBase } from "packages/bfDb/classes/__tests__/BfNodeBaseTest.ts";
import { BfPersonDemo } from "packages/bfDb/models/BfPersonDemo.ts";
import type { BfNode } from "packages/bfDb/coreModels/BfNode.ts";

const _logger = getLogger(import.meta);

// Run the standard node tests on our class
testBfNodeBase(BfPersonDemo as typeof BfNode);
