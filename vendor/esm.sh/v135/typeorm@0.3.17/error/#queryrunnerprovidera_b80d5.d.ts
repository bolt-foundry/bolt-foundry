import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to use query runner from query runner provider after it was released.
 */
export declare class QueryRunnerProviderAlreadyReleasedError extends TypeORMError {
    constructor();
}
