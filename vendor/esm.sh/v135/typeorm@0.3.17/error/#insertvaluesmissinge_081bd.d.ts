import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when user tries to insert using QueryBuilder but do not specify what to insert.
 */
export declare class InsertValuesMissingError extends TypeORMError {
    constructor();
}
