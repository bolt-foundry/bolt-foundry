import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when transaction is not started yet and user tries to run commit or rollback.
 */
export declare class TransactionNotStartedError extends TypeORMError {
    constructor();
}
