import type { LazyEvaluator } from "./pipe";
/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 *
 * @param array - The array to map.
 * @param fn - The function mapper.
 * @signature
 *    R.flatMap(array, fn)
 * @example
 *    R.flatMap([1, 2, 3], x => [x, x * 10]) // => [1, 10, 2, 20, 3, 30]
 * @dataFirst
 * @pipeable
 * @category Array
 */
export declare function flatMap<T, K>(array: ReadonlyArray<T>, fn: (input: T) => K | ReadonlyArray<K>): Array<K>;
/**
 * Map each element of an array using a defined callback function and flatten the mapped result.
 *
 * @param fn - The function mapper.
 * @signature
 *    R.flatMap(fn)(array)
 * @example
 *    R.pipe([1, 2, 3], R.flatMap(x => [x, x * 10])) // => [1, 10, 2, 20, 3, 30]
 * @dataLast
 * @pipeable
 * @category Array
 */
export declare function flatMap<T, K>(fn: (input: T) => K | ReadonlyArray<K>): (array: ReadonlyArray<T>) => Array<K>;
export declare namespace flatMap {
    const lazy: <T, K>(fn: (input: T) => K | ReadonlyArray<K>) => LazyEvaluator<T, K>;
}
//# sourceMappingURL=flatMap.d.ts.map