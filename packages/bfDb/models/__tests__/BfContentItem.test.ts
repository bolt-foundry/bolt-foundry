
import { testBfNodeBase } from "packages/bfDb/classes/__tests__/BfNodeBaseTest.ts";
import { BfContentItem } from "packages/bfDb/models/BfContentItem.ts";
import type { BfNodeBase } from "packages/bfDb/classes/BfNodeBase.ts";

// Run the base node tests first to ensure it satisfies all the common behavior
testBfNodeBase(BfContentItem as typeof BfNodeBase);