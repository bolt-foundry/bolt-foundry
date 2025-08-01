# Bolt Foundry - Company-Level Documentation

This directory contains high-level, company-wide documentation for Bolt Foundry.
Unlike project-specific documentation (found in `apps/[project]/docs/`), the
documents here are intended to be long-term resources that apply across the
entire organization.

## Purpose

Aligned with our "Worse is Better" philosophy, this documentation should:

- Provide enduring, strategic guidance that prioritizes simplicity over
  complexity
- Define company-wide standards and best practices that value working solutions
- Establish shared vocabulary and conceptual frameworks for test-driven
  development
- Serve as reference material for onboarding and training that emphasizes action
  over planning

## Documentation Guidelines

### Long-Term Focus

Documents in this directory should be evergreen and focus on stable, long-term
concepts rather than ephemeral information. Specifically:

- **DO** include foundational principles, architectural patterns, and core
  values
- **DO** document company-wide processes and standards
- **DO NOT** include time-sensitive information that will quickly become
  outdated
- **DO NOT** duplicate project-specific implementation details (these belong in
  `apps/[project]/docs/`)

### Structure and Organization

For consistency with the rest of the monorepo:

- Use Markdown (`.md`) for all documentation
- Follow the [documentation directory protocol](/404.md) for structure and
  versioning
- Cross-reference related documents where appropriate
- Include clear titles and section headers

## Relationship to Project Documentation

The relationship between company-level and project-level documentation:

```
docs/                        <- Company-wide, long-term documentation
├── standards/               <- Cross-project standards
├── architecture/            <- Enterprise architecture
└── processes/               <- Organizational processes

apps/[project]/docs/         <- Project-specific documentation
├── [project]-project-plan.md    <- Project vision
├── [project]-implementation-plan.md  <- Technical approach
└── [version]/               <- Versioned implementation details
```

Remember that project-specific documentation belongs in the respective project's
docs directory following the standard directory structure.
