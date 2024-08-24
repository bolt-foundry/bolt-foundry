import { FindOperator } from "../FindOperator.d.ts";
/**
 * Find Options Operator.
 * Example: { someField: ILike("%SOME string%") }
 */
export declare function ILike<T>(value: T | FindOperator<T>): FindOperator<T>;
