import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when transaction is already started and user tries to run it again.
 */
export declare class TransactionAlreadyStartedError extends TypeORMError {
    constructor();
}
