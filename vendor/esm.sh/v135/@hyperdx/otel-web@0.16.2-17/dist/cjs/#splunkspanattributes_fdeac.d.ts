import { Attributes } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { Span, SpanProcessor } from 'https://esm.sh/v135/@opentelemetry/sdk-trace-base@1.14.0/build/src/index.d.ts';
export declare class SplunkSpanAttributesProcessor implements SpanProcessor {
    private readonly _globalAttributes;
    constructor(globalAttributes: Attributes);
    setGlobalAttributes(attributes?: Attributes): void;
    getGlobalAttributes(): Attributes;
    forceFlush(): Promise<void>;
    onStart(span: Span): void;
    onEnd(): void;
    shutdown(): Promise<void>;
}
