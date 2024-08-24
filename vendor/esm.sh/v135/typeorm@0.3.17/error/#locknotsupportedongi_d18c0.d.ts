import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when selected sql driver does not supports locking.
 */
export declare class LockNotSupportedOnGivenDriverError extends TypeORMError {
    constructor();
}
