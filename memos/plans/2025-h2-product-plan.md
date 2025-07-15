# Bolt Foundry H2 2025 Product Plan

_Product roadmap for July-December 2025_

## Executive Summary

Bolt Foundry's H2 2025 focus is delivering a production-ready
[RLHF pipeline](../apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md)
that enables internal teams to align on LLM behavior definitions and get
actionable insights for improvement.

## Core Product Definition

**What we're building**: A customer success platform where internal teams (PM +
Engineering + etc.) can:

1. Agree on how their LLM should behave
   ([graders/decks](../apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md))
2. Evaluate real usage against those standards
3. Get clear guidance on what to change

**Current state**: Working technical foundation with pilot customer not yet
using the system

**H2 Goal**: Multiple customers actively using the
[RLHF feedback loop](../apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md)
to improve their LLMs

## Implementation Phases

### Phase 1: Foundation

**Goal**: Complete RLHF data model and authentication

- [ ] Extend [bfdb](../apps/bfDb/memos/guides/data-model.md) with
      [BfSample, BfDeck, BfGrader, BfGraderResult nodes](../apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md)
- [ ] [GraphQL schema extensions](../apps/bfDb/builders/graphql/README.md)
- [ ] [Google OAuth authentication](../apps/boltFoundry/components/CurrentViewer/LoginWithGoogleButton.tsx)
- [ ] [Organization/person management](../apps/bfDb/classes/CurrentViewer.ts)

### Phase 2: API Integration

**Goal**: Sample ingestion pipeline working

- [ ] [bolt-foundry library](../packages/bolt-foundry/README.md) extension for
      sample collection
- [ ] Sample storage endpoints
- [ ] Organization-scoped data access
- [ ] Basic web interface scaffolding

### Phase 3: Core UI

**Goal**: Customer-facing dashboard operational

- [ ] Sample management interface
- [ ] Deck/grader configuration UI
- [ ] Evaluation workflow
- [ ] Grader result visualization

### Phase 4: Customer Success

**Goal**: Pilot customer actively using feedback loop

- [ ] Deploy to pilot customer
- [ ] Train their team on the workflow
- [ ] Collect usage data and iterate
- [ ] Document replicable customer onboarding process

## Success Metrics

### 30-Day Success Criteria

- [ ] [Pilot customer](../customers/example-customer.com/) team regularly using
      feedback loop
- [ ] Working RLHF pipeline ready for replication
- [ ] Clear customer onboarding process documented

### 90-Day Success Criteria

- [ ] 3+ customers actively using the system
- [ ] Measurable improvement in customer LLM performance
- [ ] Self-service customer onboarding functional

## Customer-Centric Focus

**Primary customer**: Internal teams building LLM applications **Core value**:
Systematic improvement through team alignment and actionable feedback **Key
workflow**: Define behavior → Evaluate samples → Get specific improvement
guidance

## Technical Priorities

1. **Customer-facing UI**: Priority #1 - customers need to see their data
2. **Sample ingestion**: Core pipeline for collecting evaluation data
3. **Organization isolation**: Secure, multi-tenant data access
4. **Evaluation workflow**: Intuitive process for running graders on samples

## Next Actions

1. Begin Phase 1 foundation work
2. Focus on [pilot customer](../customers/example-customer.com/) success case
3. Build replicable customer onboarding process
4. Prepare for additional customer implementations

_This plan prioritizes customer success and real usage over feature
completeness._

## Appendix: Related Resources

### Implementation Plans

- [RLHF Pipeline Data Model Implementation](../apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md) -
  Detailed technical implementation plan for the RLHF pipeline
- [H1 2025 Product Plan](./2025-h1-product-plan.md) - Previous roadmap and
  context

### Strategic Documentation

- [Company Vision](../memos/guides/company-vision.md) - Core mission and vision
- [Business Vision](../memos/guides/business-vision.md) - Go-to-market strategy
  and revenue model
- [Big Picture Strategy](../memos/guides/big-picture-strategy.md) - Strategic
  positioning
- [Library Vision](../memos/guides/library-vision.md) - Technical library
  approach
- [Measurement Strategy](../memos/guides/measurement-strategy.md) - KPIs and
  success metrics

### Technical Architecture

- [Current Status](../memos/guides/STATUS.md) - Project status and priorities
- [AIBFF Product Plan](../apps/aibff/memos/guides/product-plan.md) - REPL tool
  roadmap
- [Internal Tools Plan](../apps/internalbf/memos/guides/product-plan.md) -
  Internal platform vision

### Customer Examples

- [Customer Implementation](../customers/example-customer.com/) - Real customer
  use case
