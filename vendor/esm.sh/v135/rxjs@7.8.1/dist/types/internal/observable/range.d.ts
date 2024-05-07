import { SchedulerLike } from '../types.d.ts';
import { Observable } from '../Observable.d.ts';
export declare function range(start: number, count?: number): Observable<number>;
/**
 * @deprecated The `scheduler` parameter will be removed in v8. Use `range(start, count).pipe(observeOn(scheduler))` instead. Details: Details: https://rxjs.dev/deprecations/scheduler-argument
 */
export declare function range(start: number, count: number | undefined, scheduler: SchedulerLike): Observable<number>;
//# sourceMappingURL=range.d.ts.map
