import { Observable } from '../Observable.d.ts';
import { Scheduler } from '../Scheduler.d.ts';
import { TestMessage } from './TestMessage.d.ts';
import { SubscriptionLog } from './SubscriptionLog.d.ts';
import { SubscriptionLoggable } from './SubscriptionLoggable.d.ts';
import { Subscriber } from '../Subscriber.d.ts';
export declare class ColdObservable<T> extends Observable<T> implements SubscriptionLoggable {
    messages: TestMessage[];
    subscriptions: SubscriptionLog[];
    scheduler: Scheduler;
    logSubscribedFrame: () => number;
    logUnsubscribedFrame: (index: number) => void;
    constructor(messages: TestMessage[], scheduler: Scheduler);
    scheduleMessages(subscriber: Subscriber<any>): void;
}
//# sourceMappingURL=ColdObservable.d.ts.map
