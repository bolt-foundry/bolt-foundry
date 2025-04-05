# Bolt Foundry Library Backlog

This document captures potential features, enhancements, and improvements for
the Bolt Foundry library that are currently out of scope for immediate
implementation but may be incorporated in future versions.

## Features

### Token Caching System

**Priority**: Medium **Type**: Feature Enhancement **Complexity**: Moderate
**Target Version**: 0.3

**Description**: Implement a token caching mechanism that stores and reuses
tokens from previous LLM requests to reduce API costs and improve performance.

**Justification**: LLM APIs charge by token usage. Caching tokens from previous
requests for similar inputs could significantly reduce costs for repetitive
operations. This would be especially valuable for applications with frequent
similar queries.

**Dependencies**:

- Implementation of token counting functionality
- Storage mechanism for cached responses
- Cache invalidation strategy

**Acceptance Criteria**:

- Cache hit rate of at least 15% in typical usage scenarios
- No perceptible latency increase from cache lookups
- Configurable cache size and TTL settings
- Option to bypass cache when fresh responses are required
- Proper handling of sensitive information in cached responses

**Why aren't we working on this yet?** Currently focusing on core analytics
functionality and integration capabilities. Caching is an optimization that
makes more sense after we have established usage patterns and can determine the
most effective caching strategy.

### Enhanced Error Handling Framework

**Priority**: High **Type**: Enhancement **Complexity**: Moderate **Target
Version**: 0.3

**Description**: Develop a comprehensive error handling framework specifically
for LLM API interactions, with detailed error categorization, recovery
strategies, and retry logic.

**Justification**: Current error handling is basic. A more sophisticated system
would improve reliability and provide better feedback to developers when things
go wrong.

**Dependencies**:

- Error taxonomy definition
- Integration with existing analytics tracking

**Acceptance Criteria**:

- Categorized errors (rate limiting, context length, content policy, etc.)
- Automatic retries with exponential backoff for transient failures
- Fallback options for critical path operations
- Detailed error reporting in logs and analytics

**Why aren't we working on this yet?** Need to gather more real-world error
patterns from production usage before implementing a comprehensive solution.

### Multi-Provider Adapter System

**Priority**: High **Type**: Feature **Complexity**: Complex **Target Version**:
0.3

**Description**: Extend beyond OpenAI to support multiple LLM providers
(Anthropic, Cohere, etc.) with a unified interface for analytics tracking.

**Justification**: Many applications use multiple LLM providers for different
use cases or as fallbacks. Supporting analytics across all of them would provide
more comprehensive insights.

**Dependencies**:

- Provider-specific response parsers
- Token counting for each provider's model
- Standardized event schema across providers

**Acceptance Criteria**:

- Support for at least 3 major LLM providers
- Unified analytics reporting across all providers
- Provider-specific cost calculations
- Easy addition of new providers

**Why aren't we working on this yet?** Need to solidify the OpenAI
implementation first before expanding to other providers.

## Technical Debt

### Refactor Token Counting Logic

**Priority**: Medium **Type**: Technical Debt **Complexity**: Simple **Target
Version**: 0.3

**Description**: Extract and centralize token counting logic into a dedicated
module with provider-specific implementations.

**Justification**: Current token counting is scattered across different parts of
the codebase. Centralizing and standardizing this would make it easier to
maintain and extend.

**Dependencies**: None

**Acceptance Criteria**:

- Unified token counting interface
- Support for different tokenization methods
- Unit tests for accuracy
- Documentation for extending to new models

**Why aren't we working on this yet?** Current implementation works adequately
for immediate needs, and other features have higher priority.
