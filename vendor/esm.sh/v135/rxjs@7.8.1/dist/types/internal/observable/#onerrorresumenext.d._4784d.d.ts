import { Observable } from '../Observable.d.ts';
import { ObservableInputTuple } from '../types.d.ts';
export declare function onErrorResumeNext<A extends readonly unknown[]>(sources: [...ObservableInputTuple<A>]): Observable<A[number]>;
export declare function onErrorResumeNext<A extends readonly unknown[]>(...sources: [...ObservableInputTuple<A>]): Observable<A[number]>;
//# sourceMappingURL=onErrorResumeNext.d.ts.map
