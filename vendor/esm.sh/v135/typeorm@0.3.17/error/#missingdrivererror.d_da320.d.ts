import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when consumer specifies driver type that does not exist or supported.
 */
export declare class MissingDriverError extends TypeORMError {
    constructor(driverType: string, availableDrivers?: string[]);
}
