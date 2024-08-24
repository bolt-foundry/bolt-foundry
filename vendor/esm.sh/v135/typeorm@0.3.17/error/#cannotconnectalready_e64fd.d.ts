import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to connect when he already connected.
 */
export declare class CannotConnectAlreadyConnectedError extends TypeORMError {
    constructor(connectionName: string);
}
