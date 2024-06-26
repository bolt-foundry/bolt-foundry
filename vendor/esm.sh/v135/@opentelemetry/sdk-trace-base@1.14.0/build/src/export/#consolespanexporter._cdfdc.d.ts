import { SpanExporter } from './SpanExporter.d.ts';
import { ReadableSpan } from './ReadableSpan.d.ts';
import { ExportResult } from 'https://esm.sh/v135/@opentelemetry/core@1.14.0/build/src/index.d.ts';
/**
 * This is implementation of {@link SpanExporter} that prints spans to the
 * console. This class can be used for diagnostic purposes.
 */
export declare class ConsoleSpanExporter implements SpanExporter {
    /**
     * Export spans.
     * @param spans
     * @param resultCallback
     */
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    /**
     * Shutdown the exporter.
     */
    shutdown(): Promise<void>;
    /**
     * Exports any pending spans in exporter
     */
    forceFlush(): Promise<void>;
    /**
     * converts span info into more readable format
     * @param span
     */
    private _exportInfo;
    /**
     * Showing spans in console
     * @param spans
     * @param done
     */
    private _sendSpans;
}
//# sourceMappingURL=ConsoleSpanExporter.d.ts.map
