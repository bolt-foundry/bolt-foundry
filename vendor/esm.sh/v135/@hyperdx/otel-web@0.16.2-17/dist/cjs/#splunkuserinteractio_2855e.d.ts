import { TracerProvider } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { UserInteractionInstrumentation } from 'https://esm.sh/v135/@opentelemetry/instrumentation-user-interaction@0.32.4/build/src/index.d.ts';
import { UserInteractionInstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation-user-interaction@0.32.4/build/src/types.d.ts';
export type UserInteractionEventsConfig = {
    [type: string]: boolean;
};
export declare const DEFAULT_AUTO_INSTRUMENTED_EVENTS: UserInteractionEventsConfig;
export declare const DEFAULT_AUTO_INSTRUMENTED_EVENT_NAMES: (keyof HTMLElementEventMap)[];
export interface SplunkUserInteractionInstrumentationConfig extends UserInteractionInstrumentationConfig {
    events?: UserInteractionEventsConfig;
}
export declare class SplunkUserInteractionInstrumentation extends UserInteractionInstrumentation {
    private _routingTracer;
    private __hashChangeHandler;
    constructor(config?: SplunkUserInteractionInstrumentationConfig);
    setTracerProvider(tracerProvider: TracerProvider): void;
    getZoneWithPrototype(): undefined;
    enable(): void;
    disable(): void;
    _patchHistoryMethod(): (original: any) => (this: History, ...args: unknown[]) => any;
    private _emitRouteChangeSpan;
}
