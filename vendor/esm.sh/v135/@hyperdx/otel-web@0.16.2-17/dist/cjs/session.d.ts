import { InternalEventTarget } from './EventTarget.d.ts';
export declare const COOKIE_NAME = "__rum_sid";
export type SessionIdType = string;
export declare function updateSessionStatus(): void;
export declare function initSessionTracking(instanceId: SessionIdType, newEventTarget: InternalEventTarget, domain?: string): {
    deinit: () => void;
};
export declare function getRumSessionId(): SessionIdType;
