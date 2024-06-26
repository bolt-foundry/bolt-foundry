import { HrTime } from 'https://esm.sh/v135/@opentelemetry/api@1.7.0/build/src/index.d.ts';
import { EventName } from './types.d.ts';
/**
 * Async Zone task
 */
export declare type AsyncTask = Task & {
    eventName: EventName;
    target: EventTarget;
    _zone: Zone;
};
/**
 *  Type for patching Zone RunTask function
 */
export declare type RunTaskFunction = (task: AsyncTask, applyThis?: any, applyArgs?: any) => Zone;
/**
 * interface to store information in weak map per span
 */
export interface SpanData {
    hrTimeLastTimeout?: HrTime;
    taskCount: number;
}
/**
 * interface to be able to check Zone presence on window
 */
export interface WindowWithZone {
    Zone: ZoneTypeWithPrototype;
}
/**
 * interface to be able to use prototype in Zone
 */
interface ZonePrototype {
    prototype: any;
}
/**
 * type to be  able to use prototype on Zone
 */
export declare type ZoneTypeWithPrototype = ZonePrototype & Zone;
export {};
//# sourceMappingURL=internal-types.d.ts.map
