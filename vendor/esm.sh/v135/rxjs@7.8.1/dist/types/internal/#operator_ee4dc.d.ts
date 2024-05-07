import { Subscriber } from './Subscriber.d.ts';
import { TeardownLogic } from './types.d.ts';
/***
 * @deprecated Internal implementation detail, do not use directly. Will be made internal in v8.
 */
export interface Operator<T, R> {
    call(subscriber: Subscriber<R>, source: any): TeardownLogic;
}
//# sourceMappingURL=Operator.d.ts.map
