import { Observable } from '../Observable.d.ts';
import { ObservableInput, SchedulerLike, ObservedValueOf } from '../types.d.ts';
export declare function from<O extends ObservableInput<any>>(input: O): Observable<ObservedValueOf<O>>;
/** @deprecated The `scheduler` parameter will be removed in v8. Use `scheduled`. Details: https://rxjs.dev/deprecations/scheduler-argument */
export declare function from<O extends ObservableInput<any>>(input: O, scheduler: SchedulerLike | undefined): Observable<ObservedValueOf<O>>;
//# sourceMappingURL=from.d.ts.map
