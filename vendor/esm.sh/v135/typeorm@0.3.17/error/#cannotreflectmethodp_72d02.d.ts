import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when ORM cannot get method parameter's type.
 * Basically, when reflect-metadata is not available or tsconfig is not properly setup.
 */
export declare class CannotReflectMethodParameterTypeError extends TypeORMError {
    constructor(target: Function, methodName: string);
}
