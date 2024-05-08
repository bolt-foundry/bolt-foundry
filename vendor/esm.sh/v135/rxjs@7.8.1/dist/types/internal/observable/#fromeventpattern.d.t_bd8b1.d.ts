import { Observable } from '../Observable.d.ts';
import { NodeEventHandler } from './fromEvent.d.ts';
export declare function fromEventPattern<T>(addHandler: (handler: NodeEventHandler) => any, removeHandler?: (handler: NodeEventHandler, signal?: any) => void): Observable<T>;
export declare function fromEventPattern<T>(addHandler: (handler: NodeEventHandler) => any, removeHandler?: (handler: NodeEventHandler, signal?: any) => void, resultSelector?: (...args: any[]) => T): Observable<T>;
//# sourceMappingURL=fromEventPattern.d.ts.map
