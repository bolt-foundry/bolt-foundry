import { Context } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { Span } from '../Span.d.ts';
import { SpanProcessor } from '../SpanProcessor.d.ts';
import { ReadableSpan } from './ReadableSpan.d.ts';
import { SpanExporter } from './SpanExporter.d.ts';
/**
 * An implementation of the {@link SpanProcessor} that converts the {@link Span}
 * to {@link ReadableSpan} and passes it to the configured exporter.
 *
 * Only spans that are sampled are converted.
 */
export declare class SimpleSpanProcessor implements SpanProcessor {
    private readonly _exporter;
    private _shutdownOnce;
    private _unresolvedExports;
    constructor(_exporter: SpanExporter);
    forceFlush(): Promise<void>;
    onStart(_span: Span, _parentContext: Context): void;
    onEnd(span: ReadableSpan): void;
    shutdown(): Promise<void>;
    private _shutdown;
}
//# sourceMappingURL=SimpleSpanProcessor.d.ts.map
