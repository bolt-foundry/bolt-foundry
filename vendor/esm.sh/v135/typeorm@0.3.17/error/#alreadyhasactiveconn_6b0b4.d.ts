import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to recreate connection with the same name, but previous connection was not closed yet.
 */
export declare class AlreadyHasActiveConnectionError extends TypeORMError {
    constructor(connectionName: string);
}
