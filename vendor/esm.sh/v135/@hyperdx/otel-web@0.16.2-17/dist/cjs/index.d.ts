import { InstrumentationConfig } from 'https://esm.sh/v135/@opentelemetry/instrumentation@0.40.0/build/src/index.d.ts';
import { ReadableSpan, SpanExporter, SpanProcessor, BufferConfig, AlwaysOffSampler, AlwaysOnSampler, ParentBasedSampler } from 'https://esm.sh/v135/@opentelemetry/sdk-trace-base@1.14.0/build/src/index.d.ts';
import { WebTracerConfig } from 'https://esm.sh/v135/@opentelemetry/sdk-trace-web@1.14.0/build/src/index.d.ts';
import { Attributes } from 'https://esm.sh/v135/@opentelemetry/api@1.4.1/build/src/index.d.ts';
import { SplunkUserInteractionInstrumentationConfig, UserInteractionEventsConfig } from './SplunkUserInteractionInstrumentation.d.ts';
import { SessionIdType } from './session.d.ts';
import { SplunkPostDocLoadResourceInstrumentationConfig } from './SplunkPostDocLoadResourceInstrumentation.d.ts';
import { SplunkWebTracerProvider } from './SplunkWebTracerProvider.d.ts';
import { RumOtelWebEventTarget } from './EventTarget.d.ts';
import { ContextManagerConfig } from './SplunkContextManager.d.ts';
import { SplunkSpanAttributesProcessor } from './SplunkSpanAttributesProcessor.d.ts';
import { SessionBasedSampler } from './SessionBasedSampler.d.ts';
import { SocketIoClientInstrumentationConfig } from './SplunkSocketIoClientInstrumentation.d.ts';
import { HyperDXConsoleInstrumentation } from './HyperDXConsoleInstrumentation.d.ts';
import type { HyperDXFetchInstrumentationConfig } from './HyperDXFetchInstrumentation.d.ts';
import type { HyperDXXMLHttpRequestInstrumentationConfig } from './HyperDXXMLHttpRequestInstrumentation.d.ts';
export * from './SplunkWebTracerProvider.d.ts';
export * from './SessionBasedSampler.d.ts';
interface SplunkOtelWebOptionsInstrumentations {
    console?: boolean | HyperDXConsoleInstrumentation;
    document?: boolean | InstrumentationConfig;
    errors?: boolean;
    fetch?: boolean | HyperDXFetchInstrumentationConfig;
    interactions?: boolean | SplunkUserInteractionInstrumentationConfig;
    longtask?: boolean | InstrumentationConfig;
    visibility?: boolean | InstrumentationConfig;
    connectivity?: boolean | InstrumentationConfig;
    postload?: boolean | SplunkPostDocLoadResourceInstrumentationConfig;
    socketio?: boolean | SocketIoClientInstrumentationConfig;
    websocket?: boolean | InstrumentationConfig;
    webvitals?: boolean;
    xhr?: boolean | HyperDXXMLHttpRequestInstrumentationConfig;
}
export interface RumOtelWebExporterOptions {
    /**
     * Allows remapping Span's attributes right before they're serialized.
     * One potential use case of this method is to remove PII from the attributes.
     */
    onAttributesSerializing?: (attributes: Attributes, span: ReadableSpan) => Attributes;
}
export interface RumOtelWebConfig {
    /** Allows http beacon urls */
    allowInsecureUrl?: boolean;
    /** Application name
     * @deprecated Renamed to `applicationName`
     */
    app?: string;
    /** Application name */
    applicationName?: string;
    /**
     * Destination for the captured data
     * @deprecated Renamed to `beaconEndpoint`, or use realm
     */
    beaconUrl?: string;
    /** Destination for the captured data */
    url: string | undefined;
    /** Options for context manager */
    context?: ContextManagerConfig;
    /** Sets session cookie to this domain */
    cookieDomain?: string;
    /** Turns on/off internal debug logging */
    debug?: boolean;
    /**
     * Sets a value for the `environment` attribute (persists through calls to `setGlobalAttributes()`)
     * */
    deploymentEnvironment?: string;
    /**
     * Sets a value for the `environment` attribute (persists through calls to `setGlobalAttributes()`)
     * @deprecated Renamed to `deploymentEnvironment`
     */
    environment?: string;
    /**
     * Sets a value for the 'app.version' attribute
     */
    version?: string;
    /** Allows configuring how telemetry data is sent to the backend */
    exporter?: RumOtelWebExporterOptions;
    /** Sets attributes added to every Span. */
    globalAttributes?: Attributes;
    /**
     * Applies for XHR, Fetch and Websocket URLs. URLs that partially match any regex in ignoreUrls will not be traced.
     * In addition, URLs that are _exact matches_ of strings in ignoreUrls will also not be traced.
     * */
    ignoreUrls?: Array<string | RegExp>;
    /** Configuration for instrumentation modules. */
    instrumentations?: SplunkOtelWebOptionsInstrumentations;
    /**
     * Publicly-visible `apiKey` value.  Please do not paste any other access token or auth value into here, as this
     * will be visible to every user of your app
     * */
    apiKey: string | undefined;
    /**
     * Config options passed to web tracer
     */
    tracer?: WebTracerConfig;
}
interface RumOtelWebConfigInternal extends RumOtelWebConfig {
    bufferSize?: number;
    bufferTimeout?: number;
    exporter: RumOtelWebExporterOptions & {
        factory: (config: {
            url: string;
            authHeader?: string;
        }) => SpanExporter;
    };
    instrumentations: SplunkOtelWebOptionsInstrumentations;
    spanProcessor: {
        factory: <T extends BufferConfig>(exporter: SpanExporter, config: T) => SpanProcessor;
    };
}
export declare const INSTRUMENTATIONS_ALL_DISABLED: SplunkOtelWebOptionsInstrumentations;
export interface RumOtelWebType extends RumOtelWebEventTarget {
    deinit: () => void;
    error: (...args: Array<any>) => void;
    init: (options: RumOtelWebConfig) => void;
    /**
     * Allows experimental options to be passed. No versioning guarantees are given for this method.
     */
    _internalInit: (options: Partial<RumOtelWebConfigInternal>) => void;
    provider?: SplunkWebTracerProvider;
    attributesProcessor?: SplunkSpanAttributesProcessor;
    setGlobalAttributes: (attributes: Attributes) => void;
    /**
     * This method provides access to computed, final value of global attributes, which are applied to all created spans.
     */
    getGlobalAttributes: () => Attributes;
    /**
     * This method allows user to add custom action event
     */
    addAction: (name: string, attributes?: Attributes) => void;
    /**
     * @deprecated Use {@link getGlobalAttributes()}
     */
    _experimental_getGlobalAttributes: () => Attributes;
    /**
     * This method returns current session ID
     */
    getSessionId: () => SessionIdType | undefined;
    /**
     * @deprecated Use {@link getSessionId()}
     */
    _experimental_getSessionId: () => SessionIdType | undefined;
    DEFAULT_AUTO_INSTRUMENTED_EVENTS: UserInteractionEventsConfig;
    DEFAULT_AUTO_INSTRUMENTED_EVENT_NAMES: (keyof HTMLElementEventMap)[];
    AlwaysOnSampler: typeof AlwaysOnSampler;
    AlwaysOffSampler: typeof AlwaysOffSampler;
    ParentBasedSampler: typeof ParentBasedSampler;
    SessionBasedSampler: typeof SessionBasedSampler;
    readonly inited: boolean;
}
export declare const Rum: RumOtelWebType;
export default Rum;
