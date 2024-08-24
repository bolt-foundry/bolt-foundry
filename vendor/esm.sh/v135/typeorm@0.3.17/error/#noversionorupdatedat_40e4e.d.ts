import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when an entity does not have no version and no update date column.
 */
export declare class NoVersionOrUpdateDateColumnError extends TypeORMError {
    constructor(entity: string);
}
