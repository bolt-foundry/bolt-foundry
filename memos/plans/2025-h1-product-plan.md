# BF product plan 2025

## Vision

**Build structured prompt engineering**: Transform prompt engineering from text
strings into composable cards with examples and specifications that make LLM
applications reliable, testable, and maintainable.

## Core problem

Every LLM prompt today is a text string. While some programming works this way
(notably SQL), most programmers build programs using ASTs with embedded semantic
meaning that can be standardized across invocations.

Many programmers hate the SQL approach and use ORMs like Rails ActiveRecord or
Prisma to escape text creation. Even databases don't use the actual text. They
build more efficient queries through query planners.

**Why do we take the SQL approach when talking to LLMs?**

Text prompts are the best first version, but they create four problems:

- **Brittleness**: Changing one part breaks unrelated functionality
- **Maintainability**: No clear structure or semantic meaning
- **Testability**: Hard to verify prompt components work as intended
- **Composability**: Difficult to reuse prompt patterns across projects

## What we're building

A library and platform for building LLM applications through structured prompts
organized as composable cards. Great LLM applications are:

1. **Well understood**: Clear semantic structure and intent
2. **Testable**: Individual components can be verified
3. **Resilient to changes**: Modifications don't break unrelated functionality
4. **Easily updated**: Clear upgrade paths and version management

Users generate prompts locally with our SDK or use our cloud service to
experiment, test, and improve prompts automatically.

## Architecture overview

### Fluent builder SDK

