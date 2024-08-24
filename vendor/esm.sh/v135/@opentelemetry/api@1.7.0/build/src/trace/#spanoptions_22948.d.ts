import { TimeInput } from '../common/Time.d.ts';
import { SpanAttributes } from './attributes.d.ts';
import { Link } from './link.d.ts';
import { SpanKind } from './span_kind.d.ts';
/**
 * Options needed for span creation
 */
export interface SpanOptions {
    /**
     * The SpanKind of a span
     * @default {@link SpanKind.INTERNAL}
     */
    kind?: SpanKind;
    /** A span's attributes */
    attributes?: SpanAttributes;
    /** {@link Link}s span to other spans */
    links?: Link[];
    /** A manually specified start time for the created `Span` object. */
    startTime?: TimeInput;
    /** The new span should be a root span. (Ignore parent from context). */
    root?: boolean;
}
//# sourceMappingURL=SpanOptions.d.ts.map
