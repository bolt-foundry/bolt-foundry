# Bolt Foundry: Project Summary & AI Agent Guide

## Project Purpose

Bolt Foundry is an open-source AI platform that simplifies creating, managing,
and reusing fine-tuned language models (LLMs) and samples. The goal is to
enhance the reliability and reduce inference costs for LLM applications through
structured data management, unit testing, and streamlined development processes.

## Technology Stack

- **Runtime**: Deno 2 (JavaScript/TypeScript)
- **Frontend**: React with a component-based architecture
- **Backend/API**: GraphQL with Isograph integration
- **Version Control**: Sapling SCM
- **Build System**: Deno compilation into standalone executables
- **Developer Tools**: Bolt Foundry Friends (BFF) CLI
- **Environment Management**: Nix

## Key Components

- **apps/bfDb**: Database models and utilities
- **apps/bfDs**: UI components (design system)
- **apps/boltFoundry**: Main React frontend application
- **apps/bfDb/graphql**: GraphQL schema and resolvers
- **apps/web**: Web server and routing implementation
- **cards/**: AI agent definitions (Persona and Behavior cards)
- **infra/bff**: CLI tooling for building, testing, and development workflows
- **packages/**: Shared utilities and core libraries

## AI Agent Reference Cards

### Persona Cards

- **Purpose**: Provide project context and high-level understanding.
- **Content**: Project overview, architecture, directory structure, technology
  descriptions.
- **Where to Find**: `cards/personas/`, particularly "Bolt Foundry Persona Card.md"

### Behavior Cards

- **Purpose**: Provide actionable workflows, protocols, and best practices.
- **Content**: Implementation plans, testing protocols, commit guidelines,
  coding standards.
- **File Format**: Stored as `.bhc.md` files (Behavior Card Markdown)
- **Where to Find**: `cards/behaviors/`, notably cards such as "coding.bhc.md,"
  "implementation-plans.bhc.md," "project-plans.bhc.md," and "tdd.bhc.md"
- **How to Use**: Reference these cards when implementing features, planning
  projects, or following development workflows

## Best Places for AI Agents to Find Information

- **AGENT.md**: Comprehensive guidelines for working on the project, including
  code organization, development tools, testing, and debugging practices.
- **Persona & Behavior Cards (`cards/`)**: Essential for understanding the
  project and executing tasks effectively.
- **GraphQL Schema (`apps/bfDb/graphql`)**: Defines API interactions and data
  relationships.
- **Design System (`apps/bfDs`)**: Clarifies frontend component usage and UI
  patterns.

## Recommended Workflow for AI Agents

1. **Contextual Understanding**: Review Persona Cards and AGENT.md to
   understand the project structure and purpose.
2. **Task Implementation**: Follow Behavior Cards strictly for step-by-step
   actions, testing, and committing.
3. **Testing & Debugging**: Use provided debugging guidelines, log-level
   management, and structured testing processes outlined in AGENT.md.

By utilizing Persona and Behavior Cards together, AI agents can effectively
contribute to Bolt Foundry, ensuring adherence to the project's high standards
and best practices.
