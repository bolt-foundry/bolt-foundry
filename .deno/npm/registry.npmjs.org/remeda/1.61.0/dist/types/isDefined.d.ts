/**
 * A function that checks if the passed parameter is defined and narrows its
 * type accordingly. To test specifically for `undefined` (and not `null`) use
 * the strict variant of this function.
 *
 * ! **DEPRECATED**: If your type accepts `null` use `R.isNullish(data)`, otherwise prefer `R.isDefined.strict(data)`. The **non-strict** version will be removed in V2!
 *
 * @param data - The variable to check.
 * @returns True if the passed input is defined, false otherwise.
 * @signature
 *    R.isDefined(data)
 *    R.isDefined.strict(data)
 * @example
 *    R.isDefined('string') //=> true
 *    R.isDefined(null) //=> false
 *    R.isDefined(undefined) //=> false
 *    R.isDefined.strict(null) //=> true
 *    R.isDefined.strict(undefined) //=> false
 * @strict
 * @category Guard
 * @deprecated If your type accepts `null` use `R.isNullish(data)`, otherwise prefer `R.isDefined.strict(data)`. The **non-strict** version will be removed in V2!
 */
export declare function isDefined<T>(data: T): data is NonNullable<T>;
export declare namespace isDefined {
    function strict<T>(data: T | undefined): data is T;
}
//# sourceMappingURL=isDefined.d.ts.map