# Technical Implementation Phases Protocol

When creating implementation plans with distinct phases, organize documentation
with these guidelines:

## Version-Based Documentation

- Create implementation phase documents in project-specific docs directories
- Use semantic versioning (0.0.X) for each implementation phase
- Store phase documents in version-specific subdirectories
- Structure: `apps/[project]/docs/[version]/[implementation-plan].md`

## Phase Organization

- Each implementation phase should be documented in its own file
- Version numbering should increment with each phase (0.0.0, 0.0.1, 0.0.2)
- Include clear version information in filenames and document headers
- Link between phase documents to show progression

### Directory Structure Example

```
apps/project-name/
  └── docs/
      ├── project-plan.md
      ├── 0.0.0/
      │   └── initial-implementation-plan.md
      ├── 0.0.1/
      │   └── phase-2-implementation-plan.md
      └── 0.0.2/
          └── phase-3-implementation-plan.md
```

## Documentation Continuity

- Maintain a consistent structure across phase documents
- Reference previous phases when building upon earlier work
- Document what changed between phases and why
- Include learned insights from previous phases

## Phase Documentation Template

Each phase document should include:

**File: `apps/[project]/docs/[version]/[phase]-implementation-plan.md`**

```markdown
# [Project] Implementation Plan - Phase [X]

**Version:** [0.0.X] **Date:** [YYYY-MM-DD]

## Phase Summary

Brief overview of what this implementation phase accomplishes

## Changes From Previous Phase

Summary of key differences from the previous implementation phase (omit for
initial phase)

## Technical Goals

- Specific technical objectives for this phase
- Concrete deliverables and outcomes

## Components and Implementation

Detailed technical specifications organized by component

## Integration Points

How this phase connects with existing systems

## Testing Strategy

Approach for validating this phase's implementation
```

## Real-World Example

The "Desks" project follows this pattern with its implementation phases:

- `apps/desks/docs/desks-project-plan.md` (Overall project plan)
- `apps/desks/docs/0.0.0/README.md` (Initial implementation)
- `apps/desks/docs/0.0.1/desks-phase-2-implementation-plan.md` (Phase 2)
- `apps/desks/docs/0.0.2/desks-phase-3-implementation-plan.md` (Phase 3)

This structured approach ensures:

1. Clear versioning of implementation concepts
2. Organized documentation that evolves with the project
3. Traceable history of implementation decisions
4. Easy navigation between different implementation phases

Remember: Implementation phases should represent distinct, coherent units of
work that build toward the overall project goals while maintaining technical
clarity.
