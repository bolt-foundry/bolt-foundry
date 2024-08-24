import { FindOperator } from "../FindOperator.d.ts";
/**
 * FindOptions Operator.
 * Example: { someField: ArrayOverlap([...]) }
 */
export declare function ArrayOverlap<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
