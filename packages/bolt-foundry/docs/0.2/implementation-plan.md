# Bolt Foundry Library: Version 0.2 Implementation Plan

## Version Summary

Version 0.2 builds upon the foundation established in 0.1, focusing on enhancing
the analytics capabilities of the Bolt Foundry library. This version aims to
provide richer insights into OpenAI API usage through improved PostHog
integration, more comprehensive event tracking, and better error handling.

## Changes From Previous Version

Version 0.1 established the core functionality of intercepting OpenAI API calls
and basic logging. Version 0.2 enhances this by:

1. Adding richer metadata to analytics events
2. Improving error resilience and handling
3. Enhancing PostHog integration with standardized event schemas
4. Adding configuration options for more flexible usage
5. Implementing cost calculation for better tracking

## Technical Goals

- Create a comprehensive event tracking schema aligned with PostHog AI standards
- Implement accurate cost calculation for OpenAI API usage

## Components and Implementation Details

### 1. Enhanced Analytics Integration

The core of this version is improving the PostHog integration to capture richer,
more standardized data.

#### Implementation Details

- Adopt PostHog's AI observability schema for standardized tracking
- Implement proper error event tracking with detailed context

```typescript
// Example event structure
const properties: Record<string, unknown> = {
  "$ai_provider": "openai",
  "$ai_model": requestBody.model,
  "$ai_input": requestBody.messages?.[requestBody.messages.length - 1]?.content,
  "$ai_input_tokens": responseBody.usage.prompt_tokens,
  "$ai_cache_read_input_tokens": cachedTokens || 0,
  "$ai_output_tokens": responseBody.usage.completion_tokens,
  "$ai_latency": latency,
  "$ai_is_error": res.status >= 400,
  "$ai_http_status": res.status,
  "$ai_reasoning_tokens": requestBody.logprobs ? responseBody.usage.completion_tokens : 0,
  "$ai_tools": requestBody.tools || [],
  "$ai_output_choices": responseBody.choices?.length || 1,
  // Rich metadata about the request
  "$ai_model_parameters": {
    temperature: requestBody.temperature,
    max_tokens: requestBody.max_tokens,
    top_p: requestBody.top_p,
    // Additional parameters as available
  },
};
```



## Testing Strategy

### Unit Tests

- Test PostHog event structure for compliance with AI schema

## Future Considerations (for v0.3+)

- Support for additional LLM providers (Anthropic, etc.)
- Advanced analytics dashboards and visualizations
- Anomaly detection in usage patterns
- Cost optimization recommendations based on usage analytics
- Batch processing for high-volume applications

## Success Criteria for v0.2

Version 0.2 will be considered successful when:

1. PostHog events conform to the standard AI observability schema

This implementation plan provides the roadmap for enhancing the Bolt Foundry
library with more comprehensive analytics capabilities in Version 0.2.
