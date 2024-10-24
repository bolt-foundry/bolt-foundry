/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param items - The array to reduce.
 * @param fn - The callback function.
 * @param initialValue - The initial value to use as an accumulator value in the callback function.
 * @signature
 *    R.reduce(items, fn, initialValue)
 *    R.reduce.indexed(items, fn, initialValue)
 * @example
 *    R.reduce([1, 2, 3, 4, 5], (acc, x) => acc + x, 100) // => 115
 *    R.reduce.indexed([1, 2, 3, 4, 5], (acc, x, i, array) => acc + x, 100) // => 115
 * @dataFirst
 * @indexed
 * @category Array
 */
export declare function reduce<T, K>(items: ReadonlyArray<T>, fn: (acc: K, item: T) => K, initialValue: K): K;
/**
 * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
 *
 * @param fn - The callback function.
 * @param initialValue - The initial value to use as an accumulator value in the callback function.
 * @signature
 *    R.reduce(fn, initialValue)(array)
 * @example
 *    R.pipe([1, 2, 3, 4, 5], R.reduce((acc, x) => acc + x, 100)) // => 115
 *    R.pipe([1, 2, 3, 4, 5], R.reduce.indexed((acc, x, i, array) => acc + x, 100)) // => 115
 * @dataLast
 * @indexed
 * @category Array
 */
export declare function reduce<T, K>(fn: (acc: K, item: T) => K, initialValue: K): (items: ReadonlyArray<T>) => K;
export declare namespace reduce {
    function indexed<T, K>(array: ReadonlyArray<T>, fn: (acc: K, item: T, index: number, items: ReadonlyArray<T>) => K, initialValue: K): K;
    function indexed<T, K>(fn: (acc: K, item: T, index: number, items: ReadonlyArray<T>) => K, initialValue: K): (array: ReadonlyArray<T>) => K;
}
//# sourceMappingURL=reduce.d.ts.map