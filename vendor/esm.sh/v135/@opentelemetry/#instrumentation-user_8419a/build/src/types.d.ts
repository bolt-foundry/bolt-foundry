import { Span } from 'https://esm.sh/v135/@opentelemetry/api@1.7.0/build/src/index.d.ts';
import { InstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation@0.40.0/build/src/index.d.ts';
export declare type EventName = keyof HTMLElementEventMap;
export declare type ShouldPreventSpanCreation = (eventType: EventName, element: HTMLElement, span: Span) => boolean | void;
export interface UserInteractionInstrumentationConfig extends InstrumentationConfig {
    /**
     * List of events to instrument (like 'mousedown', 'touchend', 'play' etc).
     * By default only 'click' event is instrumented.
     */
    eventNames?: EventName[];
    /**
     * Callback function called each time new span is being created.
     * Return `true` to prevent span recording.
     * You can also use this handler to enhance created span with extra attributes.
     */
    shouldPreventSpanCreation?: ShouldPreventSpanCreation;
}
//# sourceMappingURL=types.d.ts.map
