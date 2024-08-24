import { TypeORMError } from "./TypeORMError.d.ts";
export declare class PrimaryColumnCannotBeNullableError extends TypeORMError {
    constructor(object: Object, propertyName: string);
}
