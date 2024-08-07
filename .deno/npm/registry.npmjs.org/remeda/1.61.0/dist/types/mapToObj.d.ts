/**
 * Map each element of an array into an object using a defined callback function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param array - The array to map.
 * @param fn - The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(array, fn)
 *    R.mapToObj.indexed(array, fn)
 * @example
 *    R.mapToObj([1, 2, 3], x => [String(x), x * 2]) // => {1: 2, 2: 4, 3: 6}
 *    R.mapToObj.indexed([0, 0, 0], (x, i) => [i, i]) // => {0: 0, 1: 1, 2: 2}
 * @dataFirst
 * @indexed
 * @category Array
 */
export declare function mapToObj<T, K extends PropertyKey, V>(array: ReadonlyArray<T>, fn: (element: T) => [K, V]): Record<K, V>;
/**
 * Map each element of an array into an object using a defined callback function.
 *
 * There are several other functions that could be used to build an object from
 * an array:
 * * `fromKeys` - Builds an object from an array of *keys* and a mapper for values.
 * * `indexBy` - Builds an object from an array of *values* and a mapper for keys.
 * * `pullObject` - Builds an object from an array of items with mappers for *both* keys and values.
 * * `fromEntries` - Builds an object from an array of key-value pairs.
 * Refer to the docs for more details.
 *
 * @param fn - The mapping function, which should return a tuple of [key, value], similar to Object.fromEntries.
 * @returns The new mapped object.
 * @signature
 *    R.mapToObj(fn)(array)
 *    R.mapToObj.indexed(fn)(array)
 * @example
 *    R.pipe(
 *      [1, 2, 3],
 *      R.mapToObj(x => [String(x), x * 2])
 *    ) // => {1: 2, 2: 4, 3: 6}
 *    R.pipe(
 *      [0, 0, 0],
 *      R.mapToObj.indexed((x, i) => [i, i])
 *    ) // => {0: 0, 1: 1, 2: 2}
 * @dataLast
 * @indexed
 * @category Array
 */
export declare function mapToObj<T, K extends PropertyKey, V>(fn: (element: T) => [K, V]): (array: ReadonlyArray<T>) => Record<K, V>;
export declare namespace mapToObj {
    function indexed<T, K extends PropertyKey, V>(array: ReadonlyArray<T>, fn: (element: T, index: number, array: ReadonlyArray<T>) => [K, V]): Record<K, V>;
    function indexed<T, K extends PropertyKey, V>(fn: (element: T, index: number, array: ReadonlyArray<T>) => [K, V]): (array: ReadonlyArray<T>) => Record<K, V>;
}
//# sourceMappingURL=mapToObj.d.ts.map