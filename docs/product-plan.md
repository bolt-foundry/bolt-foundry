# BF Product Plan 2025

## Vision

**Build the ORM for LLMs** — Transform prompt engineering from brittle text
strings into structured, semantic APIs that enable reliable, testable, and
maintainable LLM applications.

## Core Problem

Every prompt written for an LLM today is essentially a giant text string. While
some programming is done this way (most notably SQL), the majority of
programmers build programs using ASTs with embedded semantic meaning that can be
standardized across invocations.

Many programmers HATE the SQL approach and use ORMs like Rails ActiveRecord or
Prisma to escape text creation. Even databases don't use the actual text — they
build more efficient queries through query planners.

**Why do we take the SQL approach when talking to LLMs?**

Text prompts are the best first version, but they create fundamental problems:

- **Brittleness**: Changing one part breaks unrelated functionality
- **Maintainability**: No clear structure or semantic meaning
- **Testability**: Hard to verify prompt components work as intended
- **Composability**: Difficult to reuse prompt patterns across projects

## What We're Building

A comprehensive library and platform for building great LLM applications through
structured prompts organized as composable cards. Great LLM applications are:

1. **Well understood** — Clear semantic structure and intent
2. **Testable** — Individual components can be verified
3. **Resilient to changes** — Modifications don't break unrelated functionality
4. **Easily updated** — Clear upgrade paths and version management

Users can either generate prompts locally with our SDK or use our cloud service
to experiment, test, and improve prompts automatically.

### The Card Metaphor

We're building an "ORM for LLMs" using a trading card metaphor:

- **Cards are specs**: Each card is a collection of structured specifications
- **Persona Cards**: Define the AI's identity and constraints
- **Behavior Cards**: Define specific capabilities and workflows
- **Card Packs**: Collections of related cards for specific domains
- **Card Trading**: Share and exchange proven card patterns

## Architecture Overview

### Fluent Builder SDK

