# Bolt Foundry LLM Analytics Implementation Plan

## Reasoning First

### Why This Project Matters

Developers flying blind with LLM calls waste money and deliver worse
experiences. Right now, they copy-paste logs into spreadsheets or rely on gut
feel to understand what's happening. They use Vercel's AI SDK to call various
LLM providers but can't see which models perform best for which tasks or how
much they're spending.

Without data on what works, developers can't route requests to the right models
or fine-tune for specific needs. They need a solution that captures performance
data without changing their workflow, then turns that data into actionable
insights. Better data means faster iterations and happier users.

### Core Problems to Solve

1. **Flying Blind**: Developers can't see what's happening with their LLM
   calls - no metrics, no insights
2. **Money Drain**: Without tracking token usage and performance, costs spiral
   with no clear ROI
3. **Integration Friction**: Adding analytics shouldn't require rewriting
   existing code
4. **Model Personality Chaos**: No way to define what makes a "good" response
   for different use cases
5. **Manual Model Selection**: Developers hardcode model choices instead of
   using data to pick the right tool for each job

## Conceptual Design

### Design Principles

- **Drop-in Solution**: You shouldn't have to rewrite your app to add analytics
- **Honest Data Collection**: We only capture what you explicitly allow
- **Works Everywhere**: Use any LLM provider without changing how you collect
  data
- **Speed Matters**: Analytics should never slow down your user experience

### Integration Approaches

We'll give developers three ways to start collecting data, from easiest to most
powerful:

1. **One-Line Setup**: Add a single line to intercept all LLM calls
   automatically
2. **Wrapped Clients**: Swap your provider client with our wrapped version
3. **Framework Plugins**: Use our Vercel AI SDK plugin for deeper integration

### Data Flow

1. Application makes an LLM request through our middleware
2. Middleware captures request details before forwarding to provider
3. Response from provider is captured and analyzed
4. Original response is returned to application unmodified
5. Analytics data is processed asynchronously to minimize latency

## Implementation Phases

### Phase 1: Core Analytics Middleware (Simple)

This phase focuses on the foundational middleware architecture that will capture
basic metrics without modifying the client's existing call patterns.

**Key Components:**

- Custom fetch implementation for intercepting API calls
- Configuration registry for API keys and settings
- Basic metrics collection (latency, token counts, costs)
- Storage adapter interface for analytics data

### Phase 2: Provider-Specific Adapters (Moderate)

This phase extends support to major LLM providers and frameworks, with specific
focus on Vercel AI SDK compatibility.

**Key Components:**

- Vercel AI SDK integration
- OpenAI, Anthropic, and other provider adapters
- Enhanced metric collection (usage patterns, error rates)
- Client wrapper implementations for direct API use

### Phase 3: Advanced Analytics & Dashboard (Complex)

This phase focuses on meaningful analysis of collected data and provides
visualization tools for insights.

**Key Components:**

- Content pattern analysis
- Cost and performance analytics
- Dashboard for visualization
- Export capabilities for external analysis

### Phase 4: Intelligent Routing (Challenging)

This phase implements dynamic routing of LLM requests based on content, history,
and optimization goals.

**Key Components:**

- Request characteristic analysis
- Rule-based routing engine
- Performance-based optimization
- A/B testing framework

### Phase 5: Identity & Behavior Cards (Complex)

This final phase establishes the framework for automatically generating and
utilizing identity and behavior cards for fine-tuning.

**Key Components:**

- Identity card schema and generation
- Behavior card definition framework
- Integration with fine-tuning pipelines
- Feedback loop for continuous improvement

## User Journeys

### Developer Integration Journey

1. Developer installs the Bolt Foundry package
2. They register their API key through the global setup
3. They choose their preferred integration method
4. They make minimal code changes to enable analytics
5. They access the dashboard to view collected metrics

### Analytics User Journey

1. User logs into analytics dashboard
2. They view usage patterns across different LLM callsites
3. They identify optimization opportunities based on metrics
4. They configure routing rules based on insights
5. They export data for deeper analysis

### Fine-Tuning Journey

1. User identifies a callsite that would benefit from a specialized model
2. They generate identity and behavior cards based on usage patterns
3. They customize the cards to reflect desired behaviors
4. They initiate fine-tuning based on these definitions
5. They configure routing to use the fine-tuned model for appropriate requests

## Risks and Testing

### Testing the Risks

- **Will this slow down my app?**
  - Test actual latency impact with and without middleware
  - Move non-critical data processing outside the request path
  - Measure overhead in milliseconds, not percentages

- **Is this hard to add to my code?**
  - Watch real developers try to integrate in under 10 minutes
  - Create starter templates for common frameworks
  - Test with developers who didn't build the library

- **What if my LLM provider changes their API?**
  - Run daily tests against all supported providers
  - Build provider-specific adapters that shield you from changes
  - Set up alerts for API drifts before they break production

- **Is my sensitive data safe?**
  - Let developers filter sensitive content before storage
  - Encrypt everything in transit and at rest
  - Test security with actual penetration testing

## Measure What Works

- **Time to First Insight**: How quickly developers go from install to their
  first actionable insight
- **Speed Tax**: Added milliseconds per request versus direct API calls
- **Money Saved**: Actual dollars saved through better model selection and
  reduced token usage
- **Fewer Bad Responses**: Percentage reduction in user-reported poor responses
- **Faster Development**: Hours saved by automated analytics versus manual
  logging
