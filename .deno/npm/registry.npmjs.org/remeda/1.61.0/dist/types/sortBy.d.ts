import type { OrderRule } from "./_purryOrderRules";
import type { IterableContainer, NonEmptyArray } from "./_types";
/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the native `Array.prototype.sort` but is performed on a shallow copy of the array to avoid mutating the original data.
 *
 * To maintain the shape of more complex inputs (like non-empty arrays, tuples, etc...) use the `strict` variant.
 *
 * There are several other functions that take order rules and **bypass** the need to sort the array first (in *O(nlogn)* time):
 * * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param rules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A shallow copy of the input array sorted by the provided rules.
 * @signature
 *    R.sortBy(...rules)(data)
 *    R.sortBy.strict(...rules)(data)
 * @example
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      R.sortBy(x => x.a)
 *    ) // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *    R.pipe(
 *      [{ a: 1 }, { a: 3 }] as const,
 *      R.sortBy.strict(x => x.a)
 *    ) // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @dataLast
 * @strict
 * @category Array
 */
export declare function sortBy<T>(...rules: Readonly<NonEmptyArray<OrderRule<T>>>): (data: ReadonlyArray<T>) => Array<T>;
/**
 * Sorts `data` using the provided ordering rules. The `sort` is done via the native `Array.prototype.sort` but is performed on a shallow copy of the array to avoid mutating the original data.
 *
 * To maintain the shape of more complex inputs (like non-empty arrays, tuples, etc...) use the `strict` variant.
 *
 * There are several other functions that take order rules and **bypass** the need to sort the array first (in *O(nlogn)* time):
 * * `firstBy` === `first(sortBy(data, ...rules))`, O(n).
 * * `takeFirstBy` === `take(sortBy(data, ...rules), k)`, O(nlogk).
 * * `dropFirstBy` === `drop(sortBy(data, ...rules), k)`, O(nlogk).
 * * `nthBy` === `sortBy(data, ...rules).at(k)`, O(n).
 * * `rankBy` === `sortedIndex(sortBy(data, ...rules), item)`, O(n).
 * Refer to the docs for more details.
 *
 * @param array - The input array.
 * @param sortRules - A variadic array of order rules defining the sorting criteria. Each order rule is a projection function that extracts a comparable value from the data. Sorting is based on these extracted values using the native `<` and `>` operators. Earlier rules take precedence over later ones. Use the syntax `[projection, "desc"]` for descending order.
 * @returns A shallow copy of the input array sorted by the provided rules.
 * @signature
 *    R.sortBy(data, ...rules)
 *    R.sortBy.strict(data, ...rules)
 * @example
 *    R.sortBy(
 *      [{ a: 1 }, { a: 3 }, { a: 7 }, { a: 2 }],
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 2 }, { a: 3 }, { a: 7 }] typed Array<{a:number}>
 *
 *    R.sortBy(
 *     [
 *       {color: 'red', weight: 2},
 *       {color: 'blue', weight: 3},
 *       {color: 'green', weight: 1},
 *       {color: 'purple', weight: 1},
 *     ],
 *      [x => x.weight, 'asc'], x => x.color
 *    )
 *    // =>
 *    //   {color: 'green', weight: 1},
 *    //   {color: 'purple', weight: 1},
 *    //   {color: 'red', weight: 2},
 *    //   {color: 'blue', weight: 3},
 *    // typed Array<{color: string, weight: number}>
 *
 *    R.sortBy.strict(
 *      [{ a: 1 }, { a: 3 }] as const,
 *      x => x.a
 *    )
 *    // => [{ a: 1 }, { a: 3 }] typed [{a: 1 | 3}, {a: 1 | 3}]
 * @dataFirst
 * @strict
 * @category Array
 */
export declare function sortBy<T>(array: ReadonlyArray<T>, ...sortRules: Readonly<NonEmptyArray<OrderRule<T>>>): Array<T>;
type Strict = {
    <T extends IterableContainer>(...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): (array: T) => SortedBy<T>;
    <T extends IterableContainer>(array: T, ...sortRules: Readonly<NonEmptyArray<OrderRule<T[number]>>>): SortedBy<T>;
};
type SortedBy<T extends IterableContainer> = {
    -readonly [P in keyof T]: T[number];
};
export declare namespace sortBy {
    const strict: Strict;
}
export {};
//# sourceMappingURL=sortBy.d.ts.map