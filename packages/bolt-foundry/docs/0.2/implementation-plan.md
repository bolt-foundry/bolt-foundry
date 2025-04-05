# Bolt Foundry Library: Version 0.2 Implementation Plan

## Version Summary

Version 0.2 builds upon the foundation established in 0.1, focusing on enhancing
the analytics capabilities of the Bolt Foundry library. This version provides
richer insights into OpenAI API usage through improved PostHog integration,
standardized event schemas, and cost tracking.

## Changes From Previous Version

Version 0.1 established the core functionality of intercepting OpenAI API calls
and basic logging. Version 0.2 enhances this by:

1. Adding richer metadata to analytics events following PostHog AI schema
2. Improving error resilience and handling
3. Enhancing PostHog integration with standardized event schemas
4. Adding configuration options for more flexible usage
5. Implementing cost calculation for better tracking

## Technical Goals

- ✅ Create a comprehensive event tracking schema aligned with PostHog AI
  standards
- ✅ Implement accurate cost calculation for OpenAI API usage
- ✅ Enhance error handling and resilience
- ✅ Provide flexible configuration options for clients

## Components and Implementation Details

### 1. Enhanced Analytics Integration

The core of this version is improving the PostHog integration to capture richer,
more standardized data.

#### Implementation Details

- ✅ Adopt PostHog's AI observability schema for standardized tracking
- ✅ Implement proper error event tracking with detailed context

```typescript
// Implemented event structure
const properties: Record<string, unknown> = {
  "$ai_provider": "openai",
  "$ai_model": requestBody.model,
  "$ai_input_tokens": responseBody.usage.prompt_tokens,
  "$ai_output_tokens": responseBody.usage.completion_tokens,
  "$ai_total_tokens": responseBody.usage.total_tokens,
  "$ai_latency": latency,
  "$ai_response_id": responseBody.id,
  "$ai_input": requestBody.messages,
  "$ai_output_choices": responseBody.choices,
  "$ai_is_error": res.status >= 400,
  "$ai_http_status": res.status,
  "$ai_model_parameters": {
    temperature: requestBody.temperature,
    max_tokens: requestBody.max_tokens,
    top_p: requestBody.top_p,
  },
  "$ai_base_url": "https://api.openai.com/v1",
  "$ai_cost": calculatedCost,
};
```

### 2. Cost Calculation

- ✅ Implement cost calculation based on model and token usage
- ✅ Track and report costs to help developers monitor API expenses

### 3. Error Handling

- ✅ Improved error catching and reporting
- ✅ Standardized error format with proper context
- ✅ Error events tracked with PostHog for monitoring

### 4. Configuration Options

- ✅ Allow customization of tracking behavior
- ✅ Support for providing PostHog client or API key
- ✅ Enable/disable specific tracking features

## Integration Examples

```typescript
// Basic usage with API keys
const openAiFetch = createOpenAIFetch({
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  posthogApiKey: process.env.POSTHOG_API_KEY || "",
});

// Advanced usage with a PostHog client
const posthogClient = new PostHog("api-key");
const openAiFetch = createOpenAIFetch({
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  posthogClient,
});

// Make request to OpenAI API using the enhanced fetch
const response = await openAiFetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    }),
  },
);
```

## Testing Strategy

### Unit Tests

- ✅ Test PostHog event structure for compliance with AI schema
- ✅ Test cost calculation accuracy
- ✅ Test error handling and resilience
- ✅ Test compatibility with different request formats (JSON, FormData)

### Integration Tests

- ✅ Test in NextJS sample application
- ✅ Test with real API calls (with mocked responses)

## Future Considerations (for v0.3)

- Support for additional LLM providers (Anthropic, Claude, etc.)
- A/B testing framework for comparing different LLM configurations
- Advanced analytics dashboards and visualizations
- Anomaly detection in usage patterns
- Cost optimization recommendations based on usage analytics
- Batch processing for high-volume applications

## Success Criteria for v0.2

Version 0.2 will be considered successful when:

1. ✅ PostHog events conform to the standard AI observability schema
2. ✅ Cost calculation is accurate for various models and usage patterns
3. ✅ Error handling provides meaningful context and is properly tracked
4. ✅ Configuration options allow for flexible use in different environments
5. ✅ Integration with NextJS sample works seamlessly

## Current Status

Most of the planned features for Version 0.2 have been implemented:

- ✓ Standardized event schema following PostHog AI conventions
- ✓ Cost tracking and calculation
- ✓ Improved error handling
- ✓ Flexible configuration options
- ✓ NextJS sample integration

Remaining tasks:

- Complete final unit tests
- Update documentation with more integration examples
- Gather feedback from early users
