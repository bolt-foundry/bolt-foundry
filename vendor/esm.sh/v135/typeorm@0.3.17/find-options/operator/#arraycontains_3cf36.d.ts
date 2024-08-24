import { FindOperator } from "../FindOperator.d.ts";
/**
 * FindOptions Operator.
 * Example: { someField: ArrayContains([...]) }
 */
export declare function ArrayContains<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
