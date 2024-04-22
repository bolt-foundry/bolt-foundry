import { BfDbError } from "packages/bfDb/classes/BfDbError.ts";
export class BfModelError extends BfDbError {}
export class BfModelErrorNotImplemented extends BfModelError {}
export class BfModelErrorNotFound extends BfModelError {}
export class BfModelErrorPermission extends BfModelError {}
