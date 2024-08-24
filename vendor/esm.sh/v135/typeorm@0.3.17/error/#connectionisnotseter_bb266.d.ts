import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when user tries to execute operation that requires connection to be established.
 */
export declare class ConnectionIsNotSetError extends TypeORMError {
    constructor(dbType: string);
}
