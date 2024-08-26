import { JsonType, PostHogCoreOptions, PostHogCoreStateless, PostHogFetchOptions, PostHogFetchResponse, PostHogFlagsAndPayloadsResponse, PostHogPersistedProperty } from '../../posthog-core/src';
import { EventMessage, GroupIdentifyMessage, IdentifyMessage, PostHogNodeV1 } from './types';
export declare type PostHogOptions = PostHogCoreOptions & {
    persistence?: 'memory';
    personalApiKey?: string;
    featureFlagsPollingInterval?: number;
    maxCacheSize?: number;
    fetch?: (url: string, options: PostHogFetchOptions) => Promise<PostHogFetchResponse>;
};
export declare class PostHog extends PostHogCoreStateless implements PostHogNodeV1 {
    private _memoryStorage;
    private featureFlagsPoller?;
    private maxCacheSize;
    readonly options: PostHogOptions;
    distinctIdHasSentFlagCalls: Record<string, string[]>;
    constructor(apiKey: string, options?: PostHogOptions);
    getPersistedProperty(key: PostHogPersistedProperty): any | undefined;
    setPersistedProperty(key: PostHogPersistedProperty, value: any | null): void;
    fetch(url: string, options: PostHogFetchOptions): Promise<PostHogFetchResponse>;
    getLibraryId(): string;
    getLibraryVersion(): string;
    getCustomUserAgent(): string;
    enable(): Promise<void>;
    disable(): Promise<void>;
    debug(enabled?: boolean): void;
    capture({ distinctId, event, properties, groups, sendFeatureFlags, timestamp, disableGeoip, uuid, }: EventMessage): void;
    identify({ distinctId, properties, disableGeoip }: IdentifyMessage): void;
    alias(data: {
        distinctId: string;
        alias: string;
        disableGeoip?: boolean;
    }): void;
    getFeatureFlag(key: string, distinctId: string, options?: {
        groups?: Record<string, string>;
        personProperties?: Record<string, string>;
        groupProperties?: Record<string, Record<string, string>>;
        onlyEvaluateLocally?: boolean;
        sendFeatureFlagEvents?: boolean;
        disableGeoip?: boolean;
    }): Promise<string | boolean | undefined>;
    getFeatureFlagPayload(key: string, distinctId: string, matchValue?: string | boolean, options?: {
        groups?: Record<string, string>;
        personProperties?: Record<string, string>;
        groupProperties?: Record<string, Record<string, string>>;
        onlyEvaluateLocally?: boolean;
        sendFeatureFlagEvents?: boolean;
        disableGeoip?: boolean;
    }): Promise<JsonType | undefined>;
    isFeatureEnabled(key: string, distinctId: string, options?: {
        groups?: Record<string, string>;
        personProperties?: Record<string, string>;
        groupProperties?: Record<string, Record<string, string>>;
        onlyEvaluateLocally?: boolean;
        sendFeatureFlagEvents?: boolean;
        disableGeoip?: boolean;
    }): Promise<boolean | undefined>;
    getAllFlags(distinctId: string, options?: {
        groups?: Record<string, string>;
        personProperties?: Record<string, string>;
        groupProperties?: Record<string, Record<string, string>>;
        onlyEvaluateLocally?: boolean;
        disableGeoip?: boolean;
    }): Promise<Record<string, string | boolean>>;
    getAllFlagsAndPayloads(distinctId: string, options?: {
        groups?: Record<string, string>;
        personProperties?: Record<string, string>;
        groupProperties?: Record<string, Record<string, string>>;
        onlyEvaluateLocally?: boolean;
        disableGeoip?: boolean;
    }): Promise<PostHogFlagsAndPayloadsResponse>;
    groupIdentify({ groupType, groupKey, properties, distinctId, disableGeoip }: GroupIdentifyMessage): void;
    reloadFeatureFlags(): Promise<void>;
    shutdown(shutdownTimeoutMs?: number): Promise<void>;
    private addLocalPersonAndGroupProperties;
}
