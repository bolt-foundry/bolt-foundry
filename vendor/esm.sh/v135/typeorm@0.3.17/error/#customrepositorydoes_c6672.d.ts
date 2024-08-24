import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown if custom repositories that extend AbstractRepository classes does not have managed entity.
 */
export declare class CustomRepositoryDoesNotHaveEntityError extends TypeORMError {
    constructor(repository: any);
}
