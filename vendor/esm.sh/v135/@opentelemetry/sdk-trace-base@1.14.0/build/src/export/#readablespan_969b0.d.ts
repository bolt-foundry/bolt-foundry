import { SpanKind, SpanStatus, SpanAttributes, HrTime, Link, SpanContext } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { IResource } from 'https://esm.sh/v135/@opentelemetry/resources@1.14.0/build/src/index.d.ts';
import { InstrumentationLibrary } from 'https://esm.sh/v135/@opentelemetry/core@1.14.0/build/src/index.d.ts';
import { TimedEvent } from '../TimedEvent.d.ts';
export interface ReadableSpan {
    readonly name: string;
    readonly kind: SpanKind;
    readonly spanContext: () => SpanContext;
    readonly parentSpanId?: string;
    readonly startTime: HrTime;
    readonly endTime: HrTime;
    readonly status: SpanStatus;
    readonly attributes: SpanAttributes;
    readonly links: Link[];
    readonly events: TimedEvent[];
    readonly duration: HrTime;
    readonly ended: boolean;
    readonly resource: IResource;
    readonly instrumentationLibrary: InstrumentationLibrary;
    readonly droppedAttributesCount: number;
    readonly droppedEventsCount: number;
    readonly droppedLinksCount: number;
}
//# sourceMappingURL=ReadableSpan.d.ts.map
