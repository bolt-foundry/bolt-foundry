import { Driver } from "../driver/Driver.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
export declare class TreeRepositoryNotSupportedError extends TypeORMError {
    constructor(driver: Driver);
}
