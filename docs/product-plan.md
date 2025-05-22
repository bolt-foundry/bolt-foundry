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

Engineers compose prompts using a structured DSL:

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

### Phase 1: Foundation (v0.1-0.3)

**Goal**: Internal developers can migrate from text prompts to structured
prompts

**Target Audience**: Internal team and selected partners (alpha)

- **0.1 →** CLI tool for restructuring existing prompts into fluent builder API
  - Metric: Internal developers successfully using tool (Dan can generate and
    use prompts)
- **0.2 →** OpenAI API integration with generated prompts
  - Metric: Successful API calls with structured prompts
- **0.3 →** Improved JSON response consistency measurement
  - Metric: Increase in JSON responses vs raw text/backticked JSON

### Phase 2: Platform (v0.4-0.6)

**Goal**: Cloud-based prompt optimization and experimentation

**Target Audience**: Private beta with invited developers and waitlist

- **0.4 →** Remote Prompt Service with persisted prompt IDs
  - Metric: Prompts served via hash-based lookup
- **0.5 →** A/B testing and experimentation framework
  - Metric: Active experiments running
- **0.6 →** Prompt IDE for building and testing prompts
  - Metric: Prompts created through web interface

### Marketing Foundation (Between Phase 2 & 3)

**Goal**: Prepare for PLG growth with professional brand presence

**Key Differentiator**: "Actually know how to fix your prompts. Know if they're working, and if they're not, how to fix them."

- Homepage redesign and professional brand presence
- Case studies and content from Phase 2 beta users
- Clear positioning and messaging framework development
- Developer marketing strategy definition
- Content marketing foundation for discovery
- Metric: External developers can evaluate the product professionally

### Phase 3: Intelligence (v0.7-1.0)

**Goal**: Automated prompt optimization and insights

**Target Audience**: Open PLG growth targeting individual developers

- **0.7 →** Automated backtesting and performance analysis
  - Metric: Prompts automatically optimized based on performance data
- **0.8 →** Heatmaps and prompt analytics dashboard
  - Metric: Actionable insights generated from prompt usage
- **1.0 →** Full platform launch with enterprise features
  - Metric: External customers actively using platform

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

- 0.1-0.3 → Internal adoption and API integration success
- 0.4-0.6 → Platform usage and experimentation activity
- 0.7-1.0 → Customer acquisition and revenue growth

The ultimate measure of success is developers choosing structured prompts over
text strings for new LLM applications, indicating we've solved the core
maintainability and reliability problems.
