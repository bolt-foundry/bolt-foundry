import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: Between(x, y) }
 */
export declare function Between<T>(from: T | FindOperator<T>, to: T | FindOperator<T>): FindOperator<T>;
