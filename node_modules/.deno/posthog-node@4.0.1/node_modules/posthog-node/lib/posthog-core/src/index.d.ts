import { PostHogFetchOptions, PostHogFetchResponse, PostHogAutocaptureElement, PostHogDecideResponse, PostHogCoreOptions, PostHogEventProperties, PostHogPersistedProperty, PostHogCaptureOptions, JsonType } from './types';
import { RetriableOptions } from './utils';
export * as utils from './utils';
import { LZString } from './lz-string';
import { SimpleEventEmitter } from './eventemitter';
export declare abstract class PostHogCoreStateless {
    private apiKey;
    host: string;
    private flushAt;
    private maxBatchSize;
    private maxQueueSize;
    private flushInterval;
    private flushPromise;
    private requestTimeout;
    private featureFlagsRequestTimeoutMs;
    private captureMode;
    private removeDebugCallback?;
    private disableGeoip;
    disabled: boolean;
    private defaultOptIn;
    private pendingPromises;
    protected _events: SimpleEventEmitter;
    protected _flushTimer?: any;
    protected _retryOptions: RetriableOptions;
    protected _initPromise: Promise<void>;
    protected _isInitialized: boolean;
    abstract fetch(url: string, options: PostHogFetchOptions): Promise<PostHogFetchResponse>;
    abstract getLibraryId(): string;
    abstract getLibraryVersion(): string;
    abstract getCustomUserAgent(): string | void;
    abstract getPersistedProperty<T>(key: PostHogPersistedProperty): T | undefined;
    abstract setPersistedProperty<T>(key: PostHogPersistedProperty, value: T | null): void;
    constructor(apiKey: string, options?: PostHogCoreOptions);
    protected wrap(fn: () => void): void;
    protected getCommonEventProperties(): any;
    get optedOut(): boolean;
    optIn(): Promise<void>;
    optOut(): Promise<void>;
    on(event: string, cb: (...args: any[]) => void): () => void;
    debug(enabled?: boolean): void;
    get isDebug(): boolean;
    private buildPayload;
    protected addPendingPromise<T>(promise: Promise<T>): Promise<T>;
    /***
     *** TRACKING
     ***/
    protected identifyStateless(distinctId: string, properties?: PostHogEventProperties, options?: PostHogCaptureOptions): void;
    protected captureStateless(distinctId: string, event: string, properties?: {
        [key: string]: any;
    }, options?: PostHogCaptureOptions): void;
    protected aliasStateless(alias: string, distinctId: string, properties?: {
        [key: string]: any;
    }, options?: PostHogCaptureOptions): void;
    /***
     *** GROUPS
     ***/
    protected groupIdentifyStateless(groupType: string, groupKey: string | number, groupProperties?: PostHogEventProperties, options?: PostHogCaptureOptions, distinctId?: string, eventProperties?: PostHogEventProperties): void;
    /***
     *** FEATURE FLAGS
     ***/
    protected getDecide(distinctId: string, groups?: Record<string, string | number>, personProperties?: Record<string, string>, groupProperties?: Record<string, Record<string, string>>, extraPayload?: Record<string, any>): Promise<PostHogDecideResponse | undefined>;
    protected getFeatureFlagStateless(key: string, distinctId: string, groups?: Record<string, string>, personProperties?: Record<string, string>, groupProperties?: Record<string, Record<string, string>>, disableGeoip?: boolean): Promise<boolean | string | undefined>;
    protected getFeatureFlagPayloadStateless(key: string, distinctId: string, groups?: Record<string, string>, personProperties?: Record<string, string>, groupProperties?: Record<string, Record<string, string>>, disableGeoip?: boolean): Promise<JsonType | undefined>;
    protected getFeatureFlagPayloadsStateless(distinctId: string, groups?: Record<string, string>, personProperties?: Record<string, string>, groupProperties?: Record<string, Record<string, string>>, disableGeoip?: boolean): Promise<PostHogDecideResponse['featureFlagPayloads'] | undefined>;
    protected _parsePayload(response: any): any;
    protected getFeatureFlagsStateless(distinctId: string, groups?: Record<string, string | number>, personProperties?: Record<string, string>, groupProperties?: Record<string, Record<string, string>>, disableGeoip?: boolean): Promise<PostHogDecideResponse['featureFlags'] | undefined>;
    protected getFeatureFlagsAndPayloadsStateless(distinctId: string, groups?: Record<string, string | number>, personProperties?: Record<string, string>, groupProperties?: Record<string, Record<string, string>>, disableGeoip?: boolean): Promise<{
        flags: PostHogDecideResponse['featureFlags'] | undefined;
        payloads: PostHogDecideResponse['featureFlagPayloads'] | undefined;
    }>;
    /***
     *** QUEUEING AND FLUSHING
     ***/
    protected enqueue(type: string, _message: any, options?: PostHogCaptureOptions): void;
    private clearFlushTimer;
    /**
     * Helper for flushing the queue in the background
     * Avoids unnecessary promise errors
     */
    private flushBackground;
    flush(): Promise<any[]>;
    protected getCustomHeaders(): {
        [key: string]: string;
    };
    private _flush;
    private fetchWithRetry;
    shutdown(shutdownTimeoutMs?: number): Promise<void>;
}
export declare abstract class PostHogCore extends PostHogCoreStateless {
    private sendFeatureFlagEvent;
    private flagCallReported;
    protected _decideResponsePromise?: Promise<PostHogDecideResponse | undefined>;
    protected _sessionExpirationTimeSeconds: number;
    protected sessionProps: PostHogEventProperties;
    constructor(apiKey: string, options?: PostHogCoreOptions);
    protected setupBootstrap(options?: Partial<PostHogCoreOptions>): void;
    private get props();
    private set props(value);
    private clearProps;
    private _props;
    on(event: string, cb: (...args: any[]) => void): () => void;
    reset(propertiesToKeep?: PostHogPersistedProperty[]): void;
    protected getCommonEventProperties(): any;
    private enrichProperties;
    /**
     * * @returns {string} The stored session ID for the current session. This may be an empty string if the client is not yet fully initialized.
     */
    getSessionId(): string;
    resetSessionId(): void;
    /**
     * * @returns {string} The stored anonymous ID. This may be an empty string if the client is not yet fully initialized.
     */
    getAnonymousId(): string;
    /**
     * * @returns {string} The stored distinct ID. This may be an empty string if the client is not yet fully initialized.
     */
    getDistinctId(): string;
    unregister(property: string): Promise<void>;
    register(properties: {
        [key: string]: any;
    }): Promise<void>;
    registerForSession(properties: {
        [key: string]: any;
    }): void;
    unregisterForSession(property: string): void;
    /***
     *** TRACKING
     ***/
    identify(distinctId?: string, properties?: PostHogEventProperties, options?: PostHogCaptureOptions): void;
    capture(event: string, properties?: {
        [key: string]: any;
    }, options?: PostHogCaptureOptions): void;
    alias(alias: string): void;
    autocapture(eventType: string, elements: PostHogAutocaptureElement[], properties?: PostHogEventProperties, options?: PostHogCaptureOptions): void;
    /***
     *** GROUPS
     ***/
    groups(groups: {
        [type: string]: string | number;
    }): void;
    group(groupType: string, groupKey: string | number, groupProperties?: PostHogEventProperties, options?: PostHogCaptureOptions): void;
    groupIdentify(groupType: string, groupKey: string | number, groupProperties?: PostHogEventProperties, options?: PostHogCaptureOptions): void;
    /***
     * PROPERTIES
     ***/
    setPersonPropertiesForFlags(properties: {
        [type: string]: string;
    }): void;
    resetPersonPropertiesForFlags(): void;
    /** @deprecated - Renamed to setPersonPropertiesForFlags */
    personProperties(properties: {
        [type: string]: string;
    }): void;
    setGroupPropertiesForFlags(properties: {
        [type: string]: Record<string, string>;
    }): void;
    resetGroupPropertiesForFlags(): void;
    /** @deprecated - Renamed to setGroupPropertiesForFlags */
    groupProperties(properties: {
        [type: string]: Record<string, string>;
    }): void;
    /***
     *** FEATURE FLAGS
     ***/
    private decideAsync;
    private _decideAsync;
    private setKnownFeatureFlags;
    private setKnownFeatureFlagPayloads;
    getFeatureFlag(key: string): boolean | string | undefined;
    getFeatureFlagPayload(key: string): JsonType | undefined;
    getFeatureFlagPayloads(): PostHogDecideResponse['featureFlagPayloads'] | undefined;
    getFeatureFlags(): PostHogDecideResponse['featureFlags'] | undefined;
    getFeatureFlagsAndPayloads(): {
        flags: PostHogDecideResponse['featureFlags'] | undefined;
        payloads: PostHogDecideResponse['featureFlagPayloads'] | undefined;
    };
    isFeatureEnabled(key: string): boolean | undefined;
    reloadFeatureFlags(cb?: (err?: Error, flags?: PostHogDecideResponse['featureFlags']) => void): void;
    reloadFeatureFlagsAsync(sendAnonDistinctId?: boolean): Promise<PostHogDecideResponse['featureFlags'] | undefined>;
    onFeatureFlags(cb: (flags: PostHogDecideResponse['featureFlags']) => void): () => void;
    onFeatureFlag(key: string, cb: (value: string | boolean) => void): () => void;
    overrideFeatureFlag(flags: PostHogDecideResponse['featureFlags'] | null): Promise<void>;
}
export * from './types';
export { LZString };
