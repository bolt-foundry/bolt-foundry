import { Observable } from '../Observable.d.ts';
import { MonoTypeOperatorFunction, OperatorFunction, TruthyTypesOf } from '../types.d.ts';
export declare function single<T>(predicate: BooleanConstructor): OperatorFunction<T, TruthyTypesOf<T>>;
export declare function single<T>(predicate?: (value: T, index: number, source: Observable<T>) => boolean): MonoTypeOperatorFunction<T>;
//# sourceMappingURL=single.d.ts.map
