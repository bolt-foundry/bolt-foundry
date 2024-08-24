import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when method expects entity but instead something else is given.
 */
export declare class MustBeEntityError extends TypeORMError {
    constructor(operation: string, wrongValue: any);
}
