import { MonoTypeOperatorFunction } from '../types.d.ts';
export declare function distinctUntilChanged<T>(comparator?: (previous: T, current: T) => boolean): MonoTypeOperatorFunction<T>;
export declare function distinctUntilChanged<T, K>(comparator: (previous: K, current: K) => boolean, keySelector: (value: T) => K): MonoTypeOperatorFunction<T>;
//# sourceMappingURL=distinctUntilChanged.d.ts.map
