/**
 * @file Adapted from [posthog-js](https://github.com/PostHog/posthog-js/blob/8157df935a4d0e71d2fefef7127aa85ee51c82d1/src/extensions/sentry-integration.ts) with modifications for the Node SDK.
 */
import { type PostHog } from '../posthog-node';
declare type _SentryEventProcessor = any;
declare type _SentryHub = any;
interface _SentryIntegration {
    name: string;
    setupOnce(addGlobalEventProcessor: (callback: _SentryEventProcessor) => void, getCurrentHub: () => _SentryHub): void;
}
/**
 * Integrate Sentry with PostHog. This will add a direct link to the person in Sentry, and an $exception event in PostHog.
 *
 * ### Usage
 *
 *     Sentry.init({
 *          dsn: 'https://example',
 *          integrations: [
 *              new PostHogSentryIntegration(posthog)
 *          ]
 *     })
 *
 *     Sentry.setTag(PostHogSentryIntegration.POSTHOG_ID_TAG, 'some distinct id');
 *
 * @param {Object} [posthog] The posthog object
 * @param {string} [organization] Optional: The Sentry organization, used to send a direct link from PostHog to Sentry
 * @param {Number} [projectId] Optional: The Sentry project id, used to send a direct link from PostHog to Sentry
 * @param {string} [prefix] Optional: Url of a self-hosted sentry instance (default: https://sentry.io/organizations/)
 */
export declare class PostHogSentryIntegration implements _SentryIntegration {
    private readonly posthog;
    private readonly posthogHost?;
    private readonly organization?;
    private readonly prefix?;
    readonly name = "posthog-node";
    static readonly POSTHOG_ID_TAG = "posthog_distinct_id";
    constructor(posthog: PostHog, posthogHost?: string | undefined, organization?: string | undefined, prefix?: string | undefined);
    setupOnce(addGlobalEventProcessor: (callback: _SentryEventProcessor) => void, getCurrentHub: () => _SentryHub): void;
}
export {};
