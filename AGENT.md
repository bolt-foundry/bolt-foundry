# Content Foundry Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Key Technologies](#key-technologies)
- [Development Tools](#development-tools)
  - [BFF (Bolt Foundry Friend)](#bff-bolt-foundry-friend)
  - [Sapling SCM Integration](#sapling-scm-integration)
  - [Development Environment](#development-environment)
  - [Notebook Integration](#notebook-integration)
- [Code Organization](#code-organization)
  - [Front-end Architecture](#front-end-architecture)
  - [Database Layer](#database-layer)
  - [GraphQL API](#graphql-api)
  - [Additional Modules](#additional-modules)
- [Development Workflow](#development-workflow)
  - [Getting Started](#getting-started)
  - [Common Tasks](#common-tasks)
  - [Before Committing Changes](#before-committing-changes)
  - [Dependency Management](#dependency-management)
- [Code Quality](#code-quality)
  - [Testing Approaches](#testing-approaches)
  - [Code Reviews](#code-reviews)
  - [Code Style Guidelines](#code-style-guidelines)
  - [Common Type Errors](#common-type-errors)
- [Special Protocols](#special-protocols)
  - [BFF Commit Protocol](#bff-commit-protocol)
  - [BFF Agent Update Protocol](#bff-agent-update-protocol)
  - [BFF Help Protocol](#bff-help-protocol)
- [Best Practices](#best-practices)
- [Development Approach](#development-approach)
  - [Understanding Before Implementing](#understanding-before-implementing)
- [Test-Driven Development](#test-driven-development-tdd)

## Project Overview

Content Foundry is an open-source platform designed to help creators tell their
stories effectively across various platforms. The application uses modern web
technologies with Deno as the runtime, React for the UI, and GraphQL for the API
layer.

## Project Structure

```
.
├── build/                      # Compiled application output
├── content/                    # Content and documentation
│   ├── blog/                   # Blog posts
│   └── documentation/          # Project documentation
├── infra/                      # Infrastructure code
│   ├── appBuild/               # Build configuration
│   ├── bff/                    # BFF (Bolt Foundry Friend) tools
│   │   ├── bin/                # Executable scripts
│   │   ├── friends/            # BFF command modules
│   │   └── prompts/            # Prompt templates
│   └── jupyter/                # Jupyter notebook configuration
├── lib/                        # Shared utility functions
├── packages/                   # Project modules
│   ├── analytics/              # Analytics functionality
│   ├── app/                    # Main application code
│   │   ├── components/         # React components
│   │   ├── contexts/           # React contexts
│   │   └── hooks/              # Custom React hooks
│   ├── bfDb/                   # Database interface
│   │   ├── coreModels/         # Core data models
│   │   ├── classes/            # Database classes
│   │   └── models/             # Data models
│   ├── bfDs/                   # Design system components
│   ├── extension/              # Browser extension code
│   ├── featureFlags/           # Feature flag management
│   ├── graphql/                # GraphQL schema and resolvers
│   ├── redirector/             # URL redirection handling
│   ├── tools/                  # Utility tools
│   └── web/                    # Web server implementation
├── static/                     # Static assets and CSS
```

## Key Technologies

- **Deno 2**: Modern JavaScript/TypeScript runtime (v2.x)
- **React**: UI library for building component-based interfaces
- **GraphQL**: API query language and runtime
- **Sapling SCM**: Modern source control management system
- **BFF (Bolt Foundry Friend)**: Custom task runner and development tool suite
- **Nix**: Reproducible build system for environment management

## Development Tools

### BFF (Bolt Foundry Friend)

BFF is Content Foundry's custom task runner and development tool suite. It
provides a unified interface for common development tasks.

#### Key BFF Commands

```bash
# Get a list of all commands
bff help

# Development Tools
bff devTools          # Start development environment
bff devToolsStop      # Stop development environment

# Build and Deployment
bff build             # Build the application
bff deploy            # Run CI checks and build for deployment
bff ci                # Run CI checks (lint, test, build, format)

# Testing and Quality
bff test              # Run tests
bff lint              # Lint code
bff format            # Format code using deno fmt

# Content Management
bff contentLint       # Lint markdown content files
bff llm               # Output files in a prompt-friendly format

# Database
bff db:reset          # Reset database (development only)
bff db:clean          # Clean database models

# Version Control
bff fork              # Fork the repository to personal GitHub account
bff land              # Pull code, install deps, create git commit
bff pull              # Pull latest code and goto remote/main
bff testStack         # Run tests on each commit in current stack
```

### Sapling SCM Integration

Content Foundry uses Sapling SCM for source control management. Sapling offers
advanced features while maintaining compatibility with Git.

#### Key Sapling Commands

- `sl status` - Show modified files
- `sl commit` - Commit changes
- `sl push` - Push changes to remote
- `sl pull` - Pull changes from remote
- `sl goto` - Switch to specific branch or commit
- `sl goto prXXX` - Switch to a specific pull request branch (e.g.,
  `sl goto pr316`)
- `sl log` - View commit history
- `sl web` - Start Sapling web interface
- `sl diff` - Show changes in working directory
- `sl submit` - Submit a pull request with your changes for review

#### Creating Structured Commits

When creating commits in Sapling, it's recommended to follow a structured format
with:

1. A clear, descriptive title
2. A detailed description with "Summary" and "Test Plan" sections

##### Using the Commit Template

We've set up a commit template to help you create well-structured commits. To
use it:

```bash
# First ensure code is formatted properly
bff f

# Generate a diff and save it to a file for review
sl diff > build/sl.txt

# Review the diff to understand changes
cat build/sl.txt

# Create a commit using the template
sl commit
```

This will open your editor with the commit template pre-populated:

```
# Title: concise description of changes (50 chars max)

## Summary
# Explain what changed and why (bullet points work well)
# - Change 1
# - Change 2

## Test Plan
# Describe how you tested these changes
# - What you verified
# - How others can test/verify
```

Fill in each section, removing the comment lines (lines starting with #). Make
sure to:

- Use a short, descriptive title
- Leave a blank line after the title
- Use line breaks to make the commit message readable
- Use bullet points in the Summary and Test Plan sections
- Save and close the editor to complete the commit

##### Manual Commit Structure

If not using the template, you can still create a well-structured commit
manually:

```bash
# Format code before committing
bff f

# Then commit with a descriptive message
sl commit -m "Descriptive title

## Summary
- Change 1: Brief explanation of first change
- Change 2: Brief explanation of second change

## Test Plan
- Verified X works as expected
- Ran Y test and confirmed Z outcome"
```

To use a file for the commit message (useful for long, complex commit messages):

```bash
# Create a commit message file
cat > build/commit-message.txt << 'EOF'
Descriptive title

## Summary
- Change 1: Brief explanation of first change
- Change 2: Brief explanation of second change

## Test Plan
- Verified X works as expected
- Ran Y test and confirmed Z outcome
EOF

# Commit using the file content as the message
sl commit -m "$(cat build/commit-message.txt)"
```

Note: Unlike Git, Sapling doesn't support the `-F` flag for reading commit
messages from a file. Use the approach above instead.

The key is to use line breaks and formatting to make your commit message
readable.

##### Automated Commit Helpers

For convenience, there are two options to create properly formatted commits:

1. The `bff llmCommit` command leverages automatic analysis to prepare your
   commit:

```bash
# Run the automated commit helper with optional arguments
bff llmCommit [title] [summary] [test_plan]
```

2. Alternatively, a traditional commit helper script is available at
   `build/commit.sh`:

```bash
# Run the commit helper script
bash build/commit.sh
```

#### Splitting Commits

Guidelines for splitting commits:

- Each commit should represent a single logical change or feature
- Keep related changes together in the same commit
- Separate unrelated changes into different commits
- Consider splitting large changes into smaller, incremental commits
- Make sure each commit can be understood on its own

Example commit message:

```
Fix content collection ID lookup and add BfGid type documentation

## Summary
- Fixed content collection lookup by correctly handling ID prefix conventions
- Added documentation about BfGid type errors to AGENT.md
- Updated collectionsCache.get() to properly convert string IDs to BfGid

## Test Plan
- Verified content/marketing collection now loads correctly
- Tested with shortened collection ID format
- Added explicit tests for ID conversion edge cases
```

#### Using `sl diff` to Review Changes

The `sl diff` command is an essential part of the code review process, allowing
you to view and verify your changes before committing:

```bash
# Basic usage - shows all uncommitted changes
sl diff

# Save the diff to a file for easier review
sl diff > build/sl.txt

# View diff for a specific file
sl diff path/to/file.ts

# Compare with a specific commit
sl diff -r commit_hash

# Show a more compact summary of changes
sl diff --stat
```

### Development Environment

Content Foundry provides a comprehensive development environment through BFF:

```bash
# Start development tools
bff devTools

# This starts:
# - Sapling web interface (port 3011)
# - Jupyter notebook (port 8888)
# - Tools web interface (port 9999)
```

### Notebook Integration

Content Foundry integrates Jupyter notebooks for data analysis and
documentation:

```bash
# Open Jupyter notebook interface
bff devTools

# Access at: https://<your-domain>:8888 (token: bfjupyter)
```

## Code Organization

### Directory Structure Patterns

Content Foundry follows specific patterns for organizing code files:

- **Test files**: Place test files in a `__tests__` directory within the module
  they are testing.
  - Example: Tests for `packages/bfDb/classes/SomeClass.ts` should go in
    `packages/bfDb/classes/__tests__/SomeClass.test.ts`
- **Example files**: Place example files in a `__examples__` directory within
  the module they exemplify.
  - Example: Examples for `packages/bfDb/classes/SomeClass.ts` should go in
    `packages/bfDb/classes/__examples__/SomeExampleFile.ts`
- **Model classes**: Database models are in `packages/bfDb/models/`
- **Core model classes**: Base classes for models are in
  `packages/bfDb/coreModels/`

This organization keeps related files together and makes it easier to find and
maintain code.

### Front-end Architecture

Content Foundry uses a component-based architecture with React:

- Components are in `packages/app/components/`
- Design system components in `packages/bfDs/components/`
- Isograph used for component data fetching
- Router context for navigation

### Isograph

Isograph is a key technology used in Content Foundry for data fetching and
component rendering. It provides a type-safe way to declare data dependencies
for React components and efficiently fetch that data from the GraphQL API.

#### What is Isograph?

Isograph is a framework that integrates GraphQL with React components, allowing
you to:

1. Declare data requirements directly inside component definitions
2. Automatically generate TypeScript types for your data
3. Efficiently manage data fetching and caching
4. Create reusable component fragments

#### How Isograph Works in Content Foundry

In Content Foundry, Isograph components are defined using the `iso` function
imported from the generated isograph module:

```typescript
import { iso } from "packages/app/__generated__/__isograph/iso.ts";

export const MyComponent = iso(`
  field TypeName.FieldName @component {
    id
    title
    description
    items {
      id
      name
    }
  }
`)(function MyComponent({ data }) {
  // data is typed based on the GraphQL fragment above
  return <div>{data.title}</div>;
});
```

The `iso` function takes a GraphQL fragment string that defines what data the
component needs, and returns a higher-order function that wraps your component,
providing the requested data via props.

#### Key Concepts

##### Field Definitions

Components declare their data needs using GraphQL field definitions:

- `field TypeName.FieldName @component` - Creates a component field
- `entrypoint TypeName.FieldName` - Creates an entry point for routing

##### Component Structure

Isograph components follow this pattern:

1. Import the `iso` function
2. Define the GraphQL fragment with fields needed
3. Create a function component that receives the data
4. Apply the iso HOC to the component

##### Important Note on Isograph Component Usage

One of the key benefits of Isograph is that you **don't need to explicitly
import** components that are referenced in your GraphQL fragments. The Isograph
system automatically makes these components available through the `data` prop.

For example, if your GraphQL fragment includes a field like:

```typescript
// In ParentComponent.tsx
export const ParentComponent = iso(`
  field TypeName.ParentComponent @component {
    childItems {
      id
      ChildComponent  // This references another Isograph component
    }
  }
`)(function ParentComponent({ data }) {
  return (
    <div>
      {data.childItems.map((item) => (
        // The ChildComponent is automatically available as item.ChildComponent
        <item.ChildComponent key={item.id} />
      ))}
    </div>
  );
});
```

The `ChildComponent` becomes accessible directly through the data object without
explicit imports. This creates a tightly integrated system where the data
structure and component structure align perfectly.

#### Environment Setup

Content Foundry sets up the Isograph environment in
`packages/app/isographEnvironment.ts`:

- Creates an Isograph store
- Configures network requests to the GraphQL endpoint
- Sets up caching

#### Development Workflow

1. **Define Components**: Create components with their data requirements
2. **Build**: Run `bff build` to generate Isograph types
3. **Use Components**: Import and use the components in your app

#### Fragment Reader Components

For dynamic component rendering, Content Foundry uses
`BfIsographFragmentReader`:

```typescript
<BfIsographFragmentReader
  fragmentReference={someFragmentReference}
  networkRequestOptions={{
    suspendIfInFlight: true,
    throwOnNetworkError: true,
  }}
/>;
```

This utility component helps render Isograph fragments with proper error
handling and loading states.

#### Common Isograph Patterns

1. **Component Fields**: Use `field TypeName.ComponentName @component` for
   reusable components
2. **Entrypoints**: Use `entrypoint TypeName.EntrypointName` for route entry
   points
3. **Mutations**: Use `entrypoint Mutation.MutationName` for GraphQL mutations

The Isograph compiler automatically generates TypeScript types and utilities in
`packages/app/__generated__/__isograph/`.

### GraphQL API

Content Foundry uses GraphQL for its API layer:

- Schema is defined in `packages/graphql/types/`
- Generated schema available at `packages/graphql/__generated__/schema.graphql`

#### Context Usage in Resolvers

GraphQL resolvers in Content Foundry use a context object (`ctx`) to access
models and data. This pattern ensures proper access control and consistent data
management:

```typescript
// Example resolver function
resolve: (async (parent, args, ctx) => {
  // Use ctx.find to get a model by ID
  const model = await ctx.find(ModelClass, id);

  // Use ctx.findX for required models (throws if not found)
  const requiredModel = await ctx.findX(ModelClass, id);

  // Access current user
  const currentUser = await ctx.findCurrentViewer();

  // For collections with items, use ctx to retrieve the parent first
  const collection = await ctx.findX(CollectionClass, parent.id);
  const items = collection.props.items || [];

  return result;
});
```

Key context methods:

- `ctx.find(Class, id)`: Find an object by ID (returns null if not found)
- `ctx.findX(Class, id)`: Find an object by ID (throws error if not found)
- `ctx.findCurrentUser()`: Get the current authenticated user
- `ctx.login()`, `ctx.register()`: Authentication methods

### Database Layer

Content Foundry supports multiple database backends through an abstraction
layer:

#### Backend Architecture

- Database operations are abstracted through the `DatabaseBackend` interface
- The database backend is selected based on environment configuration

#### Implementing Custom Backends

The database abstraction makes it easy to add new backend implementations:

1. Implement the `DatabaseBackend` interface in a new class
2. Add backend selection logic to the `getBackend()` function in `bfDb.ts`
3. Use environment variables to control backend selection

### Additional Modules

- **Feature Flags**: Feature toggle system in `packages/featureFlags/` for
  controlled feature rollouts
- **Analytics**: Custom analytics implementation in `packages/analytics/`
- **Error Handling**: Centralized error handling via `packages/BfError.ts`
- **Configuration**: Environment-based configuration in
  `packages/getConfigurationVariable.ts`
- **Logging**: Structured logging system in `packages/logger.ts`
- **Tools**: Developer tools in `packages/tools/`
- **Web Server**: Web server implementation in `packages/web/`

## Development Workflow

### Getting Started

To get started with Content Foundry development:

1. Authenticate with GitHub using the GitHub CLI:
   ```bash
   gh auth login
   ```
   - This will start an interactive authentication process
   - You'll be prompted to choose how you want to authenticate (web browser,
     token, etc.)
   - This authentication is required for PR operations and other GitHub
     integrations

2. Start the development environment: `bff devTools`
   - This will help you get logged in and set up your environment
   - If you're not authenticated with GitHub, this command will also help you
     log in
   - It will display a GitHub device code that you can copy and use to complete
     authentication

3. Access development tools:
   - Web app: http://localhost:8000
   - Sapling web: http://localhost:3011
   - Jupyter: http://localhost:8888
   - Tools UI: http://localhost:9999

### Finding Work Items

The canonical way to find out what to work on is to look in the
`content/documentation` folder:

- `content/documentation/community/backlog/` contains upcoming features and
  tasks
- `content/documentation/community/changelog/` contains release notes and
  updates
- Project roadmaps and priorities are documented in these markdown files

#### Setting Up Replit Assistant

When working with this project, it's recommended to configure your Replit
Assistant with the following custom instruction:

```
Before making changes, check agent.md which has a list of helpful tips for performing your tasks. If you learn something new that isn't listed in agent.md, ask the user if they'd like you to update agent.md with the new information.
```

This ensures the assistant will reference the documentation and help keep it
up-to-date with new discoveries about the codebase.

### Common Tasks

- Build: `bff build` or `deno run infra/bff/bin/bff.ts build`
- Lint: `bff lint [--fix]`
- Format: `bff format` (alias: `bff f`)
- Type check: `bff check [file_path]`
- Test all: `bff test`
- Run single test: `bff t path/to/test/file.test.ts` (shorthand for
  `deno test -A path/to/test/file.test.ts`)

  > **IMPORTANT**: Always use `bff t` rather than raw `deno test` commands. The
  > `bff t` command ensures consistent permission flags, environment variables,
  > and test configuration. This prevents issues with permissions and improves
  > test reliability across environments.
- Development environment: `bff devTools`
- Full CI check: `bff ci` (combines format, lint, check, test, build)

### Before Committing Changes

Before committing your changes, it's important to run the following commands:

```bash
# Format your code (shorthand for 'bff format')
bff f

# Run CI checks to ensure your code passes all validation
bff ci
```

The `bff ci` command runs:

- Code formatting checks
- Linting
- TypeScript type checking
- Tests
- Build verification

This ensures your code meets the project's quality standards before being
committed.

### Dependency Management

Content Foundry uses Deno 2 for JavaScript/TypeScript runtime and dependency
management.

#### Deno 2 Dependency Management

Deno 2 introduces significant changes to dependency management:

- Dependencies are handled through the `deno.json` configuration
- Use `deno add` to add new dependencies:
  ```bash
  # Add a dependency from JSR (JavaScript Registry)
  deno add @std/http

  # Add a dependency from npm
  deno add npm:react
  ```

- JSR (JavaScript Registry) is the preferred package source
- Import format for JSR: `import { xyz } from "jsr:@org/package@version";`
- Import format for npm: `import { xyz } from "npm:package-name@version";`

#### Nix Integration

Content Foundry uses Nix for reproducible builds and environment management:

```bash
# Build the current nix system
bff nix

# Build with only deployment packages
bff nix:deploy
```

The Nix configuration is defined in `flake.nix` and ensures consistent
development environments across different systems.

## Code Quality

### Testing Approaches

#### Standard Testing

The project primarily uses Deno's built-in testing capabilities:

- Standard syntax with `Deno.test("description", () => { ... })`
- Assertions from `@std/assert` (not `@std/testing/asserts`)
- Simple execution with `bff test` or `bff t`

```typescript
// Example standard test
import { assertEquals } from "@std/assert";

Deno.test("my test function", () => {
  assertEquals(1 + 1, 2);
});
```

#### Test Inheritance Pattern

When testing classes that extend base classes (like `BfNodeBase`), follow the
inheritance pattern in the tests:

1. Base class tests (`BfNodeBaseTest.ts`) define common test behaviors
2. Derived class tests extend or import from base tests and only implement
   additional tests for unique functionality

Example structure:

```typescript
// In BfNodeBaseTest.ts
export function runBaseNodeTests(NodeClass, helpers) {
  Deno.test("should implement common node behavior", async () => {
    // Test base functionality
  });
}

// In BfNodeOnDisk.test.ts
import { runBaseNodeTests } from "./BfNodeBaseTest.ts";

// Run the base tests first
runBaseNodeTests(BfNodeOnDisk, diskHelpers);

// Then add tests specific to BfNodeOnDisk
Deno.test("BfNodeOnDisk should save to disk", async () => {
  // Test disk-specific functionality
});
```

This pattern ensures:

- Test consistency across related classes
- Proper coverage of inherited functionality
- Focus on testing only the unique aspects in derived classes
- Changes to base functionality only need updates in one place

#### Test Inheritance Pattern

When testing classes that extend base classes (like `BfNodeBase`), follow the
inheritance pattern in the tests:

1. Base class tests (`BfNodeBaseTest.ts`) define common test behaviors
2. Derived class tests extend or import from base tests and only implement
   additional tests for unique functionality

Example structure:

```typescript
// In BfNodeBaseTest.ts
export function runBaseNodeTests(NodeClass, helpers) {
  Deno.test("should implement common node behavior", async () => {
    // Test base functionality
  });
}

// In BfNodeOnDisk.test.ts
import { runBaseNodeTests } from "./BfNodeBaseTest.ts";

// Run the base tests first
runBaseNodeTests(BfNodeOnDisk, diskHelpers);

// Then add tests specific to BfNodeOnDisk
Deno.test("BfNodeOnDisk should save to disk", async () => {
  // Test disk-specific functionality
});
```

This pattern ensures:

- Test consistency across related classes
- Proper coverage of inherited functionality
- Focus on testing only the unique aspects in derived classes
- Changes to base functionality only need updates in one place

#### Mocking Current Viewers in Tests

When testing components that require a `BfCurrentViewer` instance, always use
the proper factory methods from the `BfCurrentViewer` classes rather than custom
helper functions like `getMockCurrentViewer()`:

```typescript
// Preferred method for tests - flexible unified method
const mockCv = BfCurrentViewer.__DANGEROUS__createTestCurrentViewer(
  import.meta, // Always pass import.meta
  true, // true for logged in, false for logged out
  { // Optional configuration
    bfGid: "test-user-123", // Optional user ID
    bfOid: "test-owner-123", // Optional owner ID
  },
);

// For logged out viewer (anonymous user)
const mockCv = BfCurrentViewerLoggedOut.createLoggedOut(import.meta);

// For logged in viewer with email
const mockLoggedInCv = BfCurrentViewerLoggedIn.__DANGEROUS__createFromEmail(
  import.meta,
  "test@example.com",
);

// For logged in viewer with specific IDs
const mockCvWithIds = BfCurrentViewerLoggedIn.__DANGEROUS__createFromBfGid(
  import.meta,
  toBfGid("user-id"),
  toBfGid("owner-id"),
);
```

These factory methods ensure proper initialization of the current viewer objects
with appropriate permissions and behavior matching the actual implementation.
The `__DANGEROUS__createTestCurrentViewer` method is particularly useful for
tests as it provides a unified interface for creating both logged-in and
logged-out viewers with configurable IDs.

### Code Reviews

Code reviews are a critical part of the development process in Content Foundry.
They help maintain code quality, share knowledge, and ensure consistency across
the codebase.

#### Performing Code Reviews

When reviewing code for Content Foundry, follow these guidelines:

1. **Focus Areas**: Review for:
   - **Functionality**: Does the code work as intended?
   - **Security**: Are there any security vulnerabilities?
   - **Performance**: Are there obvious performance issues?
   - **Readability**: Is the code clear and maintainable?
   - **Test Coverage**: Are there appropriate tests?

2. **Style Consistency**: Ensure code follows Content Foundry style guidelines:
   - PascalCase for classes/types/components (BfComponent)
   - camelCase for variables/functions
   - Proper TypeScript typing
   - Consistent indentation (2 spaces)

3. **Constructive Feedback**: Provide specific, actionable feedback:
   ```
   // Instead of: "This code is confusing"
   // Say: "Consider extracting this logic into a named function to clarify its purpose"
   ```

4. **Code Review Checklist**:
   - [ ] Code follows TypeScript best practices
   - [ ] New functionality has appropriate tests
   - [ ] No unnecessary console logs or commented code
   - [ ] Error handling is appropriate
   - [ ] Component interfaces are clearly defined
   - [ ] No potential memory leaks
   - [ ] Permissions and access control are properly handled

#### Code Review Workflow

1. **Submitting Code for Review**:
   ```bash
   # Ensure code is formatted and passes tests
   bff f
   bff test

   # Generate a diff to review your changes
   sl diff > build/sl.txt

   # Review the changes before committing
   cat build/sl.txt

   # Create a descriptive commit
   sl commit

   # Push changes for review
   sl push
   ```

2. **Reviewing in Sapling**:
   - Use `sl web` to open the Sapling web interface
   - Navigate to "Changes" to see pending reviews
   - Add inline comments by clicking on specific lines
   - Use the "Request changes" or "Approve" options when done

3. **Addressing Review Feedback**:
   ```bash
   # Make requested changes
   bff f  # Format code after changes

   # Amend your commit with changes
   sl amend

   # Push updated changes
   sl push --force
   ```

4. **Completing the Review**:
   - Respond to all comments
   - Request another review if significant changes were made
   - Merge once approved with `sl land`

#### Code Review Best Practices

- **Review Small Changes**: Aim for small, focused commits that are easier to
  review
- **Timely Reviews**: Try to complete reviews within 24 hours
- **Balance Thoroughness and Progress**: Be thorough but pragmatic
- **Knowledge Sharing**: Use reviews as an opportunity to share knowledge
- **Focus on Code, Not the Coder**: Review the code, not the person who wrote it

### Code Style Guidelines

- **Naming**: PascalCase for classes/types/components (BfComponent), camelCase
  for variables/functions
- **Imports**: Use absolute imports with explicit paths, group related imports
  together
- **Types**: Always use proper TypeScript typing, prefer interfaces for object
  types, generics when appropriate
- **Error handling**: Use structured logging with levels, optional chaining,
  null checks with fallbacks
- **Formatting**: 2-space indentation, semicolons required, double quotes for
  strings, JSDoc comments
- **Patterns**: Prefer immutability, use factory methods for object creation,
  separation of concerns
- **Linting rules**: camelCase, no-console, no-external-import, no-self-compare,
  no-sync-fn-in-async-fn, verbatim-module-syntax, no-eval

### Common Type Errors

#### Testing Imports

When writing tests, use the correct import paths for assertion functions:

```typescript
// INCORRECT - will cause error
import { assertEquals } from "@std/testing/asserts";

// CORRECT
import { assertEquals } from "@std/assert";
```

The `@std/assert` module provides all assertion functions for testing, while
`@std/testing` contains other testing utilities like mocks and BDD testing
frameworks.

#### Using Optional Chaining for Nullable Values

When working with potentially null or undefined values, use the optional
chaining operator (`?.`) to safely access properties or methods:

```typescript
// PROBLEMATIC - TypeScript will warn about possible null/undefined
<Component key={item.id} />; // Error: 'item' is possibly 'null'

// BETTER - Using conditional rendering with && and Using optional chaining operator
{
  item && <Component key={item?.id} />;
}
```

The optional chaining operator (`?.`) short-circuits if the value before it is
`null` or `undefined`, returning `undefined` instead of throwing an error.

#### String vs BfGid Type Mismatch

A common error when working with the Content Foundry database layer occurs when
trying to use string IDs directly with collection caches or database lookups:

```
TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type
'BfGid'. Type 'string' is not assignable to type '{ readonly [__nominal__type]:
"BfGid"; }'.
```

##### Why This Happens

Content Foundry uses a nominal typing system for IDs to prevent accidental
mix-ups between different types of IDs. The `BfGid` type is a branded string,
which means it's a string with an additional type property to distinguish it
from regular strings.

When using collection lookups or database queries, you must convert string IDs
to `BfGid` using the `toBfGid` function:

```typescript
// Incorrect - will cause type error
const collection = collectionsCache.get("collection-id");

// Correct - converts string to BfGid
const collection = collectionsCache.get(toBfGid("collection-id"));
```

##### Content Collection ID Format

Content collections follow a specific naming pattern:

- Collections are created with IDs like: `collection-content-marketing`
- But code might try to access with short names like: `collection-marketing`

This naming mismatch, combined with the BfGid type requirement, causes common
errors.

##### How to Fix

Always use the `toBfGid` function when passing IDs to database functions:

```typescript
import { toBfGid } from "packages/bfDb/classes/BfNodeBase.ts";

// Convert string ID to BfGid before using with database methods
const collectionId = toBfGid("collection-content-marketing");
const collection = await ctx.find(BfContentCollection, collectionId);
```

For content collections specifically, ensure you're using the full ID pattern
that includes the content path prefix.

## Special Protocols

This section documents special protocols that can be used with the assistant.
These are prefixed with `!` to distinguish them from regular queries.

### BFA Commit Protocol

The BFA Commit process is split into two separate protocols:

#### BFA Precommit Protocol

When you send the message `!bfa precommit`, the assistant will:

1. Delete the build folder
2. Recreate the build folder with a blank .gitkeep folder inside of it
3. Format your code with `bff f`
4. Run the full CI checks with `bff ci` (format, lint, type check, test, build)
5. Save the CI results to `build/ciresults.txt` for reference
6. Generate a diff of your recent code changes
7. Save the diff to `build/diff.txt` for review

Example usage:

```
!bfa precommit
```

This protocol helps you review your changes before executing the actual commit.
Unlike the previous version, it no longer automatically generates a commit
message.

#### BFA Commit Protocol

When you send the message `!bfa commit`, the assistant will:

1. Configure the Sapling user with
   `sl config --user ui.username "Bff Bot <bot@contentfoundry.com>"`
2. **CRITICAL: Read the diff from `build/diff.txt` (generated in the precommit
   step)**
   - **IMPORTANT: If `build/diff.txt` doesn't exist, stop immediately and inform
     the user that they need to run `!bfa precommit` first**
   - **DO NOT proceed with creating a commit message or any further steps if the
     diff file is missing**
   - **ALWAYS examine the contents of `build/diff.txt` first before making any
     assumptions about the changes**
   - **LOOK ONLY at files mentioned in the diff file, not files you think should
     be changed**
   - **DO NOT make code changes that aren't related to what's in the diff file**
   - **DO NOT implement any functionality that isn't already modified in the
     diff**
   - Generate a commit message based on this diff, not by looking at the
     codebase directly
   - Store the generated message in `build/commit-message.txt`
3. **Check test results in `build/ciresults.txt` to determine if tests are
   failing**
   - If `build/ciresults.txt` doesn't exist, inform the user but continue with
     the commit process
   - If tests are failing, note this in the commit message and prepare to submit
     the PR as a draft
4. Add all changed files to the staging area with `sl add .`
5. Automatically run `sl commit` with the generated message from
   `build/commit-message.txt`
6. Push the commit by running `sl pr submit`
   - If tests are failing, add the `--draft` flag: `sl pr submit --draft` to
     submit as a draft PR
7. Get the currently logged in GitHub user information by running
   `gh api user > build/gh-user.json` to save the data to a JSON file
8. Set the user back using `sl config --user ui.username` again, but with the
   "name" from the JSON file, and the "login" as the email
   "$LOGIN@noreply.githubusers.com"
9. Delete the GitHub user information file to maintain privacy by running
   `rm build/gh-user.json`

Example usage:

```
!bfa commit
```

#### Common BFA Commit Mistakes to Avoid

1. **Implementing unrelated code changes**: Only make changes directly related
   to what's in the diff.
2. **Assuming file contents**: Never assume what's in a file without checking
   the diff first.
3. **Misinterpreting the diff context**: Make sure you understand what changes
   are actually being made.
4. **Modifying the wrong files**: Only edit files that appear in the diff.
5. **Implementing "todo" comments**: Unless explicitly changed in the diff,
   don't implement functionality from todo comments.
6. **Adding new features**: Unless the diff shows partial implementation of a
   new feature, don't add new features.
7. **Shell command composition**: Always separate shell commands properly. For
   multi-line operations, use separate `<proposed_shell_command>` tags for each
   logical command:
   ```
   # INCORRECT - This will try to run everything as a single command
   <proposed_shell_command>
   mkdir -p build
   echo "Commit message" > build/commit-message.txt
   </proposed_shell_command>

   # CORRECT - Use separate command tags
   <proposed_shell_command>
   mkdir -p build
   </proposed_shell_command>

   <proposed_shell_command>
   echo "Commit message" > build/commit-message.txt
   </proposed_shell_command>
   ```

Always run `cat build/diff.txt` as your first command to understand the actual
changes before proceeding with any implementation.

### BFA Agent Update Protocol

When you send the message `!bfa agent update`, the assistant will analyze the
contents of the AGENT.md file and update it to improve clarity, organization,
and consistency.

Example usage:

```
!bfa agent update
```

The assistant will:

1. Review the current AGENT.md document structure
2. Improve formatting and organization for better readability
3. Ensure consistent style throughout the document
4. Update or clarify confusing sections
5. Consolidate redundant information
6. Ensure proper heading hierarchy and section flow

This protocol is useful when documentation has grown organically and needs
restructuring or when new information needs to be integrated cohesively with
existing content.

### BFA Help Protocol

When you send the message `!bfa help`, the assistant will list and explain all
available protocols that can be used with the assistant.

Example usage:

```
!bfa help
```

The assistant will:

1. Provide a complete list of all available !bfa protocols
2. Include a brief description of what each protocol does
3. Show examples of how to use each protocol

Available protocols include:

- `!bfa precommit` - Format code, run tests, and prepare for commit
- `!bfa commit` - Execute the commit using the prepared diff
- `!bfa agent update` - Update the AGENT.md file
- `!bfa help` - Show this help information

If you reply to the assistant's response with a specific protocol (e.g.,
`!bfa commit-prepare`), the assistant will automatically execute that protocol.

## Best Practices

1. **Use BFF commands** for common tasks
2. **Always run `bff f` and `bff ci`** before committing
3. **Follow modular structure** for code organization
4. **Write tests** for new functionality
5. **Document your code** thoroughly
6. **Use typed interfaces** for better reliability
7. **Use `deno add`** for managing dependencies
8. **Leverage Nix** for consistent environments
9. **Use project root-relative paths** in imports and file references, not
   relative to the current file. For example, use
   `import { X } from "packages/web/component.ts"` instead of
   `import { X } from "../web/component.ts"`.
10. **Use lexically sortable inheritance naming** for classes that implement
    interfaces or extend base classes. Start with the base class or interface
    name, followed by specifics, like `DatabaseBackendPostgres` instead of
    `PostgresDatabaseBackend`. This makes imports and directory listings easier
    to scan and understand inheritance hierarchies.
11. **Use static factory methods instead of constructors** for BfModels (BfNode,
    BfEdge, etc.). Never use the `new` keyword directly with these classes.
    Instead:
    - For creating a new node:
      `await BfMyNode.__DANGEROUS__createUnattached(cv, props, metadata)`
    - For creating a node connected to an existing node:
      `await existingNode.createTargetNode(BfMyNode, props, metadata, role)`
    - For creating an edge between nodes:
      `await BfEdge.createBetweenNodes(cv, sourceNode, targetNode, role)`
    - For retrieving existing nodes: `await BfMyNode.find(cv, id)` or
      `await BfMyNode.findX(cv, id)`

    These factory methods ensure proper creation, validation, lifecycle
    callbacks, and database consistency.

## The Cult of Done Manifesto

Content Foundry development embraces principles from the "Cult of Done
Manifesto," created by Bre Pettis and Kio Stark in 2009. This philosophy aligns
with our "Worse is Better" approach and Test-Driven Development methodology.

### The 13 Principles

1. **There are three states of being: Not knowing, action, and completion.**
2. **Accept that everything is a draft.** It helps to get it done.
3. **There is no editing stage.**
4. **Pretending you know what you're doing is almost the same as knowing what
   you are doing, so just accept that you know what you're doing even if you
   don't and do it.**
5. **Banish procrastination.** If you wait more than a week to get an idea done,
   abandon it.
6. **The point of being done is not to finish but to get other things done.**
7. **Once you're done you can throw it away.**
8. **Laugh at perfection.** It's boring and keeps you from being done.
9. **People without dirty hands are wrong.** Doing something makes you right.
10. **Failure counts as done.** So do mistakes.
11. **Destruction is a variant of done.**
12. **If you have an idea and publish it on the internet, that counts as a ghost
    of done.**
13. **Done is the engine of more.**

### Application in Content Foundry Development

In Content Foundry, we apply these principles through:

- **Rapid iteration:** Getting a minimal viable implementation done first
- **Continuous delivery:** Pushing small, incremental improvements regularly
- **Learning by doing:** Gaining insights through implementation rather than
  extended planning
- **Embracing imperfection:** Accepting that all code is a draft that can be
  improved
- **Action over analysis:** Building and testing rather than over-analyzing
- **Failure as progress:** Learning from mistakes and failed approaches

This philosophy complements our "Worse is Better" approach by prioritizing
simplicity, action, and iterative improvement over complex perfection.

## Development Philosophies

### Worse is Better

The "Worse is Better" philosophy (also known as the "New Jersey style") is a
software design approach that prioritizes simplicity in implementation over
other attributes like correctness, consistency, and completeness. Originated by
Richard P. Gabriel in his essay "Lisp: Good News, Bad News, How to Win Big,"
this philosophy has been influential in many successful software systems.

#### Core Principles

1. **Simplicity**: The design must be simple, both in implementation and
   interface. Simplicity of implementation is more important than simplicity of
   interface.

2. **Correctness**: The design must be correct in all observable aspects, but
   it's better to be simple than to handle all possible edge cases.

3. **Consistency**: The design should be consistent, but consistency can be
   sacrificed for simplicity in exceptional cases.

4. **Completeness**: The design must cover as many important situations as
   practical, but completeness can be sacrificed in favor of simplicity.

#### Why It Works

The "Worse is Better" approach often leads to software that:

- Is easier to implement and maintain
- Gets released earlier and starts gathering real-world feedback sooner
- Is more adaptable to changing requirements because of its simpler
  implementation
- Can be incrementally improved over time as real needs become clearer

This contrasts with the "right thing" approach (sometimes called the
"MIT/Stanford style"), which prioritizes correctness, consistency, and
completeness over implementation simplicity.

#### Application in Content Foundry

In Content Foundry, we apply this principle by:

- Starting with minimal viable implementations that solve the core problem
- Releasing early and iterating based on feedback
- Adding complexity only when justified by actual usage patterns
- Favoring solutions that are simple to understand and maintain

Remember that "Worse is Better" doesn't mean "bad is good" - it means that a
simpler solution that works well enough is often superior to a complex "perfect"
solution.

### Worse is Better and Test-Driven Development

The "Worse is Better" philosophy pairs naturally with Test-Driven Development,
especially for backend systems. Here's why we use TDD to implement the "Worse is
Better" approach:

1. **Start Simple**: TDD forces you to write only what's needed to make tests
   pass, discouraging over-engineering.

2. **Incremental Complexity**: Both philosophies encourage starting with a
   minimal implementation and adding complexity only as needed.

3. **Prioritize Working Code**: "Worse is Better" values working code over
   theoretical completeness, while TDD ensures your code works at every step.

4. **Practical Problem Solving**: Both approaches focus on solving actual
   problems rather than anticipated ones.

5. **Refactor as You Go**: TDD's refactoring phase aligns with the "Worse is
   Better" principle of improving simple solutions over time.

By using TDD for backend development, we ensure that we're building systems that
are simple, work correctly for their primary use cases, and can evolve as
real-world requirements become clearer.

## Development Approach

### Understanding Before Implementing

When working on feature requests or bug fixes, it's important to follow this
approach:

1. **Clarify the Request**: Before writing any code, ensure you fully understand
   the problem or requirement.
   - Rephrase the problem in your own words to confirm understanding
   - Ask clarifying questions when the requirements are ambiguous
   - Identify edge cases or potential challenges upfront

2. **Propose an Approach**: Outline your planned solution before implementation.
   - Describe the high-level approach you intend to take
   - Explain the reasoning behind your approach
   - Wait for the user's approval before proceeding with implementation

3. **Implement Incrementally**: Once approved, build the solution in logical,
   small steps.
   - Explain what you're doing at each step
   - If the solution evolves from the initial plan, explain why

This approach prevents wasted effort implementing misunderstood requirements,
ensures alignment between user expectations and the solution, and promotes
thorough problem analysis.

## Test-Driven Development (TDD)

Content Foundry encourages Test-Driven Development for creating robust and
maintainable code. TDD follows a specific workflow cycle known as
"Red-Green-Refactor":

### TDD Workflow

1. **Red**: Write a failing test that defines a function or improvements of a
   function
   - Write a test that defines how the code should behave
   - Run the test to see it fail (it should fail because the functionality
     doesn't exist yet)
   - This validates that your test is actually testing something
   - **IMPORTANT**: A red test should test the intended behavior (what you want
     to happen), not the current implementation (what currently happens)
   - For base classes with methods that throw "Not Implemented" errors, don't
     write tests that verify the error—write tests that verify the desired
     behavior subclasses should implement

2. **Green**: Write the simplest code to make the test pass
   - Focus on just making the test pass, not on perfect code
   - The goal is to satisfy the requirements defined by the test
   - Avoid optimizing at this stage

3. **Refactor**: Clean up the code while ensuring tests still pass
   - Improve the implementation without changing its behavior
   - Eliminate code duplication, improve naming, etc.
   - Run tests after each change to ensure functionality is preserved

### Example TDD Process

Here's a simple example of how TDD might be applied to a Content Foundry
feature:

```typescript
// 1. RED: Write a failing test first
Deno.test("BfEdgeInMemory should find edges by source node", async () => {
  const mockCv = getMockCurrentViewer();
  const sourceNode = await MockNode.__DANGEROUS__createUnattached(mockCv, {
    name: "Source",
  });
  const targetNode = await MockNode.__DANGEROUS__createUnattached(mockCv, {
    name: "Target",
  });

  // Create an edge between nodes
  await BfEdgeInMemory.createBetweenNodes(
    mockCv,
    sourceNode,
    targetNode,
    "test-role",
  );

  // Test the findBySource method (which doesn't exist yet)
  const edges = await BfEdgeInMemory.findBySource(mockCv, sourceNode);

  assertEquals(edges.length, 1);
  assertEquals(edges[0].metadata.bfSid, sourceNode.metadata.bfGid);
  assertEquals(edges[0].metadata.bfTid, targetNode.metadata.bfGid);
});

// Example - Common Pattern to Avoid: Testing Current Implementation Instead of Desired Behavior
// INCORRECT - This test just verifies current implementation (error throwing)
Deno.test("BfEdgeBase save method should throw NotImplemented error", async () => {
  // Import the BfErrorNotImplemented class
  const { BfErrorNotImplemented } = await import("packages/BfError.ts");

  // Create an edge
  const edge = new BfEdgeBase();

  // Assert that calling save throws the correct error - THIS IS WRONG!
  await assertThrows(() => edge.save(), BfErrorNotImplemented);
});

// CORRECT - Test verifies desired behavior for concrete subclasses
Deno.test("Concrete Edge subclasses should properly implement save method", async () => {
  const mockCv = getMockCurrentViewer();
  const sourceNode = await MockNode.__DANGEROUS__createUnattached(mockCv, {
    name: "Source",
  });
  const targetNode = await MockNode.__DANGEROUS__createUnattached(mockCv, {
    name: "Target",
  });

  // Create an edge between nodes using the concrete subclass
  const edge = await ConcreteEdgeClass.createBetweenNodes(
    mockCv,
    sourceNode,
    targetNode,
    "test-role",
  );

  // Test that save returns the edge instance (desired behavior)
  const savedEdge = await edge.save();
  assertEquals(
    savedEdge,
    edge,
    "save() should return the edge instance (this)",
  );

  // Add additional assertions based on what the save method should actually do
  // (e.g., verify edge was persisted in the database, has updated timestamps, etc.)
});
```

// 2. GREEN: Implement the minimum code to make the test pass static async
findBySource( cv: BfCurrentViewer, sourceNode: BfNodeBase, ):
Promise<BfEdgeInMemory[]> { const result: BfEdgeInMemory[] = [];

for (const edge of this.inMemoryEdges.values()) { if (edge.metadata.bfSid ===
sourceNode.metadata.bfGid) { result.push(edge); } }

return result; }

// 3. REFACTOR: Improve the implementation while keeping tests passing static
async findBySource( cv: BfCurrentViewer, sourceNode: BfNodeBase, role?: string,
): Promise<BfEdgeInMemory[]> { return
Array.from(this.inMemoryEdges.values()).filter(edge => { const sourceMatches =
edge.metadata.bfSid === sourceNode.metadata.bfGid; return role ? (sourceMatches
&& edge.props.role === role) : sourceMatches; }); }

````
### Benefits of TDD in Content Foundry

- **Clear requirements**: Tests document what the code is supposed to do
- **Confidence in changes**: Existing tests catch regressions when modifying
  code
- **Design improvement**: Writing tests first encourages more modular, testable
  code
- **Focus on user needs**: Tests represent user requirements, keeping
  development focused
- **Documentation**: Tests serve as executable documentation showing how
  components should work

**It's important to build red tests by themselves initially. Don't try to skip
steps.**

### Testing Abstract Base Classes vs. Concrete Implementations

When testing class hierarchies, follow these principles:

1. **For abstract base classes (like `BfEdgeBase`)**:
   - Test the contract/interface that subclasses should follow
   - Test the common behavior that applies to all subclasses
   - Don't write tests that simply verify "not implemented" errors in placeholder methods
   - Instead, write tests that verify the proper behavior those methods should have when implemented

2. **For concrete implementations (like `BfEdgeInMemory`)**:
   - Run all the base class tests (using the inheritance pattern described earlier)
   - Add tests for implementation-specific behavior
   - Test that placeholder methods from the base class are properly implemented

Remember that the goal of testing abstract base classes is to define the contract that concrete implementations must follow, not to verify that unimplemented methods throw errors.

### Running Tests

Content Foundry provides several ways to run tests:

- Run all tests: `bff test`
- Run specific tests: `deno test -A packages/path/to/test.ts`
- Test coverage: `bff testCoverage`

When writing tests, remember to use the `@std/assert` module for assertions:

```typescript
import { assertEquals, assertThrows } from "@std/assert";
````
