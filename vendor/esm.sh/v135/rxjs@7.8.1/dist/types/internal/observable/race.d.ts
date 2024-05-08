import { Observable } from '../Observable.d.ts';
import { ObservableInput, ObservableInputTuple } from '../types.d.ts';
import { Subscriber } from '../Subscriber.d.ts';
export declare function race<T extends readonly unknown[]>(inputs: [...ObservableInputTuple<T>]): Observable<T[number]>;
export declare function race<T extends readonly unknown[]>(...inputs: [...ObservableInputTuple<T>]): Observable<T[number]>;
/**
 * An observable initializer function for both the static version and the
 * operator version of race.
 * @param sources The sources to race
 */
export declare function raceInit<T>(sources: ObservableInput<T>[]): (subscriber: Subscriber<T>) => void;
//# sourceMappingURL=race.d.ts.map
