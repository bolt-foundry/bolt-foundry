import { Scheduler } from '../Scheduler.d.ts';
import { Action } from './Action.d.ts';
import { AsyncAction } from './AsyncAction.d.ts';
export declare class AsyncScheduler extends Scheduler {
    actions: Array<AsyncAction<any>>;
    constructor(SchedulerAction: typeof Action, now?: () => number);
    flush(action: AsyncAction<any>): void;
}
//# sourceMappingURL=AsyncScheduler.d.ts.map
