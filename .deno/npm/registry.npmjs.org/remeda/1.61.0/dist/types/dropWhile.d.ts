/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param data - The array.
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(data, predicate)
 * @example
 *    R.dropWhile([1, 2, 10, 3, 4], x => x < 10) // => [10, 3, 4]
 * @dataFirst
 * @category Array
 */
export declare function dropWhile<T>(data: ReadonlyArray<T>, predicate: (item: T) => boolean): Array<T>;
/**
 * Removes elements from the beginning of the array until the predicate returns false.
 *
 * The predicate is applied to each element in the array, until the predicate returns false. The returned array includes the rest of the elements, starting with the element that produced false for the predicate.
 *
 * @param predicate - The predicate.
 * @signature
 *    R.dropWhile(predicate)(data)
 * @example
 *    R.pipe([1, 2, 10, 3, 4], R.dropWhile(x => x < 10))  // => [10, 3, 4]
 * @dataLast
 * @category Array
 */
export declare function dropWhile<T>(predicate: (item: T) => boolean): (data: ReadonlyArray<T>) => Array<T>;
//# sourceMappingURL=dropWhile.d.ts.map