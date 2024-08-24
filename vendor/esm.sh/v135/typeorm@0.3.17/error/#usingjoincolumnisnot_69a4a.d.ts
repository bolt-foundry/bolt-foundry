import { EntityMetadata } from "../metadata/EntityMetadata.d.ts";
import { RelationMetadata } from "../metadata/RelationMetadata.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
export declare class UsingJoinColumnIsNotAllowedError extends TypeORMError {
    constructor(entityMetadata: EntityMetadata, relation: RelationMetadata);
}
