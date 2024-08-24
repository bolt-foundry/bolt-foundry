import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when user saves tree children entity but its parent is not saved yet.
 */
export declare class CannotAttachTreeChildrenEntityError extends TypeORMError {
    constructor(entityName: string);
}
