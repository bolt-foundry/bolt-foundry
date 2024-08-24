import { TypeORMError } from "./TypeORMError.d.ts";
import { EntityMetadata } from "../metadata/EntityMetadata.d.ts";
/**
 * Thrown when specified entity property was not found.
 */
export declare class EntityPropertyNotFoundError extends TypeORMError {
    constructor(propertyPath: string, metadata: EntityMetadata);
}
