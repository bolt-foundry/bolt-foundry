import { EntityTarget } from "../common/EntityTarget.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when repository for the given class is not found.
 */
export declare class RepositoryNotTreeError extends TypeORMError {
    constructor(entityClass: EntityTarget<any>);
}
