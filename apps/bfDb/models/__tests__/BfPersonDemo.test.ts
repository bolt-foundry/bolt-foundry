import { getLogger } from "packages/logger/logger.ts";
import { testBfNodeBase } from "apps/bfDb/classes/__tests__/BfNodeBaseTest.ts";
import { BfPersonDemo } from "apps/bfDb/models/BfPersonDemo.ts";
import type { BfNode } from "apps/bfDb/coreModels/BfNode.ts";

const _logger = getLogger(import.meta);

// Run the standard node tests on our class
testBfNodeBase(BfPersonDemo as typeof BfNode);
