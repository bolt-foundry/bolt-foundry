import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to get connection that does not exist.
 */
export declare class ConnectionNotFoundError extends TypeORMError {
    constructor(name: string);
}
