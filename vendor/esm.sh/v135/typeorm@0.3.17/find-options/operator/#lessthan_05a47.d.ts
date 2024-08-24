import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: LessThan(10) }
 */
export declare function LessThan<T>(value: T | FindOperator<T>): FindOperator<T>;
