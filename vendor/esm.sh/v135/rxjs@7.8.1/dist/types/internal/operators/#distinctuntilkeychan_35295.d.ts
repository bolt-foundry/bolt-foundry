import { MonoTypeOperatorFunction } from '../types.d.ts';
export declare function distinctUntilKeyChanged<T>(key: keyof T): MonoTypeOperatorFunction<T>;
export declare function distinctUntilKeyChanged<T, K extends keyof T>(key: K, compare: (x: T[K], y: T[K]) => boolean): MonoTypeOperatorFunction<T>;
//# sourceMappingURL=distinctUntilKeyChanged.d.ts.map
