import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when circular relations detected with nullable set to false.
 */
export declare class CircularRelationsError extends TypeORMError {
    constructor(path: string);
}
