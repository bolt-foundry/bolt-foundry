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

- [x] Extend [bfdb](../apps/bfDb/memos/guides/data-model.md) with
      [BfSample, BfDeck, BfGrader, BfGraderResult nodes](../apps/boltfoundry-com/memos/plans/rlhf-pipeline-data-model-implementation.md)
      _Status: 65% complete - all 5 BfNode types implemented with comprehensive
      test coverage_
- [ ] GraphQL schema extensions _Status: DELETED - removed from requirements_
- [ ] [Google OAuth authentication](../apps/boltFoundry/components/CurrentViewer/LoginWithGoogleButton.tsx)
      _Status: In progress - authentication infrastructure being developed_
- [ ] [Organization/person management](../apps/bfDb/classes/CurrentViewer.ts)
      _Status: In progress - organization scoping patterns implemented_

### Phase 2: API Integration

**Goal**: Sample ingestion pipeline working

- [ ] [bolt-foundry library](../packages/bolt-foundry/README.md) extension for
      sample collection _Status: In progress - sample collection patterns
      defined_
- [ ] Sample storage endpoints _Status: In progress - implementing REST API in
      collector app_
- [x] Organization-scoped data access _Status: Complete - CurrentViewer and
      cv.orgBfOid patterns implemented_
- [ ] Basic web interface scaffolding _Status: In progress - boltFoundry app
      foundation exists_

### Phase 3: Core UI

**Goal**: Customer-facing dashboard operational

- [ ] Sample management interface _Status: Planned - awaiting sample storage
      endpoints_
- [ ] Deck/grader configuration UI _Status: Planned - AIBFF GUI provides
      foundation patterns_
- [ ] Evaluation workflow _Status: In progress - moving from AIBFF GUI to
      boltfoundry-com web app_
- [ ] Grader result visualization _Status: In progress - grader result patterns
      defined in AIBFF_

### Phase 4: Customer Success

**Goal**: Pilot customer actively using feedback loop

- [ ] Deploy to pilot customer _Status: In progress - example-customer.com
      pipeline in development, not yet deployed_
- [ ] Train their team on the workflow _Status: In progress - targeting >90%
      accuracy milestone_
- [ ] Collect usage data and iterate _Status: In progress - usage analytics via
      collector app_
- [ ] Document replicable customer onboarding process _Status: Planned -
      awaiting pilot customer success validation_

## Success Metrics

### 30-Day Success Criteria

- [ ] [Pilot customer](../customers/example-customer.com/) team regularly using
      feedback loop _Status: Planned - needs deployment and inbox implementation
      first_
- [ ] Working RLHF pipeline ready for replication _Status: 65% complete - data
      model complete, GraphQL mutations needed_
- [ ] Clear customer onboarding process documented _Status: Planned - awaiting
      pilot customer validation_

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

1. **Complete REST API endpoints in collector app** for sample storage
2. **Build inbox system** for example-customer.com
3. **Deploy** example-customer.com pipeline and achieve >90% accuracy
4. **Migrate evaluation workflow** from AIBFF GUI to boltfoundry-com
5. **Redefine success metrics** based on actual deployment requirements
6. Build replicable customer onboarding process

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
