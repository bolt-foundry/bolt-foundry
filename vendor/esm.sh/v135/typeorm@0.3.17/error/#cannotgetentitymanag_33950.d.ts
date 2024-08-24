import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to access entity manager before connection is established.
 */
export declare class CannotGetEntityManagerNotConnectedError extends TypeORMError {
    constructor(connectionName: string);
}
