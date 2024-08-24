import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when a transaction is required for the current operation, but there is none open.
 */
export declare class PessimisticLockTransactionRequiredError extends TypeORMError {
    constructor();
}