Engineers compose prompts using a structured
[DSL](https://en.wikipedia.org/wiki/Domain-specific_language) based on cards:

```typescript
// Traditional approach: Brittle string concatenation
const prompt = "You are a customer support agent. Be helpful and empathetic. " +
  "Don't make promises about refunds. Always be professional. " +
  "User query: " + userMessage;

// Bolt Foundry approach: Structured, reusable cards
import { BfClient } from "@bolt-foundry/bolt-foundry";

const client = BfClient.create();

const supportAgent = client.createAssistantCard(
  "customer-support",
  (card) =>
    card
      .spec("You are a customer support agent")
      .specs("personality", (p) =>
        p.spec("Be helpful and empathetic")
          .spec("Always be professional", {
            samples: (s) =>
              s.sample("Whatever, that's not my problem.", -3)
                .sample("Look, I don't have time for this right now.", -2)
                .sample("Yeah, okay, what do you want?", -1)
                .sample("I can help you with that.", 1)
                .sample("I'd be happy to assist you with this issue.", 2)
                .sample(
                  "I'll do everything I can to resolve this for you.",
                  3,
                ),
          }))
      .specs("policies", (p) =>
        p.spec("Don't make promises about refunds", {
          samples: (s) =>
            s.sample(
              "I understand your frustration. Let me check what options we have.",
              3,
            )
              .sample("Yes, I'll refund everything immediately!", -3),
        }))
      .context((ctx) =>
        ctx.string("userMessage", "What is the customer asking about?")
      ),
);

// Use the card with OpenAI (or any LLM)
const response = await client.fetch(
  "https://api.openai.com/v1/chat/completions",
  {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify(supportAgent.render({
      "userMessage": "I want a refund!!",
    })),
  },
);
```

The -3 to +3 scoring system isn't just about examples. It's about achieving
[99% reliability through inference-time control](../../docs/guides/improving-inference-philosophy.md).
By making behavioral choices explicit and auditable, teams build AI systems as
reliable as any other mission-critical software.

### Persisted prompt IDs

During build, the SDK serializes every prompt node into canonical JSON
fragments. Each fragment is hashed (SHA-256 → Base-58) creating a 44-character
Persisted Prompt ID. At runtime, the SDK requests prompts by ID along with
contextual parameters (locale, LLM, experiment flags).

**Same hash, flexible response**: The hash anchors the meaning, not exact
wording. The Remote Prompt Service returns optimized text for the caller's
context while preserving traceability: translations, personalized variants, or
A/B experiments.

### Core components

1. **Canonicalizer & Hashing**: Deterministic hashing shared by SDK and service
2. **Collector**: Receives hashes, full prompts, and responses for analysis
3. **Caching & Offline Mode**: Hash→text pairs cached; offline mode for CI
4. **Remote Prompt Service**: Centralized prompt optimization and
   experimentation

## Product roadmap

_Note: This roadmap represents our current planning and is subject to change
based on user feedback and what we learn. Features and timelines are tentative._

### Alpha (v0.1-0.5)

**Goal**: Internal developers can migrate from text prompts to structured
prompts

**Target audience**: Internal team and selected partners

**First revenue**: Alpha customers pay monthly subscription fees for early
access to structured prompt tooling and priority support, establishing pricing
model and willingness to pay before full credit system implementation.

- **0.1 →** Interactive Documentation & Examples
  - Problem-focused documentation showing real use cases
  - Interactive demos developers can try immediately
  - Before/after code comparisons demonstrating the value
  - "Why structured prompts?" explainer with concrete examples
  - **Implementation details:**
    - Streamlined examples folder with multiple LLM provider examples
    - Minimal chat app template with TypeScript and Express backend
    - Self-contained examples that work as starter projects
    - Node.js focused with proper TypeScript support
  - Metric: Documentation engagement & reduction in 1:1 explanation needs
- **0.2 →** CLI tool for restructuring existing prompts into fluent builder API
  - Metric: People using prompt converter (trial)
- **0.3 →** Web-based GUI prompt reformatter with Google authentication
  - Users log in with Google and convert prompts via web interface
  - Results stored in database or provided as TypeScript code to copy/paste
  - Metric: Web conversions completed (platform engagement)
- **0.4 →** Side-by-side prompt testing UI with JSON validation
  - Compare original prompts vs BF-style prompts in parallel
  - First evaluation: JSON response consistency measurement
  - Visual comparison of outputs and performance metrics
  - Metric: Test runs completed (validation of structured prompts)
- **0.5 →** Custom evaluation builder and testing framework
  - Users can construct custom evals beyond JSON validation
  - Run evals against prompts with A/B testing capabilities
  - Compare performance across different prompt versions
  - Metric: Custom evals created and run (platform depth)

### Private beta (v0.6-0.8)

**Goal**: Scale from white glove onboarding to automated self-serve experience

**Target audience**: Private beta with invited developers and waitlist,
transitioning from individually onboarded partners to automated onboarding at
scale

- **0.6 →** Product TBD based on user research
  - Feature to be determined from Alpha user feedback and research
  - Metric: To be defined based on selected product direction
- **0.7 →** Automated onboarding and billing system
  - Self-serve onboarding flow for new users
  - Credit-based billing implementation
  - User dashboard for usage tracking and credit management
  - Documentation and tutorials for self-service
  - Metric: Successful self-serve onboardings (automation success)
- **0.8 →** Marketing foundation and professional brand presence
  - Homepage redesign and professional brand presence
  - Case studies and content from Alpha/Beta users
  - Clear positioning and messaging framework development
  - Developer marketing strategy definition
  - Content marketing foundation for discovery
  - Metric: Site visits and waitlist signups (top of funnel)

**Product validation**: Use beta partner feedback to determine which potential
products to prioritize based on actual developer pain points and usage patterns
observed during beta.

### Public beta (v0.9-1.0)

**Goal**: Iterate towards public launch

**Target Audience**: Open PLG targeting individual developers

**Key Differentiator**: "Actually know how to fix your prompts. Know if they're
working, and if they're not, how to fix them."

- **0.9 →** Product TBD based on beta feedback
  - Feature to be determined from Private Beta user feedback
  - Metric: To be defined based on selected product direction
- **0.95 →** Fixathon - Polish and stability improvements
  - Bug fixes and performance optimizations
  - UI/UX refinements based on user feedback
  - Documentation and onboarding improvements
  - Metric: Bug closure rate and performance benchmarks
- **1.0 →** Full platform public launch
  - Official public release with stable feature set
  - Metric: Test runs completed (key lagging indicator - value realization)

### Potential Future Work (v1.0+)

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

- Alpha (0.1-0.5) → Internal adoption and API integration success
- Private Beta (0.6-0.8) → Product discovery, automation, and marketing
  foundation
- Public Beta (0.9-1.0) → Customer acquisition and revenue growth

The ultimate measure of success is developers choosing structured prompts over
text strings for new LLM applications, indicating we've solved the core
maintainability and reliability problems.
