import { EntityMetadata } from "../metadata/EntityMetadata.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
export declare class MissingDeleteDateColumnError extends TypeORMError {
    constructor(entityMetadata: EntityMetadata);
}
