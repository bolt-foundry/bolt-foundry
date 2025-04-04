# Documentation Directory Structure Protocol

When organizing project documentation, follow these guidelines to ensure clear
structure and version tracking across project lifecycle.

## Top-Level Documentation

- Root project plans and implementation plans should be stored in the
  project-specific docs directory
- Create a clear hierarchy from high-level plans to specific implementation
  details
- Maintain consistency in document naming conventions
- Structure: `apps/[project]/docs/[project]-project-plan.md` and
  `apps/[project]/docs/[project]-implementation-plan.md`

## Version-Based Documentation Structure

- Use semantic versioning (0.x) for organizing implementation phases
- Create version-specific subdirectories for each implementation phase
- Store detailed implementation documents in their respective version
  directories
- Version subdirectories should contain phase-specific plans and supporting
  documentation

### Standard Directory Structure

```
apps/project-name/
  └── docs/
      ├── project-name-project-plan.md       (Overall project vision)
      ├── project-name-implementation-plan.md (High-level implementation strategy)
      ├── 0.1/
      │   ├── version-0.1-implementation-plan.md (Initial version details)
      │   └── supporting-documents/              (Research, diagrams, etc.)
      ├── 0.2/
      │   ├── version-0.2-implementation-plan.md (Second version details)
      │   └── technical-specifications.md        (Detailed specs for this version)
      └── 0.3/
          ├── version-0.3-implementation-plan.md (Third version details)
          └── architecture-decisions.md          (Design decisions for this version)
```

## Document Relationship

- Root project plan defines overall vision, goals, and success metrics
- Root implementation plan outlines the technical approach across all versions
- Version-specific implementation plans detail the "how" for each version
- Each document should reference related documents to maintain continuity

## Root Project Plan (Project Vision)

The project plan at `apps/[project]/docs/[project]-project-plan.md` should
include:

- Project purpose and goals
- User personas and journeys
- High-level versions overview
- Success metrics
- Project team and stakeholders
- Risk assessment

## Root Implementation Plan (Technical Strategy)

The implementation plan at
`apps/[project]/docs/[project]-implementation-plan.md` should include:

- Technical architecture overview
- Reasoning and approach
- System components and their relationships
- Version breakdown with technical goals
- Data architecture
- Security considerations
- Technical risks and mitigation strategies

## Version-Specific Implementation Plans

Each version document at
`apps/[project]/docs/[version]/version-X-implementation-plan.md` should detail:

- Specific technical goals for the version
- Components and implementation details
- Integration points with existing systems
- Testing strategy for this version's deliverables
- Changes from previous versions (for version 0.2+)

## Version Numbering Strategy

- **0.1**: Initial implementation phase (foundation)
- **0.2**: Second implementation phase (core functionality)
- **0.3**: Third implementation phase (enhancement)
- **0.x**: Additional implementation phases as needed
- **0.9**: Beta release with complete core functionality
- **1.0**: Production release

## Naming Conventions

- Use consistent, descriptive filenames that indicate content purpose
- Include version or phase numbers in filenames for easy identification
- Use kebab-case for all filenames
- Prefix version-specific files with their purpose (e.g.,
  "phase-2-implementation-plan.md")

## Documentation Continuity

- Each document should link to related documents (parent plans, previous
  versions)
- Maintain a consistent structure across related documents
- Reference decisions and learnings from previous versions
- Document what changed between versions and why

## Real-World Example

The "Desks" project follows this pattern with its documentation structure:

- `apps/desks/docs/desks-project-plan.md` (Vision and user-focused goals)
- `apps/desks/docs/desks-implementation-plan.md` (Technical strategy across
  versions)
- `apps/desks/docs/0.1/README.md` (Initial version implementation details)
- `apps/desks/docs/0.2/desks-version-0.2-implementation-plan.md` (Version 0.2
  details)
- `apps/desks/docs/0.3/desks-version-0.3-implementation-plan.md` (Version 0.3
  details)

This structured approach ensures:

1. Clear separation of project vision from technical implementation
2. Progressive refinement of implementation details across versions
3. Traceable history of implementation decisions
4. Consistent organization of project knowledge

Remember: Documentation should evolve with the project, with each version
building on the previous ones while maintaining a clear link to the overall
project vision and strategy.
