import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: MoreThan(10) }
 */
export declare function MoreThan<T>(value: T | FindOperator<T>): FindOperator<T>;
