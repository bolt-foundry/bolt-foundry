import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown if some required driver's option is not set.
 */
export declare class DriverOptionNotSetError extends TypeORMError {
    constructor(optionName: string);
}
