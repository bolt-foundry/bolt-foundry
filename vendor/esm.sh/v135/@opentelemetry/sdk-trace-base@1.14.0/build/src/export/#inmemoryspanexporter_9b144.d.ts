import { SpanExporter } from './SpanExporter.d.ts';
import { ReadableSpan } from './ReadableSpan.d.ts';
import { ExportResult } from 'https://esm.sh/v135/@opentelemetry/core@1.14.0/build/src/index.d.ts';
/**
 * This class can be used for testing purposes. It stores the exported spans
 * in a list in memory that can be retrieved using the `getFinishedSpans()`
 * method.
 */
export declare class InMemorySpanExporter implements SpanExporter {
    private _finishedSpans;
    /**
     * Indicates if the exporter has been "shutdown."
     * When false, exported spans will not be stored in-memory.
     */
    protected _stopped: boolean;
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    shutdown(): Promise<void>;
    /**
     * Exports any pending spans in the exporter
     */
    forceFlush(): Promise<void>;
    reset(): void;
    getFinishedSpans(): ReadableSpan[];
}
//# sourceMappingURL=InMemorySpanExporter.d.ts.map
