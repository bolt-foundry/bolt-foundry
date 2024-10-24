import type { LazyEvaluator } from "./pipe";
export type LazyEvaluatorFactory = (...args: any) => LazyEvaluator;
export type MaybeLazyFunction = {
    (...args: any): unknown;
    readonly lazy?: LazyEvaluatorFactory;
};
/**
 * Use this helper function to build the data last implementation together with
 * a lazy implementation. Use this when you need to build your own purrying
 * logic when you want to decide between dataFirst and dataLast on something
 * that isn't the number of arguments provided. This is useful for implementing
 * functions with optional or variadic arguments.
 */
export declare function lazyDataLastImpl(fn: MaybeLazyFunction, args: IArguments | ReadonlyArray<unknown>, lazyFactory: LazyEvaluatorFactory | undefined): unknown;
//# sourceMappingURL=_lazyDataLastImpl.d.ts.map