# Versioned Project Plans Protocol

When creating project plans that span multiple versions of development, follow
these guidelines to ensure clear progression and accountability.

## Version-Based Planning

- Create version-specific project plan documents in project-specific docs
  directories
- Use semantic versioning (0.x) for each project version (0.1 for initial, 0.2
  for first release, etc.)
- Store version documents in version-specific subdirectories
- Structure: `apps/[project]/docs/[version]/[project-plan].md`

## Version Organization

- Break projects into logical, incremental versions with clear deliverables
- Define entry and exit criteria for each version
- Start with an overall project plan that outlines all versions
- Create detailed plans for each individual version

### Directory Structure Example

```
apps/project-name/
  └── docs/
      ├── project-name-project-plan.md  (Overall plan)
      ├── 0.1/
      │   └── version-0.1-project-plan.md   (Discovery version)
      ├── 0.2/
      │   └── version-0.2-project-plan.md   (MVP version)
      └── 0.3/
          └── version-0.3-project-plan.md   (Enhancement version)
```

## Project Plan Continuity

- Each version builds on previous versions with clear dependencies
- Reference user stories and business outcomes carried forward
- Document metrics for measuring version success
- Identify stakeholders and decision points for version completion

## Overall Project Plan Template

**File: `apps/[project]/docs/[project]-project-plan.md`**

```markdown
# [Project] Project Plan

**Version:** 0.1 (Initial) **Date:** [YYYY-MM-DD]

## Project Purpose

Brief explanation of the project's business goals and user needs

## Project Versions Overview

1. **Version 0.1: [Name]**
   - Key objectives
   - Primary deliverables
   - Timeline estimate

2. **Version 0.2: [Name]**
   - Key objectives
   - Primary deliverables
   - Timeline estimate

3. **Version 0.3: [Name]**
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

## Version-Specific Plan Template

**File: `apps/[project]/docs/[version]/version-[0.x]-project-plan.md`**

```markdown
# [Project] Version [0.x] Project Plan

**Version:** [0.x] **Date:** [YYYY-MM-DD]

## Version Summary

What will be accomplished in this specific version?

## User Stories

- As a [user type], I want to [action] so that [benefit]
- As a [user type], I want to [action] so that [benefit]

## Business Outcomes

What business goals will be achieved in this version?

## Features and Deliverables

Detailed list of features to be built in this version

## User Experience

- User flows
- Key interactions
- Design considerations

## Testing Strategy

- User acceptance criteria
- Quality assurance approach
- Performance considerations

## Version Dependencies

What must be completed before this version can begin?

## Version Exit Criteria

What defines this version as complete?

## Timeline and Milestones

High-level schedule of key milestones
```

## Planning Best Practices

1. **User-Centric Focus**: Always tie versions back to user needs and outcomes
2. **Incremental Value**: Each version should deliver tangible value
3. **Feedback Integration**: Plan for gathering and incorporating feedback
   between versions
4. **Clear Scope Boundaries**: Define what's in and out of scope for each
   version
5. **Adaptive Planning**: Allow flexibility while maintaining clear version
   objectives

## Real-World Example

The "Desks" project follows this pattern with its versioned approach:

- `apps/desks/docs/desks-project-plan.md` (Overall project vision and
  versioning)
- `apps/desks/docs/0.1/version-0.1-discovery-plan.md` (Initial version with
  research focus)
- `apps/desks/docs/0.2/version-0.2-mvp-plan.md` (Core functionality development)
- `apps/desks/docs/0.3/version-0.3-enhancement-plan.md` (Refinement and
  additional features)

Remember: Each version should deliver measurable value while building toward the
complete project vision. Versions should be small enough to be manageable but
substantial enough to deliver meaningful outcomes.
