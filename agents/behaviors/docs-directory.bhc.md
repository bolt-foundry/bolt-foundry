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

- Use semantic versioning (0.0.X) for organizing implementation phases
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
      ├── 0.0.0/
      │   ├── phase-1-implementation-plan.md (Initial phase details)
      │   └── supporting-documents/          (Research, diagrams, etc.)
      ├── 0.0.1/
      │   ├── phase-2-implementation-plan.md (Second phase details)
      │   └── technical-specifications.md    (Detailed specs for this phase)
      └── 0.0.2/
          ├── phase-3-implementation-plan.md (Third phase details)
          └── architecture-decisions.md      (Design decisions for this phase)
```

## Document Relationship

- Root project plan defines overall vision, goals, and success metrics
- Root implementation plan outlines the technical approach across all phases
- Version-specific implementation plans detail the "how" for each phase
- Each document should reference related documents to maintain continuity

## Root Project Plan (Project Vision)

The project plan at `apps/[project]/docs/[project]-project-plan.md` should
include:

- Project purpose and goals
- User personas and journeys
- High-level phases overview
- Success metrics
- Project team and stakeholders
- Risk assessment

## Root Implementation Plan (Technical Strategy)

The implementation plan at
`apps/[project]/docs/[project]-implementation-plan.md` should include:

- Technical architecture overview
- Reasoning and approach
- System components and their relationships
- Phase breakdown with technical goals
- Data architecture
- Security considerations
- Technical risks and mitigation strategies

## Phase-Specific Implementation Plans

Each phase document at
`apps/[project]/docs/[version]/phase-X-implementation-plan.md` should detail:

- Specific technical goals for the phase
- Components and implementation details
- Integration points with existing systems
- Testing strategy for this phase's deliverables
- Changes from previous phases (for phase 0.0.1+)

## Version Numbering Strategy

- **0.0.0**: Initial implementation phase (foundation)
- **0.0.1**: Second implementation phase (core functionality)
- **0.0.2**: Third implementation phase (enhancement)
- **0.0.X**: Additional implementation phases as needed
- **0.1.0**: Beta release with complete core functionality
- **1.0.0**: Production release

## Naming Conventions

- Use consistent, descriptive filenames that indicate content purpose
- Include version or phase numbers in filenames for easy identification
- Use kebab-case for all filenames
- Prefix version-specific files with their purpose (e.g.,
  "phase-2-implementation-plan.md")

## Documentation Continuity

- Each document should link to related documents (parent plans, previous phases)
- Maintain a consistent structure across related documents
- Reference decisions and learnings from previous phases
- Document what changed between phases and why

## Real-World Example

The "Desks" project follows this pattern with its documentation structure:

- `apps/desks/docs/desks-project-plan.md` (Vision and user-focused goals)
- `apps/desks/docs/desks-implementation-plan.md` (Technical strategy across
  phases)
- `apps/desks/docs/0.0.0/README.md` (Initial phase implementation details)
- `apps/desks/docs/0.0.1/desks-phase-2-implementation-plan.md` (Second phase
  details)
- `apps/desks/docs/0.0.2/desks-phase-3-implementation-plan.md` (Third phase
  details)

This structured approach ensures:

1. Clear separation of project vision from technical implementation
2. Progressive refinement of implementation details across phases
3. Traceable history of implementation decisions
4. Consistent organization of project knowledge

Remember: Documentation should evolve with the project, with each phase building
on the previous ones while maintaining a clear link to the overall project
vision and strategy.
