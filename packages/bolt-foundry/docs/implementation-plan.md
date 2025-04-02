# Bolt Foundry Implementation Plan

## Overview

This document outlines the design and implementation of the
`@bolt-foundry/bolt-foundry` package, which serves as a middleware for OpenAI
API calls. The package intercepts fetch requests to OpenAI's API, applies
customizations, and tracks analytics data with PostHog.

## Design Principles

1. **Transparency**: The middleware should be non-intrusive and maintain the
   original API interface.
2. **Analytics**: All API calls should be tracked for performance monitoring and
   usage patterns.
3. **Model Management**: Standardize model usage across the application to
   control costs.
4. **Error Handling**: Robust error handling without disrupting the application
   flow.

## Implementation Phases

### Phase 1: Core Fetch Interception (Simple)

- Create a wrapper around the native `fetch` function
- Detect OpenAI API calls based on URL patterns
- Add API key to authorization headers
- Pass through non-OpenAI calls without modification

### Phase 2: Request Modification (Moderate)

- Parse request bodies for OpenAI calls
- Modify model parameters to standardize on `gpt-3.5-turbo`
- Ensure proper formatting of API requests

### Phase 3: Analytics Integration (Moderate)

- Integrate PostHog for tracking API usage
- Capture important metrics:
  - Model used
  - Token counts (input/output)
  - Latency
  - HTTP status
  - Trace IDs for request tracking

### Phase 4: Error Handling (Simple)

- Implement proper error handling for network issues
- Log errors without breaking application flow
- Ensure analytics data is flushed even when errors occur

## Connected Systems

The implementation touches the following parts of the system:

- [PostHog Analytics Integration](packages/bolt-foundry/bolt-foundry.ts)
- [Logger System](packages/logger/logger.ts)

## Appendix: Data Flow

### OpenAI Request Lifecycle

1. Application makes a fetch request to OpenAI API
2. `boltFoundryFetch` intercepts the request
3. Request is modified:
   - API key is added
   - Model is standardized
4. Modified request is sent to OpenAI
5. Response is received and cloned
6. Analytics data is extracted and sent to PostHog
7. Original response is returned to the application

### Analytics Data Structure

```typescript
type AnalyticsProperties = {
  $ai_trace_id: string;
  $ai_model: string;
  $ai_provider: string;
  $ai_input: any[];
  $ai_input_tokens: number;
  $ai_output_choices: any[];
  $ai_output_tokens: number;
  $ai_latency: number;
  $ai_http_status: number;
  $ai_base_url: string;
};
```

### Class Structure

```typescript
/**
 * Creates a wrapped fetch function that intercepts OpenAI API calls,
 * adds authentication, standardizes models, and tracks analytics.
 */
export function connectToOpenAi(
  openAiApiKey: string,
  posthogApiKey: string,
): typeof fetch;
```
