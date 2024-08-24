import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: In([...]) }
 */
export declare function In<T>(value: readonly T[] | FindOperator<T>): FindOperator<any>;
