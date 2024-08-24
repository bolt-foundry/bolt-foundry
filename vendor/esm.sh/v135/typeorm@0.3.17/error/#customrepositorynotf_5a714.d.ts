import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown if custom repository was not found.
 */
export declare class CustomRepositoryNotFoundError extends TypeORMError {
    constructor(repository: any);
}
