import { HrTime, SpanAttributes } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
/**
 * Represents a timed event.
 * A timed event is an event with a timestamp.
 */
export interface TimedEvent {
    time: HrTime;
    /** The name of the event. */
    name: string;
    /** The attributes of the event. */
    attributes?: SpanAttributes;
    /** Count of attributes of the event that were dropped due to collection limits */
    droppedAttributesCount?: number;
}
//# sourceMappingURL=TimedEvent.d.ts.map
