import { Observable } from '../Observable.d.ts';
import { MonoTypeOperatorFunction, ObservableInput } from '../types.d.ts';
/** @deprecated The `subscriptionDelay` parameter will be removed in v8. */
export declare function delayWhen<T>(delayDurationSelector: (value: T, index: number) => ObservableInput<any>, subscriptionDelay: Observable<any>): MonoTypeOperatorFunction<T>;
export declare function delayWhen<T>(delayDurationSelector: (value: T, index: number) => ObservableInput<any>): MonoTypeOperatorFunction<T>;
//# sourceMappingURL=delayWhen.d.ts.map
