import type { IterableContainer, Mapped, Pred, PredIndexed, PredIndexedOptional } from "./_types";
import type { LazyEvaluator } from "./pipe";
/**
 * Map each element of an array using a defined callback function. If the input
 * array is a tuple use the `strict` variant to maintain it's shape.
 *
 * @param array - The array to map.
 * @param fn - The function mapper.
 * @returns The new mapped array.
 * @signature
 *    R.map(array, fn)
 *    R.map.indexed(array, fn)
 *    R.map.strict(array, fn)
 *    R.map.strict.indexed(array, fn)
 * @example
 *    R.map([1, 2, 3], x => x * 2) // => [2, 4, 6], typed number[]
 *    R.map.indexed([0, 0, 0], (x, i) => i) // => [0, 1, 2], typed number[]
 *    R.map.strict([0, 0] as const, x => x + 1) // => [1, 1], typed [number, number]
 *    R.map.strict.indexed([0, 0] as const, (x, i) => x + i) // => [0, 1], typed [number, number]
 * @dataFirst
 * @indexed
 * @pipeable
 * @strict
 * @category Array
 */
export declare function map<T, K>(array: ReadonlyArray<T>, fn: Pred<T, K>): Array<K>;
/**
 * Map each value of an object using a defined callback function.
 *
 * @param fn - The function mapper.
 * @signature
 *    R.map(fn)(array)
 *    R.map.indexed(fn)(array)
 * @example
 *    R.pipe([0, 1, 2], R.map(x => x * 2)) // => [0, 2, 4]
 *    R.pipe([0, 0, 0], R.map.indexed((x, i) => i)) // => [0, 1, 2]
 * @dataLast
 * @indexed
 * @pipeable
 * @category Array
 */
export declare function map<T, K>(fn: Pred<T, K>): (array: ReadonlyArray<T>) => Array<K>;
type Strict = {
    <T extends IterableContainer, K>(items: T, mapper: Pred<T[number], K>): Mapped<T, K>;
    <T extends IterableContainer, K>(mapper: Pred<T[number], K>): (items: T) => Mapped<T, K>;
    readonly indexed: {
        <T extends IterableContainer, K>(items: T, mapper: PredIndexed<T[number], K>): Mapped<T, K>;
        <T extends IterableContainer, K>(mapper: PredIndexed<T[number], K>): (items: T) => Mapped<T, K>;
    };
};
export declare namespace map {
    function indexed<T, K>(array: ReadonlyArray<T>, fn: PredIndexed<T, K>): Array<K>;
    function indexed<T, K>(fn: PredIndexed<T, K>): (array: ReadonlyArray<T>) => Array<K>;
    const lazy: <T, K>(fn: PredIndexedOptional<T, K>) => LazyEvaluator<T, K>;
    const lazyIndexed: (<T, K>(fn: PredIndexedOptional<T, K>) => LazyEvaluator<T, K>) & {
        readonly indexed: true;
    };
    const strict: Strict;
}
export {};
//# sourceMappingURL=map.d.ts.map