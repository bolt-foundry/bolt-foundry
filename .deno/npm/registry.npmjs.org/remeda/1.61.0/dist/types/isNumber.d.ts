import type { NarrowedTo } from "./_types";
/**
 * A function that checks if the passed parameter is a number and narrows its type accordingly.
 *
 * @param data - The variable to check.
 * @returns True if the passed input is a number, false otherwise.
 * @signature
 *    R.isNumber(data)
 * @example
 *    R.isNumber(1) //=> true
 *    R.isNumber('notANumber') //=> false
 * @category Guard
 */
export declare function isNumber<T>(data: T | number): data is NarrowedTo<T, number>;
//# sourceMappingURL=isNumber.d.ts.map