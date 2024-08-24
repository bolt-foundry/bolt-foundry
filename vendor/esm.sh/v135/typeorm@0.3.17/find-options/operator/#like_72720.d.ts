import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: Like("%some string%") }
 */
export declare function Like<T>(value: T | FindOperator<T>): FindOperator<T>;
