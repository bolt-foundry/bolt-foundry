# Collector Backlog

This document captures potential features, enhancements, and improvements for
the Collector application that are currently out of scope for immediate
implementation but may be incorporated in future versions.

## Features

### Reverse PostHog Proxy (collector.boltfoundry.com/rp)

**Priority**: Medium **Type**: Feature **Complexity**: Moderate **Target
Version**: 0.3

**Description**: Implement a reverse proxy endpoint at `/rp` that receives and
forwards analytics data to PostHog while maintaining all original request
properties.

**Justification**: A dedicated reverse proxy endpoint would allow direct PostHog
API usage while still enabling us to collect, analyze, and potentially transform
analytics data. This provides flexibility for clients that want to use PostHog's
native SDKs directly rather than our interceptor approach.

**Dependencies**:

- Authentication and authorization system
- Request/response transformation utilities
- Rate limiting implementation

**Acceptance Criteria**:

- Endpoint accepts all PostHog-compatible requests
- Requests are forwarded to PostHog with proper authentication
- Response data from PostHog is returned intact to the client
- Request metadata is captured for analytics purposes
- No sensitive information is logged or stored permanently

**Why aren't we working on this yet?** We need to complete the core collector
implementation first to establish patterns for authentication, data
sanitization, and request handling before extending to this proxy approach.
