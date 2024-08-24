import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer tries to use naming strategy that does not exist.
 */
export declare class NamingStrategyNotFoundError extends TypeORMError {
    constructor(strategyName: string | Function, connectionName: string);
}
