# Bolt Foundry library

**Version:** 0.2 (Current) **Date:** 2025-04-05

## Project Purpose

We're creating a tool that helps startups who use NextJS and the Vercel SDK
track their application usage and send analytics data to PostHog. This provides
valuable insights into how users interact with their AI features, helping
improve performance and reduce costs.

## Project Versions Overview & Status

1. **Version 0.1: Foundation** ✅ COMPLETED
   - Set up a basic NextJS application with chat functionality as a sample
   - Implemented library to replace the default fetch call in the Vercel AI SDK
   - Added logging capabilities to console using our logger

2. **Version 0.2: Analytics Integration** 🔄 IN PROGRESS
   - Added PostHog event capture functionality
   - Implemented proper event tracking for AI interactions following PostHog AI
     schema
   - Added cost calculation for API usage
   - Enhanced error handling and resilience
   - Added configuration options for more flexible usage
   - Current status: Core functionality implemented, tests written, and NextJS
     sample integration working

3. **Version 0.3: Experimentation Framework** 🔜 PLANNED
   - Set up framework for running A/B tests comparing different LLM calls
   - Build comparison reporting tools
   - Add more advanced cost tracking features
   - Create custom dashboards for visualizing usage data

## User Personas

1. **AI Developer**
   - Needs to understand how users interact with AI features
   - Wants to optimize costs associated with LLM API calls
   - Requires visibility into performance metrics

2. **Product Manager**
   - Needs data to make informed decisions about AI feature development
   - Wants to run experiments to test different approaches
   - Requires simple dashboards showing key metrics

## Current Features

- **OpenAI API Integration**: Intercepts OpenAI API calls and enhances them with
  tracking
- **PostHog Analytics**: Captures detailed events following the PostHog AI
  schema
- **Cost Tracking**: Calculates API usage costs for better monitoring
- **Performance Monitoring**: Tracks latency and other performance metrics
- **Error Handling**: Improved error resilience and context
- **Flexible Configuration**: Options for customizing tracking behavior

## Integration Examples

The library can be easily integrated into NextJS applications. Example
implementation:

```typescript
// Create enhanced fetch with analytics tracking
const openAiFetch = connectBoltFoundry({
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  posthogApiKey: process.env.POSTHOG_NEXTJS_API_KEY || "",
});

// Use it in your API routes
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

## Analytics Event Schema

Events conform to the PostHog AI observability schema:

```typescript
{
  "$ai_provider": "openai",
  "$ai_model": "gpt-3.5-turbo",
  "$ai_input_tokens": 10,
  "$ai_output_tokens": 20,
  "$ai_total_tokens": 30,
  "$ai_latency": 0.003,
  "$ai_response_id": "chatcmpl-123",
  "$ai_input": [{ role: "user", content: "Hello" }],
  "$ai_output_choices": [...],
  "$ai_model_parameters": {
    "temperature": 0.7,
    "max_tokens": 150,
    "top_p": undefined,
  },
  "$ai_base_url": "https://api.openai.com/v1",
  "$ai_cost": 0.00005,
  "$ai_http_status": 200,
  "$ai_is_error": false,
}
```

## Success Metrics

- Successfully intercept and log all OpenAI API calls
- Accurately track and report on usage patterns in PostHog
- Provide measurable insights that help reduce API costs
- Minimal performance impact on the host application

## Risks and Mitigation

- **Risk**: Performance degradation due to additional tracking
  - **Mitigation**: Batch events and use non-blocking calls

- **Risk**: Privacy concerns with tracking user interactions
  - **Mitigation**: Provide clear documentation on data collection and
    anonymization options

- **Risk**: Compatibility issues with different NextJS versions
  - **Mitigation**: Test across multiple versions and provide version-specific
    documentation

## Next Steps

- Complete remaining unit tests for Version 0.2
- Improve documentation with more integration examples
- Begin planning for Version 0.3 experimentation framework
- Gather feedback from early adopters
