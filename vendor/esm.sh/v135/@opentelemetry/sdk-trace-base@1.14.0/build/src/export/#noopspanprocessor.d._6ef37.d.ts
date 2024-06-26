import { Context } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { ReadableSpan } from './ReadableSpan.d.ts';
import { Span } from '../Span.d.ts';
import { SpanProcessor } from '../SpanProcessor.d.ts';
/** No-op implementation of SpanProcessor */
export declare class NoopSpanProcessor implements SpanProcessor {
    onStart(_span: Span, _context: Context): void;
    onEnd(_span: ReadableSpan): void;
    shutdown(): Promise<void>;
    forceFlush(): Promise<void>;
}
//# sourceMappingURL=NoopSpanProcessor.d.ts.map
