import { FetchInstrumentation, FetchInstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation-fetch@0.40.0/build/src/index.d.ts';
export type HyperDXFetchInstrumentationConfig = FetchInstrumentationConfig & {
    advancedNetworkCapture?: () => boolean;
};
export declare class HyperDXFetchInstrumentation extends FetchInstrumentation {
    constructor(config?: HyperDXFetchInstrumentationConfig);
    enable(): void;
}
