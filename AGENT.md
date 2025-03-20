# Bolt Foundry Agent Guide

## Project Overview

Bolt Foundry is an open-source platform for creating reliable, testable, and verifiable LLM systems. 
It uses Identity Cards as the core abstraction - verified, tested units of LLM functionality that can 
be composed into larger systems. The platform is built with Deno as the runtime, React for the UI, 
and GraphQL for the API layer.

## Project Structure

```
.
├── build/                      # Compiled output
├── content/                    # Documentation and test cases
├── infra/                      # Infrastructure code
├── lib/                        # Shared utilities
├── packages/                   # Project modules
├── static/                     # Static assets and CSS
```

## Key Technologies

- **Deno 2**: Modern JavaScript/TypeScript runtime
- **React**: UI component library
- **GraphQL**: API query language
- **Sapling SCM**: Source control management
- **BFF**: Custom task runner and dev tools

## Code Organization

### Directory Structure Patterns

- Test files go in `__tests__` directories within the module they test
- Example files go in `__examples__` directories
- Database models are in `packages/bfDb/models/`
- Core model classes are in `packages/bfDb/coreModels/`

### Identity Card Architecture

Identity Cards are implemented as composable units that:
1. Define expected LLM behavior
2. Include test cases and verification
3. Support versioning and tracking
4. Can be combined into larger systems

### Front-end Architecture

- Components live in `packages/app/components/`
- Design system components in `packages/bfDs/components/`
- Isograph for component data fetching
- Router context for navigation

### Isograph Overview

Isograph integrates GraphQL with React components, allowing you to:

1. Declare data requirements inside component definitions
2. Generate TypeScript types automatically
3. Manage data fetching and caching efficiently
4. Create reusable component fragments

Components declare their data needs using GraphQL field definitions:

- `field TypeName.FieldName @component` - Creates a component field
- `entrypoint TypeName.FieldName` - Creates an entry point for routing

One key benefit: you don't need to explicitly import components referenced in
your GraphQL fragments. The Isograph system automatically provides them through
the `data` prop.

### GraphQL API

- Schema is defined in `packages/graphql/types/`
- Resolvers use a context object (`ctx`) to access models and data

### Identity Card System

- Base classes defined in `packages/bfDb/classes/`
- Each Identity Card has associated test cases
- Cards can be versioned and composed
- Performance metrics are tracked automatically

## Development Workflow

### Implementation Plans

When planning implementations:

1. **Provide reasoning before implementation** - Understanding "why" is more
   important than "how"
2. **Get developer sign-off** on implementation plans
3. **Break down complex changes** into manageable steps
4. **Never specify work units** in time estimates
5. **Note difficulty or complexity** to help set expectations
6. **Keep code out of implementation plans** - focus on design principles and
   structures
7. **Include context and code pointers** - reference existing code paths
8. **Place complex data flows in an appendix**

### Code Quality

#### Debugging with Logger

- Use the structured logging system, not `console.log`
- Control log levels with environment variables

#### Testing Approaches

- Use Deno's built-in testing
- Follow the inheritance pattern for testing class hierarchies
- Base class tests define common behaviors
- Derived class tests extend base tests and add tests for unique functionality
- Use `assert` instead of `assertEquals` when testing boolean conditions
  - Good: `assert(person instanceof BfPerson)`
  - Avoid: `assertEquals(person instanceof BfPerson, true)`

#### Node Relationships Pattern

- Use standard methods from base classes directly
- Avoid creating custom relationship methods in model classes

## BFA Protocols

Special protocols prefixed with `!` help assistants complete consecutive
actions.

### BFA Precommit Protocol

When developers send `!bfa precommit`:

1. Delete and recreate the build directory
2. Format the code
3. Run tests
4. Stage all files
5. Generate a diff file

### BFA Commit Protocol

When developers send `!bfa commit`:

1. Read the diff from `build/diff.txt` (critical safety step)
2. Generate a commit message based on the diff
3. Commit and push the changes
4. Restore user settings

## Documentation Guidelines

### AGENT.md Content Rules

1. Never insert code examples or snippets in AGENT.md
2. Focus on development philosophies, patterns, and guidelines
3. Use plain language to describe technical concepts
4. Reference code locations rather than including code

## Development Philosophies

### The Cult of Done Manifesto

Bolt Foundry embraces this philosophy:

- Rapid iteration over perfect implementation
- Getting a minimal viable solution working first
- Continuous improvement after initial implementation
- Embracing imperfection and learning from it

### Worse is Better

This approach prioritizes:

1. **Simplicity** in implementation over interface
2. **Correctness** in observable aspects, but simplicity trumps edge cases
3. **Consistency** where possible, but simplicity can override it
4. **Completeness** for important cases, but not at the expense of simplicity

### Test-Driven Development (TDD)

Bolt Foundry follows the TDD "Red-Green-Refactor" cycle:

1. **Red**: Write a failing test that defines the expected functionality
2. **Green**: Write the simplest code to make the test pass
3. **Refactor**: Clean up the code while ensuring tests still pass

Always commit failing tests separately from their implementation.

## Database System (bfDb)

The bfDb system provides a flexible, type-safe database abstraction layer with support for multiple backends. The core components are:

### BfNode

BfNode is the fundamental building block for database entities. It implements:

- Strong typing through generics for props and metadata
- Automatic ID generation and organization membership
- Relationship querying through edges
- Cache-aware loading and querying
- Optimistic updates with dirty state tracking

### Database Backends

The system supports multiple database backends through a common interface:

- SQLite for development/testing
- PostgreSQL (Neon) for production
- In-memory for testing

### Edge System

Relationships between nodes are managed through a flexible edge system:

- Edges are first-class database objects
- Support for typed edge properties
- Bidirectional traversal
- Automatic consistency management

### Best Practice Usage

1. Use `BfNode` as the base class for domain models
2. Keep edge relationships explicit through queryTargets()
3. Use transactions for multi-node operations
4. Leverage the caching system for performance
5. Follow the dirty-checking pattern for updates

## Best Practices

1. Use BFF commands for common tasks
2. Run formatter and tests before committing
3. Follow modular code structure
4. Write tests for new functionality
5. Use JSDocs for interfaces, not inline comments
6. Use typed interfaces for better reliability
7. Use project root-relative paths in imports
8. Use lexically sortable naming for classes
9. Use static factory methods instead of constructors for models
10. Write simple code first, then improve it iteratively

Remember: Bolt Foundry follows a "worse is better" philosophy that values
simplicity and getting things done over theoretical perfection.