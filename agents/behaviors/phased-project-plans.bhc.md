# Phased Project Plans Protocol

When creating project plans that span multiple phases of development, follow
these guidelines to ensure clear progression and accountability.

## Version-Based Planning

- Create phase-specific project plan documents in project-specific docs
  directories
- Use semantic versioning (0.0.X) for each project phase
- Store phase documents in version-specific subdirectories
- Structure: `apps/[project]/docs/[version]/[project-plan].md`

## Phase Organization

- Break projects into logical, incremental phases with clear deliverables
- Define entry and exit criteria for each phase
- Start with an overall project plan that outlines all phases
- Create detailed plans for each individual phase

### Directory Structure Example

```
apps/project-name/
  └── docs/
      ├── project-name-project-plan.md  (Overall plan)
      ├── 0.0.0/
      │   └── phase-1-project-plan.md   (Discovery phase)
      ├── 0.0.1/
      │   └── phase-2-project-plan.md   (MVP phase)
      └── 0.0.2/
          └── phase-3-project-plan.md   (Enhancement phase)
```

## Project Plan Continuity

- Each phase builds on previous phases with clear dependencies
- Reference user stories and business outcomes carried forward
- Document metrics for measuring phase success
- Identify stakeholders and decision points for phase completion

## Overall Project Plan Template

**File: `apps/[project]/docs/[project]-project-plan.md`**

```markdown
# [Project] Project Plan

**Version:** 0.0.0 (Initial) **Date:** [YYYY-MM-DD]

## Project Purpose

Brief explanation of the project's business goals and user needs

## Project Phases Overview

1. **Phase 1: [Name]** (Version 0.0.0)
   - Key objectives
   - Primary deliverables
   - Timeline estimate

2. **Phase 2: [Name]** (Version 0.0.1)
   - Key objectives
   - Primary deliverables
   - Timeline estimate

3. **Phase 3: [Name]** (Version 0.0.2)
   - Key objectives
   - Primary deliverables
   - Timeline estimate

## User Personas

Brief descriptions of target users and their needs

## Success Metrics

How will we measure the overall success of this project?

## Project Team

Key stakeholders and team members

## Risks and Mitigation

Known risks and mitigation strategies
```

## Phase-Specific Plan Template

**File: `apps/[project]/docs/[version]/phase-[X]-project-plan.md`**

```markdown
# [Project] Phase [X] Project Plan

**Version:** [0.0.X] **Date:** [YYYY-MM-DD]

## Phase Summary

What will be accomplished in this specific phase?

## User Stories

- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

## Business Outcomes

What business goals will be achieved in this phase?

## Features and Deliverables

Detailed list of features to be built in this phase

## User Experience

- User flows
- Key interactions
- Design considerations

## Testing Strategy

- User acceptance criteria
- Quality assurance approach
- Performance considerations

## Phase Dependencies

What must be completed before this phase can begin?

## Phase Exit Criteria

What defines this phase as complete?

## Timeline and Milestones

High-level schedule of key milestones
```

## Planning Best Practices

1. **User-Centric Focus**: Always tie phases back to user needs and outcomes
2. **Incremental Value**: Each phase should deliver tangible value
3. **Feedback Integration**: Plan for gathering and incorporating feedback
   between phases
4. **Clear Scope Boundaries**: Define what's in and out of scope for each phase
5. **Adaptive Planning**: Allow flexibility while maintaining clear phase
   objectives

## Real-World Example

The "Desks" project follows this pattern with its phased approach:

- `apps/desks/docs/desks-project-plan.md` (Overall project vision and phasing)
- `apps/desks/docs/0.0.0/phase-1-discovery-plan.md` (Initial phase with research
  focus)
- `apps/desks/docs/0.0.1/phase-2-mvp-plan.md` (Core functionality development)
- `apps/desks/docs/0.0.2/phase-3-enhancement-plan.md` (Refinement and additional
  features)

Remember: Each phase should deliver measurable value while building toward the
complete project vision. Phases should be small enough to be manageable but
substantial enough to deliver meaningful outcomes.
