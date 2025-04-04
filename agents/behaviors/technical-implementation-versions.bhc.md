# Technical Implementation Versions Protocol

When creating implementation plans with distinct versions, organize
documentation with these guidelines:

## Version-Based Documentation

- Create implementation version documents in project-specific docs directories
- Use semantic versioning (0.0.X) for each implementation version
- Store version documents in version-specific subdirectories
- Structure: `apps/[project]/docs/[version]/[implementation-plan].md`

## Version Organization

- Each implementation version should be documented in its own file
- Version numbering should follow semantic versioning (0.0.0 for initial, 0.0.1
  for first release, 0.0.2 for iterative improvements)
- Include clear version information in filenames and document headers
- Link between version documents to show progression

### Directory Structure Example

```
apps/project-name/
  └── docs/
      ├── project-plan.md
      ├── 0.0.0/
      │   └── initial-implementation-plan.md
      ├── 0.0.1/
      │   └── version-2-implementation-plan.md
      └── 0.0.2/
          └── version-3-implementation-plan.md
```

## Documentation Continuity

- Maintain a consistent structure across phase documents
- Reference previous phases when building upon earlier work
- Document what changed between versions and why
- Include learned insights from previous versions

## Version Documentation Template

Each version document should include:

**File: `apps/[project]/docs/[version]/[version]-implementation-plan.md`**

```markdown
# [Project] Implementation Plan - Version [X]

**Version:** [0.0.X] **Date:** [YYYY-MM-DD]

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
- `apps/desks/docs/0.0.0/README.md` (Initial implementation, version 0.0.0)
- `apps/desks/docs/0.0.1/desks-version-0.0.1-implementation-plan.md` (Version
  0.0.1)
- `apps/desks/docs/0.0.2/desks-version-0.0.2-implementation-plan.md` (Version
  0.0.2)

This structured approach ensures:

1. Clear versioning of implementation concepts
2. Organized documentation that evolves with the project
3. Traceable history of implementation decisions
4. Easy navigation between different implementation versions

Remember: Implementation versions should represent distinct, coherent units of
work that build toward the overall project goals while maintaining technical
clarity.
