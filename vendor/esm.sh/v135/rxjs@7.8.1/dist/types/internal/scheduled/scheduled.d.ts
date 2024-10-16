import { ObservableInput, SchedulerLike } from '../types.d.ts';
import { Observable } from '../Observable.d.ts';
/**
 * Converts from a common {@link ObservableInput} type to an observable where subscription and emissions
 * are scheduled on the provided scheduler.
 *
 * @see {@link from}
 * @see {@link of}
 *
 * @param input The observable, array, promise, iterable, etc you would like to schedule
 * @param scheduler The scheduler to use to schedule the subscription and emissions from
 * the returned observable.
 */
export declare function scheduled<T>(input: ObservableInput<T>, scheduler: SchedulerLike): Observable<T>;
//# sourceMappingURL=scheduled.d.ts.map
