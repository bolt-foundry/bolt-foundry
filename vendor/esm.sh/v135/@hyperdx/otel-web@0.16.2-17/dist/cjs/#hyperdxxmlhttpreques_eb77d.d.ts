import { XMLHttpRequestInstrumentation, XMLHttpRequestInstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation-xml-http-request@0.40.0/build/src/index.d.ts';
export type HyperDXXMLHttpRequestInstrumentationConfig = XMLHttpRequestInstrumentationConfig & {
    advancedNetworkCapture?: () => boolean;
};
export declare class HyperDXXMLHttpRequestInstrumentation extends XMLHttpRequestInstrumentation {
    constructor(config?: HyperDXXMLHttpRequestInstrumentationConfig);
}