Engineers compose prompts using a structured
[DSL](https://en.wikipedia.org/wiki/Domain-specific_language) based on cards:

```typescript
// Building with cards
createCard("assistant", (b) => 
  b.specs("persona", (p) =>
    p.spec("You are a helpful assistant.")
     .spec("Explains spatial layouts visually"))
   .specs("constraints", (c) => 
     c.spec("Never mention prices"))
   .specs("furniture-layout", (f) => 
     f.spec("Return Markdown with sub-headings")
      .spec("Reference: https://design-principles.pdf")
      .spec("Deliver three viable layouts")))
```

### Persisted Prompt IDs

During build, the SDK serializes every prompt node into canonical JSON
fragments. Each fragment is hashed (SHA-256 → Base-58) creating a 44-character
Persisted Prompt ID. At runtime, the SDK requests prompts by ID along with
contextual parameters (locale, LLM, experiment flags).

**Same hash, flexible response** — The hash anchors the meaning, not exact
wording. The Remote Prompt Service can return optimized text for the caller's
context while preserving traceability: translations, personalized variants, or
A/B experiments.

### Core Components

1. **Canonicalizer & Hashing** — Deterministic hashing shared by SDK and service
2. **Collector** — Receives hashes, full prompts, and responses for analysis
3. **Caching & Offline Mode** — Hash→text pairs cached; offline mode for CI
4. **Remote Prompt Service** — Centralized prompt optimization and
   experimentation

## Product Roadmap

### Alpha (v0.1-0.5)

**Goal**: Internal developers can migrate from text prompts to structured
prompts

**Target Audience**: Internal team and selected partners

**First Revenue**: Alpha customers pay monthly subscription fees for early
access to structured prompt tooling and priority support, establishing pricing
model and willingness to pay before full credit system implementation.

- **0.1 →** CLI tool for restructuring existing prompts into fluent builder API
  - Metric: People using prompt converter (trial)
- **0.2 →** Web-based GUI prompt reformatter with Google authentication
  - Users log in with Google and convert prompts via web interface
  - Results stored in database or provided as TypeScript code to copy/paste
  - Metric: Web conversions completed (platform engagement)
- **0.3 →** Side-by-side prompt testing UI with JSON validation
  - Compare original prompts vs BF-style prompts in parallel
  - First evaluation: JSON response consistency measurement
  - Visual comparison of outputs and performance metrics
  - Metric: Test runs completed (validation of structured prompts)
- **0.4 →** Custom evaluation builder and testing framework
  - Users can construct custom evals beyond JSON validation
  - Run evals against prompts with A/B testing capabilities
  - Compare performance across different prompt versions
  - Metric: Custom evals created and run (platform depth)

### Private Beta (v0.5-0.7)

**Goal**: Scale from white glove onboarding to automated self-serve experience

**Target Audience**: Private beta with invited developers and waitlist,
transitioning from individually onboarded partners to automated onboarding at
scale

- **0.5 →** Product TBD based on user research
  - Feature to be determined from Alpha user feedback and research
  - Metric: To be defined based on selected product direction
- **0.6 →** Automated onboarding and billing system
  - Self-serve onboarding flow for new users
  - Credit-based billing implementation
  - User dashboard for usage tracking and credit management
  - Documentation and tutorials for self-service
  - Metric: Successful self-serve onboardings (automation success)
- **0.7 →** Marketing foundation and professional brand presence
  - Homepage redesign and professional brand presence
  - Case studies and content from Alpha/Beta users
  - Clear positioning and messaging framework development
  - Developer marketing strategy definition
  - Content marketing foundation for discovery
  - Metric: Site visits and waitlist signups (top of funnel)

**Product Validation**: Use beta partner feedback to determine which potential
products to prioritize based on actual developer pain points and usage patterns
observed during beta.

### Public Beta (v0.8-1.0)

**Goal**: Iterate towards public launch

**Target Audience**: Open PLG targeting individual developers

**Key Differentiator**: "Actually know how to fix your prompts. Know if they're
working, and if they're not, how to fix them."

- **0.8 →** Product TBD based on beta feedback
  - Feature to be determined from Private Beta user feedback
  - Metric: To be defined based on selected product direction
- **0.9 →** Fixathon - Polish and stability improvements
  - Bug fixes and performance optimizations
  - UI/UX refinements based on user feedback
  - Documentation and onboarding improvements
  - Metric: Bug closure rate and performance benchmarks
- **1.0 →** Full platform public launch
  - Official public release with stable feature set
  - Metric: Test runs completed (key lagging indicator - value realization)

### Future Work (v1.0+)

**Goal**: Enterprise features and advanced capabilities

**Target Audience**: Enterprise customers and advanced users

- **1.0+ →** Prompt IDE for building and testing prompts
  - Visual interface for creating structured prompts from scratch
  - Metric: Prompts generated (primary KPI - engagement)
- **1.0+ →** Heatmaps and prompt analytics dashboard
  - Visualization of prompt performance and attention patterns
  - Metric: Samples received per user (activation depth)
- **1.0+ →** A/B testing and experimentation framework
  - Advanced experimentation capabilities for production traffic
  - Metric: Initial test runs completed (early value realization)
- **1.0+ →** Remote Prompt Service with persisted prompt IDs
  - Hash-based prompt lookup and optimization
  - Metric: Prompts served via hash-based lookup (platform adoption)
- **1.0+ →** Automated backtesting and performance analysis
  - Metric: Active customers paying (revenue conversion)
- **1.0+ →** Enterprise features and advanced integrations
  - Metric: MRR growth (business sustainability)

## Potential Products

- **Library/SDK** — Core structured prompt builder
- **Prompt IDE** — Visual interface for building and testing prompts
- **Heatmaps** — Visualization of prompt performance and attention patterns
- **Backtesting** — Historical performance analysis for prompt changes
- **A/B Testing** — Controlled experimentation framework
- **Unit Testing** — Automated verification of prompt components

## Business Model

Following Replit's credit-based model:

- Monthly subscription with credits that expire monthly
- Usage-based value pricing through credits
- Flexible credit allocation for valued customers
- Feature unlocking through different credit tiers

## Success Metrics

**Primary KPI**: Number of structured prompts successfully serving production
traffic

**Phase Metrics**:

- Alpha (0.1-0.4) → Internal adoption and API integration success
- Private Beta (0.5-0.7) → Product discovery, automation, and marketing
  foundation
- Public Beta (0.8-1.0) → Customer acquisition and revenue growth

The ultimate measure of success is developers choosing structured prompts over
text strings for new LLM applications, indicating we've solved the core
maintainability and reliability problems.
