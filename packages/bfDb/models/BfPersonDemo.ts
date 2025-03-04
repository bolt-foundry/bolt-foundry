import { getLogger } from "packages/logger.ts";
import { BfPerson } from "packages/bfDb/models/BfPerson.ts";
import type { BfCurrentViewer } from "packages/bfDb/classes/BfCurrentViewer.ts";
import { BfOrganization } from "packages/bfDb/models/BfOrganization.ts";

const logger = getLogger(import.meta);

export class BfPersonDemo extends BfPerson {
}
