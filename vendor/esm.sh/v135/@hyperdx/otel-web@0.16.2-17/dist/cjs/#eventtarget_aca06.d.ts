import { Attributes } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
export interface RumOtelWebEventTypes {
    'session-changed': {
        sessionId: string;
    };
    'global-attributes-changed': {
        attributes: Attributes;
    };
}
type SplunkEventListener<type extends keyof RumOtelWebEventTypes> = (event: {
    payload: RumOtelWebEventTypes[type];
}) => void;
export declare class InternalEventTarget {
    protected events: Partial<{
        [T in keyof RumOtelWebEventTypes]: SplunkEventListener<T>[];
    }>;
    addEventListener<T extends keyof RumOtelWebEventTypes>(type: T, listener: SplunkEventListener<T>): void;
    removeEventListener<T extends keyof RumOtelWebEventTypes>(type: T, listener: SplunkEventListener<T>): void;
    emit<T extends keyof RumOtelWebEventTypes>(type: T, payload: RumOtelWebEventTypes[T]): void;
}
export interface RumOtelWebEventTarget {
    addEventListener: InternalEventTarget['addEventListener'];
    /**
     * @deprecated Use {@link addEventListener}
     */
    _experimental_addEventListener: InternalEventTarget['addEventListener'];
    removeEventListener: InternalEventTarget['removeEventListener'];
    /**
     * @deprecated Use {@link removeEventListener}
     */
    _experimental_removeEventListener: InternalEventTarget['removeEventListener'];
}
export {};
