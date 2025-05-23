# Technical Implementation Versions Protocol

When creating implementation plans with distinct versions, organize
documentation with these guidelines:

## Version-Based Documentation

- Create implementation version documents in project-specific docs directories
- Use semantic versioning:
  - During development: Use 0.0.x versions (e.g., 0.0.1, 0.0.2)
  - Upon completion: Graduate to 0.1, 0.2, etc.
  - Example: Work towards v0.1 uses v0.0.x, completed work is v0.1
- Store version documents in version-specific subdirectories
- Structure: `apps/[project]/docs/[version]/[x.x.x]-implementation-plan.md`

## Version Organization

- Each implementation version should be documented in its own file
- Version numbering follows the development pattern:
  - Active development: 0.0.1, 0.0.2, 0.0.3
  - Completed milestones: 0.1, 0.2, 0.3
- Include clear version information in document headers
- Store implementation plans in version folders with consistent naming
  (implementation-plan.md)
- Link between version documents to show progression

### Directory Structure Example

```
apps/project-name/
  └── docs/
      ├── project-plan.md
      ├── 0.1/
      │   ├── 0.0.1-implementation-plan.md
      │   ├── 0.0.2-implementation-plan.md
      │   └── 0.1-implementation-plan.md  (final completed version)
      ├── 0.2/
      │   ├── 0.1.1-implementation-plan.md
      │   ├── 0.1.2-implementation-plan.md
      │   └── 0.2-implementation-plan.md  (final completed version)
      └── 0.3/
          └── 0.3-implementation-plan.md
```

## Documentation Continuity

- Maintain a consistent structure across phase documents
- Reference previous phases when building upon earlier work
- Document what changed between versions and why
- Include learned insights from previous versions

## Version Documentation Template

Each version document should include:

**File: `apps/[project]/docs/[version]/[x.x.x]-implementation-plan.md`**

```markdown
# [Project] Implementation Plan - Version [X]

**Version:** [0.x] **Date:** [YYYY-MM-DD]

## Version Summary

Brief overview of what this implementation version accomplishes

## Changes From Previous Version

Summary of key differences from the previous implementation version (omit for
initial version 0.0.0)

## Technical Goals

- Specific technical objectives for this version
- Concrete deliverables and outcomes

## Components and Implementation

Detailed technical specifications organized by component

## Integration Points

How this version connects with existing systems

## Testing Strategy

Approach for validating this version's implementation
```

## Real-World Example

The "Desks" project follows this pattern with its implementation versions:

- `apps/desks/docs/desks-project-plan.md` (Overall project plan)
- `apps/desks/docs/0.1/README.md` (Initial implementation, version 0.1)
- `apps/desks/docs/0.2/implementation-plan.md` (Version 0.2)
- `apps/desks/docs/0.3/implementation-plan.md` (Version 0.3)

This structured approach ensures:

1. Clear versioning of implementation concepts
2. Organized documentation that evolves with the project
3. Traceable history of implementation decisions
4. Easy navigation between different implementation versions

Remember: Implementation versions should represent distinct, coherent units of
work that build toward the overall project goals while maintaining technical
clarity.
