import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when an optimistic lock cannot be used in query builder.
 */
export declare class OptimisticLockCanNotBeUsedError extends TypeORMError {
    constructor();
}
