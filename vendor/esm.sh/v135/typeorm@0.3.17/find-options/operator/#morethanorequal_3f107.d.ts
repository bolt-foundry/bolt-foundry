import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: MoreThanOrEqual(10) }
 */
export declare function MoreThanOrEqual<T>(value: T | FindOperator<T>): FindOperator<T>;
