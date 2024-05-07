import { Observable } from '../Observable.d.ts';
import { ObservableInputTuple } from '../types.d.ts';
export declare function zip<A extends readonly unknown[]>(sources: [...ObservableInputTuple<A>]): Observable<A>;
export declare function zip<A extends readonly unknown[], R>(sources: [...ObservableInputTuple<A>], resultSelector: (...values: A) => R): Observable<R>;
export declare function zip<A extends readonly unknown[]>(...sources: [...ObservableInputTuple<A>]): Observable<A>;
export declare function zip<A extends readonly unknown[], R>(...sourcesAndResultSelector: [...ObservableInputTuple<A>, (...values: A) => R]): Observable<R>;
//# sourceMappingURL=zip.d.ts.map
