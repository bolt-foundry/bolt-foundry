import { EntityTarget } from "../common/EntityTarget.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
export declare class EntityMetadataNotFoundError extends TypeORMError {
    constructor(target: EntityTarget<any>);
    private stringifyTarget;
}
