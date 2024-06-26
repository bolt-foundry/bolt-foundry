import type { IterableContainer, NonEmptyArray } from "./_types";
type Chunked<T extends IterableContainer> = T[number] extends never ? [] : T extends readonly [...Array<unknown>, unknown] | readonly [unknown, ...Array<unknown>] ? NonEmptyArray<NonEmptyArray<T[number]>> : Array<NonEmptyArray<T[number]>>;
/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param array - The array.
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(array, size)
 * @example
 *    R.chunk(['a', 'b', 'c', 'd'], 2) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(['a', 'b', 'c', 'd'], 3) // => [['a', 'b', 'c'], ['d']]
 * @dataFirst
 * @category Array
 */
export declare function chunk<T extends IterableContainer>(array: T, size: number): Chunked<T>;
/**
 * Split an array into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.
 *
 * @param size - The length of the chunk.
 * @signature
 *    R.chunk(size)(array)
 * @example
 *    R.chunk(2)(['a', 'b', 'c', 'd']) // => [['a', 'b'], ['c', 'd']]
 *    R.chunk(3)(['a', 'b', 'c', 'd']) // => [['a', 'b', 'c'], ['d']]
 * @dataLast
 * @category Array
 */
export declare function chunk<T extends IterableContainer>(size: number): (array: T) => Chunked<T>;
export {};
//# sourceMappingURL=chunk.d.ts.map