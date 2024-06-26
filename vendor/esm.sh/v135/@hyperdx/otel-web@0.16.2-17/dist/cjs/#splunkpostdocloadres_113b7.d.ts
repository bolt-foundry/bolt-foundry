import { InstrumentationBase, InstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation@0.40.0/build/src/index.d.ts';
export interface SplunkPostDocLoadResourceInstrumentationConfig extends InstrumentationConfig {
    allowedInitiatorTypes?: string[];
    ignoreUrls?: (string | RegExp)[];
}
export declare class SplunkPostDocLoadResourceInstrumentation extends InstrumentationBase {
    private performanceObserver;
    private headMutationObserver;
    private urlToContextMap;
    private config;
    constructor(config?: SplunkPostDocLoadResourceInstrumentationConfig);
    init(): void;
    enable(): void;
    disable(): void;
    onBeforeContextChange(): void;
    private _startPerformanceObserver;
    private _startHeadMutationObserver;
    private _processHeadMutationObserverRecords;
    private _createSpan;
}
