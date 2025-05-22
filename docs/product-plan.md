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
structured prompts. Great LLM applications are:

1. **Well understood** — Clear semantic structure and intent
2. **Testable** — Individual components can be verified
3. **Resilient to changes** — Modifications don't break unrelated functionality
4. **Easily updated** — Clear upgrade paths and version management

Users can either generate prompts locally with our SDK or use our cloud service
to experiment, test, and improve prompts automatically.

## Architecture Overview

### Fluent Builder SDK

Engineers compose prompts using a structured [DSL](https://en.wikipedia.org/wiki/Domain-specific_language):

```typescript
.persona("assistant", (b) => 
  b.description("You are a helpful assistant.")
   .trait("Explains spatial layouts visually")
   .constraints("Safety", (b) => b.constraint("Never mention prices"))
   .behaviors("furniture", (b) => 
     b.behavior("layout designer", (b) =>
       b.format("Return Markdown with sub-headings")
        .reference("https://design-principles.pdf")
        .goal("Deliver three viable layouts"))))
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
- **0.2 →** OpenAI API integration with generated prompts
  - Metric: Prompts generated from converted prompts (initial engagement)
- **0.3 →** Improved JSON response consistency measurement
  - Metric: Samples received through structured prompts (activation)
- **0.4 →** Remote Prompt Service with persisted prompt IDs
  - Metric: Prompts served via hash-based lookup (platform adoption)
- **0.5 →** A/B testing and experimentation framework
  - Metric: Initial test runs completed (early value realization)

### Private Beta (v0.6-0.7)

**Goal**: Cloud-based prompt optimization and experimentation

**Target Audience**: Private beta with invited developers and waitlist

- **0.6 →** Prompt IDE for building and testing prompts
  - Metric: Prompts generated (primary KPI - engagement)
- **0.7 →** Heatmaps and prompt analytics dashboard
  - Metric: Samples received per user (activation depth)

**Product Validation**: Use beta partner feedback to determine which potential
products (Prompt IDE, Heatmaps, Backtesting, A/B Testing, Unit Testing) to
prioritize based on actual developer pain points and usage patterns observed
during beta.

### Public Beta (v0.8-0.9)

**Goal**: Prepare for PLG with professional brand presence

**Target Audience**: Open PLG targeting individual developers

**Key Differentiator**: "Actually know how to fix your prompts. Know if they're
working, and if they're not, how to fix them."

- **0.8 →** Marketing foundation and professional brand presence
  - Homepage redesign and professional brand presence
  - Case studies and content from Private Beta users
  - Clear positioning and messaging framework development
  - Developer marketing strategy definition
  - Content marketing foundation for discovery
  - Metric: Site visits and waitlist signups (top of funnel)
- **0.9 →** Full platform launch with core features
  - Metric: Test runs completed (key lagging indicator - value realization)

### Future Work (v1.0+)

**Goal**: Enterprise features and advanced capabilities

**Target Audience**: Enterprise customers and advanced users

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

- Alpha (0.1-0.3) → Internal adoption and API integration success
- Beta (0.4-0.6) → Platform usage and experimentation activity
- 1.0 (0.7-1.0) → Customer acquisition and revenue growth

The ultimate measure of success is developers choosing structured prompts over
text strings for new LLM applications, indicating we've solved the core
maintainability and reliability problems.
