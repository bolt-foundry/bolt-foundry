import type { LazyEvaluatorFactory, MaybeLazyFunction } from "./_lazyDataLastImpl";
/**
 * Creates a function with `dataFirst` and `dataLast` signatures.
 *
 * `purry` is a dynamic function and it's not type safe. It should be wrapped by
 * a function that have proper typings. Refer to the example below for correct
 * usage.
 *
 * !IMPORTANT: functions that simply call `purry` and return the result (like
 * almost all functions in this library) should return `unknown` themselves if
 * an explicit return type is required. This is because we currently don't
 * provide a generic return type that is built from the input function, and
 * crafting one manually isn't worthwhile as we rely on function declaration
 * overloading to combine the types for dataFirst and dataLast invocations!
 *
 * @param fn - The function to purry.
 * @param args - The arguments.
 * @param lazyFactory - A lazy version of the function to purry.
 * @signature R.purry(fn, arguments);
 * @example
 *    function _findIndex(array, fn) {
 *      for (let i = 0; i < array.length; i++) {
 *        if (fn(array[i])) {
 *          return i;
 *        }
 *      }
 *      return -1;
 *    }
 *
 *    // data-first
 *    function findIndex<T>(array: T[], fn: (item: T) => boolean): number;
 *
 *    // data-last
 *    function findIndex<T>(fn: (item: T) => boolean): (array: T[]) => number;
 *
 *    function findIndex() {
 *      return R.purry(_findIndex, arguments);
 *    }
 * @category Function
 */
export declare function purry(fn: MaybeLazyFunction, args: IArguments | ReadonlyArray<unknown>, lazyFactory?: LazyEvaluatorFactory): unknown;
//# sourceMappingURL=purry.d.ts.map