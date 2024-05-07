import { Observable } from '../Observable.d.ts';
import { ObservableInputTuple, SchedulerLike } from '../types.d.ts';
export declare function concat<T extends readonly unknown[]>(...inputs: [...ObservableInputTuple<T>]): Observable<T[number]>;
export declare function concat<T extends readonly unknown[]>(...inputsAndScheduler: [...ObservableInputTuple<T>, SchedulerLike]): Observable<T[number]>;
//# sourceMappingURL=concat.d.ts.map
