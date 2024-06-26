/**
 * Creates a new object from two supplied lists by pairing up equally-positioned items.
 * Key/value pairing is truncated to the length of the shorter of the two lists.
 *
 * ! **DEPRECATED**: Use `R.fromEntries.strict(R.zip(first, second))`. Will be removed in V2!
 *
 * @param first - The first input list.
 * @param second - The second input list.
 * @signature
 *   R.zipObj(first, second)
 * @example
 *   R.zipObj(['a', 'b'], [1, 2]) // => {a: 1, b: 2}
 * @dataFirst
 * @category Deprecated
 * @deprecated Use `R.fromEntries.strict(R.zip(first, second))`. Will be removed in V2!
 */
export declare function zipObj<F extends PropertyKey, S>(first: ReadonlyArray<F>, second: ReadonlyArray<S>): Record<F, S>;
/**
 * Creates a new object from two supplied lists by pairing up equally-positioned items.
 * Key/value pairing is truncated to the length of the shorter of the two lists.
 *
 * ! **DEPRECATED**: Use `<F extends PropertyKey>(first: ReadonlyArray<F>) => R.fromEntries.strict(R.zip(first, second))` or if as part of a pipe: `R.pipe(..., R.zip(second), R.fromEntries.strict(), ...)`. Will be removed in V2!
 *
 * @param second - The second input list.
 * @signature
 *   R.zipObj(second)(first)
 * @example
 *   R.zipObj([1, 2])(['a', 'b']) // => {a: 1, b: 2}
 * @dataLast
 * @category Deprecated
 * @deprecated Use `<F extends PropertyKey>(first: ReadonlyArray<F>) => R.fromEntries.strict(R.zip(first, second))` or if as part of a pipe: `R.pipe(..., R.zip(second), R.fromEntries.strict(), ...)`. Will be removed in V2!
 */
export declare function zipObj<S>(second: ReadonlyArray<S>): <F extends PropertyKey>(first: ReadonlyArray<F>) => Record<F, S>;
//# sourceMappingURL=zipObj.d.ts.map