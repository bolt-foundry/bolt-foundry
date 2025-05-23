# Collector Implementation Plan - Version 0.1 [PAUSED]

**Version:** 0.1 **Date:** 2023-11-14 **Status:** PAUSED (May 15, 2025)

## Status Update

This project has been paused pending product strategy rethinking. The current
approach to collecting OpenAI SDK calls and analytics may be reconsidered as
part of a broader product direction change. No development work should proceed
on this project until further notice.

## Original Version Summary

Initial foundation for the collector system that captures OpenAI SDK calls and
responses, moving the PostHog logging logic from the frontend bolt-foundry
package to the backend collector.

## Technical Goals

- Move PostHog analytics logic from bolt-foundry frontend package to collector
  backend
- Implement a basic interceptor for OpenAI SDK calls
- Create a mirror authentication system using PostHog API keys
- Build the initial data collection pipeline
- Ensure minimal performance impact on API requests

## Components and Implementation

### 1. API Interceptor (Complexity: Moderate)

- **Purpose**: Capture OpenAI SDK calls and responses without modifying client
  code
- **Technical Specifications**:
  - Create new server modeled after web/web.tsx called collector/collector.ts
  - Implement request/response capture pattern from an openai call (completions
    for now)
  - Ensure no openai keys are accidentally captured or logged.

### 2. PostHog Integration (Complexity: Simple)

- **Purpose**: Send captured API analytics to PostHog
- **Technical Specifications**:
  - Port existing code from bolt-foundry npm package
  - Structure events according to existing schema

### 3. Reroute bolt-foundry package interception to go to collector instead of posthog directly

- **Technical Specifications**:
  - Modify bolt-foundry package to intercept OpenAI API calls and send to
    collector endpoint
  - Create configuration options in bolt-foundry package to specify collector
    URL
  - Implement fallback behavior to ensure API calls continue working if
    collector is unavailable

## Integration Points

### Bolt-Foundry Integration

- **Current**: The bolt-foundry package currently sends analytics directly to
  PostHog
- **Change**: Update bolt-foundry to send OpenAI API calls and responses to
  collector backend
- **Migration Strategy**:
  - Update bolt-foundry configuration to support redirecting to collector
  - Ensure the openai calls never fail even if our collector is not available

## Out of scope

- Ensure collector properly handles all OpenAI API endpoints
- Support streaming responses
- Maintain backward compatibility with all SDK versions
- Implement robust error handling for malformed requests
- Performance degradation due to additional processing
  - Mitigation: Implement asynchronous processing and minimal request blocking
- OpenAI API changes breaking compatibility
  - Mitigation: Design flexible schema that can adapt to API changes
- Privacy concerns with data collection
  - Mitigation: Implement robust header-based controls for limiting data
    collection
- High resource usage under load
  - Mitigation: Implement throttling and resource limits

## Success Criteria for v0.1

Version 0.1 will be considered successful when:

1. PostHog logic is successfully moved from frontend to collector backend
2. OpenAI API calls hit the posthog api from the collector backend instead of
   the user's bolt-foundry package hitting posthog directly
3. Integration with bolt-foundry package is seamless

## Next Steps for Version 0.2

- Create our own API key generation and management system
- Implement persona and behavior card building functionality
- Add metadata injection capabilities for request control
- Build more sophisticated analytics for API usage patterns
