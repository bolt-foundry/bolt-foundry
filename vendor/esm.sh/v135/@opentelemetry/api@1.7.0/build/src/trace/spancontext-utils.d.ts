import { Span } from './span.d.ts';
import { SpanContext } from './span_context.d.ts';
export declare function isValidTraceId(traceId: string): boolean;
export declare function isValidSpanId(spanId: string): boolean;
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */
export declare function isSpanContextValid(spanContext: SpanContext): boolean;
/**
 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
 *
 * @param spanContext span context to be wrapped
 * @returns a new non-recording {@link Span} with the provided context
 */
export declare function wrapSpanContext(spanContext: SpanContext): Span;
//# sourceMappingURL=spancontext-utils.d.ts.map
