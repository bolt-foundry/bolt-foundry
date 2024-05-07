import { Subject } from '../Subject.d.ts';
import { Scheduler } from '../Scheduler.d.ts';
import { TestMessage } from './TestMessage.d.ts';
import { SubscriptionLog } from './SubscriptionLog.d.ts';
import { SubscriptionLoggable } from './SubscriptionLoggable.d.ts';
export declare class HotObservable<T> extends Subject<T> implements SubscriptionLoggable {
    messages: TestMessage[];
    subscriptions: SubscriptionLog[];
    scheduler: Scheduler;
    logSubscribedFrame: () => number;
    logUnsubscribedFrame: (index: number) => void;
    constructor(messages: TestMessage[], scheduler: Scheduler);
    setup(): void;
}
//# sourceMappingURL=HotObservable.d.ts.map
