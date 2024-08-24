import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when relations specified in the find options were not found in the entities.
 */
export declare class FindRelationsNotFoundError extends TypeORMError {
    constructor(notFoundRelations: string[]);
}
