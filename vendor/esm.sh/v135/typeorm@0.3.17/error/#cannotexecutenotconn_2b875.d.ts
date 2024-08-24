import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to execute operation allowed only if connection is opened.
 */
export declare class CannotExecuteNotConnectedError extends TypeORMError {
    constructor(connectionName: string);
}
