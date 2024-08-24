import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when some option is not set in the connection options.
 */
export declare class NoConnectionOptionError extends TypeORMError {
    constructor(optionName: string);
}
