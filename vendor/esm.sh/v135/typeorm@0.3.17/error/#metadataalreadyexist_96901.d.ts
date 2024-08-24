import { TypeORMError } from "./TypeORMError.d.ts";
export declare class MetadataAlreadyExistsError extends TypeORMError {
    constructor(metadataType: string, constructor: Function, propertyName?: string);
}
