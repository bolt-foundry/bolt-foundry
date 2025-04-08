import type { PostHog } from "posthog-node";
/**
 * Options for OpenAI API configuration
 */
export type OpenAiOptions = {
    /**
     * The OpenAI API key to use for authentication
     */
    openAiApiKey: string;
    /**
     * Optional PostHog client for analytics tracking
     */
    posthogClient?: PostHog;
    /**
     * Optional PostHog API key (alternative to providing a client)
     */
    posthogApiKey?: string;
    /**
     * Optional PostHog host URL (defaults to app.posthog.com)
     */
    posthogHost?: string;
};
/**
 * Creates a wrapped fetch function that adds necessary headers and handles OpenAI API requests.
 * This implementation adds authentication headers, preserves FormData requests, and tracks analytics.
 */
export declare function createOpenAIFetch(options: OpenAiOptions): typeof fetch;
//# sourceMappingURL=bolt-foundry.d.ts.map