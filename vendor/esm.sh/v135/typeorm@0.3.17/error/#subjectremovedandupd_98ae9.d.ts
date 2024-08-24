import { Subject } from "../persistence/Subject.d.ts";
import { TypeORMError } from "./TypeORMError.d.ts";
/**
 * Thrown when same object is scheduled for remove and updation at the same time.
 */
export declare class SubjectRemovedAndUpdatedError extends TypeORMError {
    constructor(subject: Subject);
}
