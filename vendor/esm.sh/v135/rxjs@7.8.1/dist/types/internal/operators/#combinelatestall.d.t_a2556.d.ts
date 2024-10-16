import { OperatorFunction, ObservableInput } from '../types.d.ts';
export declare function combineLatestAll<T>(): OperatorFunction<ObservableInput<T>, T[]>;
export declare function combineLatestAll<T>(): OperatorFunction<any, T[]>;
export declare function combineLatestAll<T, R>(project: (...values: T[]) => R): OperatorFunction<ObservableInput<T>, R>;
export declare function combineLatestAll<R>(project: (...values: Array<any>) => R): OperatorFunction<any, R>;
//# sourceMappingURL=combineLatestAll.d.ts.map
