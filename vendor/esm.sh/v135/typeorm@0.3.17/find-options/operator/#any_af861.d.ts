import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: Any([...]) }
 */
export declare function Any<T>(value: readonly T[] | FindOperator<T>): FindOperator<T>;
