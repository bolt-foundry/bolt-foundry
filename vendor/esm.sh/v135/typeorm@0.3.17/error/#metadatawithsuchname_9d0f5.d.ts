import { TypeORMError } from "./TypeORMError.d.ts";
export declare class MetadataWithSuchNameAlreadyExistsError extends TypeORMError {
    constructor(metadataType: string, name: string);
}
