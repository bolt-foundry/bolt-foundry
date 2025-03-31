# AGENT.md

This file is intended to be a reference for assistants, agents, and LLMs looking
to contribute to the Bolt Foundry project. While not explicitly designed for
humans, the file serves as a decent overview of our coding practices.
Definitions

Developers are humans who oversee feature creation in Bolt Foundry. Assistants,
agents, LLMs, etc. are tools used to help developers accomplish tasks.

Project Overview Bolt Foundry is an open-source platform designed to help LLM
applications (and their developers/companies) easily create, use, and reuse
samples and fine-tunes to unit test, increase reliability, and decrease
inference costs. The application uses modern web technologies with Deno as the
runtime, React for the UI, and GraphQL for the API layer. The application is
compiled and served as a standalone Deno executable, allowing for simple
deployment without additional runtime dependencies.

## Project Structure

```
.
├── build/                      # Compiled application output
├── content/                    # Content and documentation
├── infra/                      # Infrastructure code
├── lib/                        # Shared utility functions
├── packages/                   # Project modules
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
- `sl diff` - Show the current uncommitted changes.
- `sl submit` - Submit a pull request with your changes for review

#### Creating Structured Commits

When creating commits in Sapling, it's recommended to follow a structured format
with:

1. A clear, descriptive title
2. A detailed description with "Summary" and "Test Plan" sections

##### Commit Structure

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

- Use a short, descriptive title
- Leave a blank line after the title
- Use line breaks to make the commit message readable
- Use bullet points in the Summary and Test Plan sections

Example commit message:

```
Fix content collection ID lookup and add BfGid type documentation
```

[Click here to see the full commit message with Summary and Test Plan sections]([^commit_example])

> ⚠️ **WARNING**: DO NOT use this exact commit message in your actual commits.
> It's only provided as an example format.

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

Content Foundry provides a comprehensive development environment through BFF,
our task runner:

```bash
# Start development tools
bff devTools

# This starts:
# - Sapling web interface (port 3011)
# - Jupyter notebook (port 8888)
# - Tools web interface (port 9999)
```

## Code Organization

### Directory Structure Patterns

Content Foundry follows specific patterns for organizing code files:

- **Test files**: Place test files in a `__tests__` directory within the module
  they are testing.
  - Example: Tests for `apps/bfDb/classes/SomeClass.ts` should go in
    `apps/bfDb/classes/__tests__/SomeClass.test.ts`
- **Example files**: Place example files in a `__examples__` directory within
  the module they exemplify.
  - Example: Examples for `apps/bfDb/classes/SomeClass.ts` should go in
    `apps/bfDb/classes/__examples__/SomeExampleFile.ts`
- **Model classes**: Database models are in `apps/bfDb/models/`
- **Core model classes**: Base classes for models are in `apps/bfDb/coreModels/`

### Front-end Architecture

Content Foundry uses a component-based architecture with React:

- Components are in `apps/boltFoundry/components/`
- Design system components in `apps/bfDs/components/`
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

```tsx
import { iso } from "apps/boltFoundry/__generated__/__isograph/iso.ts";

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
`apps/boltFoundry/isographEnvironment.ts`:

- Creates an Isograph store
- Configures network requests to the GraphQL endpoint
- Sets up caching

### Development Workflow

1. **Define Components**: Create components with their data requirements
2. **Build**: Run `bff build` to generate Isograph types
3. **Use Components**: Import and use the components in your app

#### Fragment Reader Components

For dynamic component rendering, Content Foundry uses
`BfIsographFragmentReader`:

```tsx
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
`apps/boltFoundry/__generated__/__isograph/`.

### GraphQL API

Content Foundry uses GraphQL for its API layer:

- Schema is defined in `apps/graphql/types/`
- Generated schema available at `apps/graphql/__generated__/schema.graphql`

#### Context Usage in Resolvers

GraphQL resolvers in Content Foundry use a context object (`ctx`) to access
models and data. This pattern ensures proper access control and consistent data
management. [See resolver example]([^graphql_resolver])

Key context methods:

- `ctx.find(Class, id)`: Find an object by ID (returns null if not found)
- `ctx.findX(Class, id)`: Find an object by ID (throws error if not found)
- `ctx.findCurrentUser()`: Get the current authenticated user
- `ctx.login()`, `ctx.register()`: Authentication methods

### Routing Patterns: IDs vs. Slugs

A core principle in Content Foundry's URL and routing structure is: **"IDs are
for computers, slugs are for humans"**. This means:

- Internal operations like database lookups use system-generated IDs (`BfGid`
  types)
- User-facing URLs use human-readable slugs (e.g., `/blog/my-post-title`)
- Dynamic routes should prefer slug parameters over ID parameters when intended
  for end users
- The system handles mapping between slugs and IDs internally

This approach creates more memorable and SEO-friendly URLs while maintaining the
performance and reliability of ID-based lookups in the backend. When designing
new routes or features, consider whether the URL component is primarily for
human or computer consumption and choose the appropriate format.

### Database Layer

Content Foundry supports multiple database backends through an abstraction
layer:

#### DB Backend Architecture

- Database operations are abstracted through the `DatabaseBackend` interface
- The database backend is selected based on environment configuration

#### Implementing Custom DB Backends

The database abstraction makes it easy to add new backend implementations:

1. Implement the `DatabaseBackend` interface in a new class
2. Add backend selection logic to the `getBackend()` function in `bfDb.ts`
3. Use environment variables to control backend selection

### Additional Modules

- **Feature Flags**: Feature toggle system in `apps/boltFoundry/featureFlags/`
  for controlled feature rollouts
- **Analytics**: Custom analytics implementation in `packages/analytics/`
- **Error Handling**: Centralized error handling via `infra/BfError.ts`
- **Configuration**: Environment-based configuration in
  `@bolt-foundry/get-configuration-var`
- **Logging**: Structured logging system in `packages/logger/logger.ts`
- **Tools**: Developer tools in `packages/tools/`
- **Web Server**: Web server implementation in `apps/web/`

## Development Workflow

### Implementation plans

Assistants should always:

1. **Provide reasoning before implementation**: Understanding the "why" is more
   important than the "how." Developers should work with assistants to create an
   implementation plan for features before creating them. These plans can be
   reviewed by multiple assistants, developers, or other parties, to ensure they
   are quality. For smaller changes, like bugfixes, a summary in chat before
   implementing is enough.

2. **Look for Developer sign off**: Developers should be able to confirm their
   satisfaction with an implementation plan before actually writing any code.

3. **Break down complex changes**: For larger features, break down the
   implementation into smaller, more manageable steps with distinct reasoning
   phases.

4. **Never specify work units**: When creating implementation plans, never
   include time estimates in weeks, days, or hours. Instead, Focus on breaking
   down tasks by logical components or phases.

5. **Provide guidance on difficulty or trickiness** It's a great idea to explain
   if a phase is complex, challenging, trivial, simple, etc. Specifying these
   notes can help assistants align with developers on expectaitons.

6. **Implementation plans should NOT contain actual code**: When creating
   implementation plans (e.g., in .mdx files), these should only include:
   - Design principles
   - Class structures and interfaces (as TypeScript type definitions only)
   - Component relationships
   - Data flow descriptions
   - Phase breakdowns Do NOT include actual implementation code in these plans.
     The plans should serve as a blueprint, not as executable code.

7. **Context and code pointers are a MUST.**

   > ⚠️ **IMPORTANT**: All implementation plans should reference existing code
   > paths which the new implementation will touch. This can include frontend,
   > backend, or connected systems. The pointers should be actual markdown links
   > and should be relative to the project directory.

8. **Any classes, complex data flows, etc. should go in an "appendix" section at
   the bottom.**

## Workspace setup

Assistants should check to make sure they're properly configured before trying
to implement features. Usually, that means they should be reading this document
already.

Assistants should encourage developers to add the following to their assistant
prompts.

```
Before making changes, check agent.md which has a list of helpful tips for performing your tasks. If you learn something new that isn't listed in agent.md, ask the user if they'd like you to update agent.md with the new information.
```

This ensures the assistant will reference the documentation and help keep it
up-to-date with new discoveries about the codebase.

### Application Build and Deployment

Content Foundry is compiled into a standalone executable using Deno's
compilation capabilities. This provides several advantages:

1. **Self-contained deployment**: The entire application is bundled into a
   single binary
2. **No runtime dependencies**: No need to install Deno on production servers
3. **Improved startup time**: Faster cold starts compared to interpreted
   execution
4. **Simplified deployment**: Just copy and run the executable

The compilation process happens during `bff build` and creates executables in
the `build/` directory. The compilation command includes necessary permissions
for network, file system, and environment variables access.

### Dependency Management

Content Foundry uses Deno 2 for JavaScript/TypeScript runtime and dependency
management.

#### Deno 2 Dependency Management

Deno 2 introduces significant changes to dependency management:

- Dependencies are handled through the `deno.jsonc` configuration
- Use `deno add` to add new dependencies:
  ```bash
  # Add a dependency from JSR (JavaScript Registry)
  deno add jsr:@std/http

  # Add a dependency from npm
  deno add npm:react
  ```

- JSR (JavaScript Registry) is the preferred package source
- `deno add` will automatically add dependencies to `deno.jsonc` if jsr, or
  `package.json` if npm.

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

# Code Quality

### Debugging with Logger Environment Variables

Content Foundry uses a flexible logging system that can be controlled through
environment variables:

#### JSON.stringify should be avoided

When using debug logging, it's important to note that `JSON.stringify()` cannot
serialize `BigInt` values and has other quirks. For this reason:

**Avoid using JSON.stringify in debug messages** -
[Instead, pass values as
trailing arguments to logger functions]([^json_stringify])

#### Global Log Level

Set the default log level for all loggers with the `LOG_LEVEL` environment
variable:

```bash
# Examples
LOG_LEVEL=DEBUG bff t path/to/test.ts  # Set all loggers to DEBUG level
LOG_LEVEL=TRACE bff t path/to/test.ts  # Set all loggers to TRACE level (most verbose)
LOG_LEVEL=ERROR bff t path/to/test.ts  # Set all loggers to ERROR level (least verbose)
```

Available log levels (from most to least verbose):

- TRACE
- DEBUG
- INFO (default if not specified)
- WARN
- ERROR

#### Specific Logger Debug Mode

Enable DEBUG level for specific loggers using the `ENABLE_DEBUG_LOGGER`
environment variable:

```bash
# Enable DEBUG level for a single module
ENABLE_DEBUG_LOGGER=apps/bfDb/coreModels/BfNode.ts bff t path/to/test.ts

# Enable DEBUG for multiple modules (comma-separated)
ENABLE_DEBUG_LOGGER=apps/bfDb/coreModels/BfNode.ts,apps/bfDb/bfDb.ts bff t path/to/test.ts

# Enable DEBUG for all modules in a directory (wildcard)
ENABLE_DEBUG_LOGGER=apps/bfDb/* bff t path/to/test.ts
```

This allows for targeted debugging without increasing verbosity across the
entire application.

### Content Linting

Content Foundry provides tools for linting markdown content files to ensure they
follow the required format:

```bash
# Check content files
bff contentLint

# Automatically fix common issues
bff contentLint --fix
```

The content linter checks for:

- Proper frontmatter format with opening and closing delimiters (`---`)
- Required frontmatter fields (`title`, `author`, `summary`, `cta`)
- Correctly formatted content structure

Content files should include frontmatter with required fields:

```markdown
---
title: "Article Title"
author: "Author Name"
summary: "Brief summary of article contents"
cta: "Read more"
---

Content goes here...
```

### Testing Approaches

#### Standard Testing

The project primarily uses Deno's built-in testing capabilities:

- Standard syntax with `Deno.test("description", () => { ... })`
- Assertions from `@std/assert` (not `@std/testing/asserts`)
- Simple execution with `bff test` or `bff t`

[See standard testing example]([^standard_testing])

#### Test Inheritance Pattern

When testing classes that extend base classes (like `BfNodeBase`),
[follow the inheritance pattern in the tests]([^test_inheritance]):

1. Base class tests (`BfNodeBaseTest.ts`) define common test behaviors
2. Derived class tests extend or import from base tests and only implement
   additional tests for unique functionality

This pattern ensures:

- Test consistency across related classes
- Proper coverage of inherited functionality
- Focus on testing only the unique aspects in derived classes
- Changes to base functionality only need updates in one place

### Node Relationships Pattern

When working with relationships between nodes in the Content Foundry database
layer, always use the standard methods from `BfNodeBase` and `BfEdge` directly
rather than creating custom relationship methods in model classes:

#### Incorrect Pattern (Avoid)

[Creating custom relationship methods in model classes]([^node_relationships_bad])

#### Correct Pattern (Recommended)

[Using standard methods directly where needed]([^node_relationships_good])

#### Benefits of Standard Methods:

1. **Consistency**: Uses the same pattern across the codebase
2. **Maintainability**: Avoids code duplication in model classes
3. **Flexibility**: Allows for more complex queries with standard parameters
4. **Testing**: Easier to test with standard interfaces

Always use these standard relationship methods rather than creating custom
wrappers in model classes.

#### Mocking Current Viewers in Tests

When testing components that require a `BfCurrentViewer` instance,
[always use
the proper factory methods from the `BfCurrentViewer` classes]([^current_viewer_mocking])
rather than custom helper functions like `getMockCurrentViewer()`.

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

2. **Constructive Feedback**:
   [Provide specific, actionable feedback]([^constructive_feedback])

3. **Code Review Checklist**:
   - [ ] Code follows TypeScript best practices
   - [ ] New functionality has appropriate tests
   - [ ] No unnecessary console logs or commented code
   - [ ] Error handling is appropriate
   - [ ] Component interfaces are clearly defined
   - [ ] No potential memory leaks
   - [ ] Permissions and access control are properly handled

### Code Style Guidelines

- **Programming Paradigm**: Prefer functional approaches to code over
  object-oriented programming (OOP) except when modeling data. Use pure
  functions, avoid unnecessary classes, and minimize side effects.
- **Naming**: PascalCase for classes/types/components (BfComponent), camelCase
  for variables/functions
- **Imports**: Use absolute imports with explicit paths, group related imports
  together. Our `deno.jsonc` file handles making the majority of imports
  relative to the workspace root.
- **Types**: Always use proper TypeScript typing. Avoid interfaces generally,
  and generally use Array<Type> syntax rather than Type[] shorthand.
- **Error handling**: Use structured logging with levels. Always use logger.info
  etc and never console.log
- **Patterns**: Prefer immutability, use factory methods for object creation,
  separation of concerns

Linting and code style patterns can be seen in deno.jsonc.

## Switch Case Formatting

When using switch statements in TypeScript/JavaScript code, Bolt Foundry follows
these guidelines:

### Switch Case Blocks

All case and default blocks must be wrapped in curly braces `{}` to create
proper block scoping. This prevents variable declaration issues and follows
Deno's linting rules.

### ❌ Incorrect Format (Avoid)

```typescript
switch (value) {
  case "a":
    const result = doSomething();
    console.log(result);
    break;

  case "b":
    const result = doSomethingElse(); // Error: 'result' already declared
    break;

  default:
    console.log("default case");
}
```

### ✅ Correct Format (Use This)

```typescript
switch (value) {
  case "a": {
    const result = doSomething();
    console.log(result);
    break;
  }

  case "b": {
    const result = doSomethingElse(); // No error - 'result' is scoped to this block
    break;
  }

  default: {
    console.log("default case");
  }
}
```

## Benefits of Block Scoping

1. **Prevents Variable Collision**: Variables declared in one case won't collide
   with identically named variables in other cases
2. **Clearer Code Organization**: Each case becomes a clearly defined block of
   code
3. **Consistent Style**: Matches Deno linting rules and project conventions
4. **Safer Refactoring**: Makes it easier to move code between cases without
   unintended side effects

Remember that even with block scoping, `break` statements are still required to
prevent fall-through (unless fall-through is intentional).

### Common Type Errors

#### Using the `override` Keyword

TypeScript 4.3+ includes the `override` keyword, which should be used whenever
overriding methods from parent classes.
[This is a powerful feature for ensuring
type safety and preventing errors when working with inheritance]([^override_keyword]).

#### Best Practices for `override`:

1. **Always use `override` when implementing a method from a parent class**:
   This helps TypeScript verify that the method actually exists in the parent
   class and has a compatible signature.

2. **Type checking benefits**: The compiler will flag an error if:
   - The method doesn't exist in any parent class
   - The method signature is incompatible with the parent class method
   - The parent method is removed or renamed in the future

3. **Documentation value**: Using `override` makes it clear which methods are
   inherited vs. new to the current class.

4. **Error prevention**: Catches common mistakes like typos in method names or
   incorrect parameter types.

##### When to use `override`:

- Always use it when implementing methods defined in parent classes
- Use it for methods defined in interfaces that the class implements
- Essential for methods in class hierarchies like `BfNodeBase` → `BfContentItem`
- Generally, when overriding methods, you don't need to include a return
  signature.

##### Real-world example:

[Compare correct vs. incorrect override implementation techniques]([^override_example])

#### Testing Imports

When writing tests,
[use the correct import paths for assertion functions]([^testing_imports])

#### Using Optional Chaining for Nullable Values

When working with potentially null or undefined values, use the optional
chaining operator (`?.`) to safely access properties or methods:

[Use optional chaining and conditional rendering for potentially null values]([^optional_chaining])

The optional chaining operator (`?.`) short-circuits if the value before it is
`null` or `undefined`, returning `undefined` instead of throwing an error.

#### Type vs Interface for Props Objects

When defining props objects for models in Content Foundry,
[prefer using `type` instead of `interface`]([^type_vs_interface]). BfNode style
props and metadata are constantly going from/to json, so they can't include
undefined etc. Interfaces make this tricky, while types make it simple.

##### Why Type is Preferred for Props Objects

> 🔍 **IMPORTANT**: When working with JSON, `undefined` values are stripped
> during serialization. Using `type` makes it clearer that optional properties
> might be missing entirely in the JSON representation, not just `undefined`.

> 🔍 **IMPORTANT**: While interfaces can be useful for defining contractual
> shapes that classes implement, `type` is more appropriate for simple data
> structures that represent serializable objects.

> 🔍 **IMPORTANT**: Using `type` for props objects helps clarify that optional
> properties (those with `?`) might not exist at all in the deserialized object,
> rather than existing with an explicit `undefined` value.

> 🔍 **IMPORTANT**: Since JSON cannot represent `undefined` (only `null`), using
> `type` better reflects the actual runtime behavior of these objects.

#### String vs BfGid Type Mismatch

A common error when working with the Content Foundry database layer occurs when
trying to use string IDs directly with collection caches or database lookups:

```
TS2345 [ERROR]: Argument of type 'string' is not assignable to parameter of type
'BfGid'. Type 'string' is not assignable to type '{ readonly [__nominal__type]:
"BfGid"; }'.
##### Why This Happens

Content Foundry uses a nominal typing system for IDs to prevent accidental
mix-ups between arbitrary strings and IDs. The `BfGid` type is a branded string,
which means it's a string with an additional type property to distinguish it
from regular strings. This should also help us enforce logging guarantees for
sensitive types in the future™.

When using collection lookups or database queries,
[you must convert string IDs
to `BfGid` using the `toBfGid` function]([^bfgid_conversion])

#### File Organization Patterns

The Content Foundry codebase follows specific patterns for organizing and
importing code:

##### Main Module Files

Always name the main file of a module after its parent directory, rather than using "index.ts":

- **Preferred**: `routes/routes.ts` (matches the directory name)
- **Avoid**: `routes/index.ts` (generic name that doesn't indicate purpose)

This approach improves code discoverability and makes it easier to trace module boundaries in the codebase. When you see an import like `import { Router } from "apps/web/routes/routes.ts"`, you immediately know which file to look for.

##### Direct Imports vs Barrel Files

The project intentionally avoids using "barrel files" (index.ts files that
re-export multiple modules) for these important reasons:

1. **Code Greppability**: Direct imports make the codebase easily searchable
   with tools like grep. When you search for an import path, you'll find exactly
   where a module is defined and used.

2. **Import Clarity**: Direct imports show exactly where code is coming from,
   making it easier for developers to understand dependencies and track down
   issues.

3. **Build Tool Optimization**: Direct imports allow better tree-shaking and
   code-splitting in build tools.

[See examples of preferred import patterns]([^direct_imports])

# Database Models and Edge Behavior

### BfEdgeBase vs BfEdge Implementation

When working with the database layer, it's important to understand the
relationship between base classes and their concrete implementations:

- `BfEdgeBase` is an abstract base class that defines the interface for edges
  but does not implement database persistence. Its `save()` method should not be
  implemented at this level, as it's meant to be implemented by concrete
  subclasses. It is not an actual abstract class so that we can use "new this"
  in static methods without type warnings.

- `BfEdge` is a concrete implementation that extends `BfEdgeBase` and properly
  implements database persistence with its own `save()` method that stores data
  in the database.

- `BfEdge$OTHERNAME` would be for extending either BfEdgeBase or BfEdge. BfEdge
  will touch the database, while items extending BfEdgeBase will not touch the
  database.

#### Important code notes

1. Do not add database saving, filesystem access, or other persistent
   functionality to `BfEdgeBase` directly. This violates the separation of
   concerns in the class hierarchy.

2. Always use `BfEdge` or another concrete implementation when you need to
   persist edge data.

3. In tests that involve the edge base class, typically use BfEdgeInMemory,
   since it won't have any notable side effects.

This pattern allows for different storage backends or in-memory implementations
without modifying the base interface.

# !BFA: Bolt Foundry Assistant Protocols

This section documents special protocols that can be used with the assistant.
These are prefixed with `!` to distinguish them from regular queries.

Protocols are intended to help assistants complete consecutive actions. They're
kind of like scripts, but designed to be implemented using english language
rather than code.

Generally, if breakage is tolerated in a process, it should be a protocol. If a
process would lead to a potentially catostrophic outcome which someone couldn't
recover from (talking to external systems usually) then it should be a script,
and usually built as a BFF task.

### !BFA protocol setup and usage

Developers will tell the assistant `!bfa $PROTOCOLNAME` and optionally provide
additional context after the protocol. Normally protocols are camelCased.

### !BFA Commit Protocol

The BFA Commit process is split into two separate protocols:

#### BFA Precommit Protocol

When developers send the message `!bfa precommit`, the assistant will:

1. Delete the build directory if it exists
2. Create a fresh build directory
3. Format the code using `bff f`
4. Run tests with `bff test`
5. Add / remove all files from sapling using `sl add .`
6. Generate a diff file with all changes using `sl diff > build/diff.txt`

The intention behind this protocol is to gather enough context so that the next
step is simple enough for the assistant to run without having to gather any
additional context.

#### BFA Commit Protocol

When developers send the message `!bfa commit`, the assistant will:

1. Configure the Sapling user with
   `sl config --user ui.username "Bff Bot <bot@contentfoundry.com>"`
2. **CRITICAL: Read the diff from `build/diff.txt` (generated in the precommit
   step)**

   > ### ⚠️ COMMIT PROTOCOL SAFETY RULES:
   >
   > - **STOP IMMEDIATELY** if `build/diff.txt` doesn't exist and tell the user
   >   to run `!bfa precommit` first
   > - **NEVER proceed** with creating a commit message if the diff file is
   >   missing
   > - **ALWAYS examine** the contents of `build/diff.txt` before making any
   >   assumptions
   > - **LOOK ONLY** at files mentioned in the diff file, not files you think
   >   should be changed
   > - **DO NOT** make code changes that aren't related to what's in the diff
   >   file
   > - **DO NOT** implement any functionality that isn't already modified in the
   >   diff
   - Generate a commit message based on this diff, not by looking at the
     codebase directly
   - Store the generated message in `build/commit-message.txt`
3. Automatically run `sl commit` with the generated message from
   `build/commit-message.txt`
4. Push the commit by running `sl pr submit`
   - If tests are failing or the user asks, add the `--draft` flag:
     `sl pr submit --draft` to submit as a draft PR.
5. Clean up the diff.txt and commit-message.txt files
6. Get the currently logged in GitHub user information by running
   `gh api user > build/gh-user.json` to save the data to a JSON file
7. Set the user back using `sl config --user ui.username` again, but with the
   "name" from the JSON file, and the "login" as the email
   "$LOGIN@noreply.githubusers.com"
8. Delete the GitHub user information file to maintain privacy by running
   `rm build/gh-user.json`

#### Common BFA Commit Mistakes to Avoid

1. **Implementing unrelated code changes**: Only make changes directly related
   to what's in the diff.
2. **Assuming file contents**: Never assume what's in a file without checking
   the diff first.
3. **Misinterpreting the diff context**: Make sure you understand what changes
   are actually being made.
4. **Implementing "todo" comments**: Unless explicitly changed in the diff,
   don't implement functionality from todo comments.

### BFA Help Protocol

When developers send the message `!bfa help`, the assistant will list and
explain all available protocols that can be used with the assistant.

Example usage:
```

!bfa help

````
The assistant will:

1. Provide a complete list of all available !bfa protocols
2. Include a brief description of what each protocol does
3. Show examples of how to use each protocol

Available protocols include:

- `!bfa precommit` - Format code, run tests, and prepare for commit
- `!bfa commit` - Execute the commit using the prepared diff
- `!bfa help` - Show this help information

If you reply to the assistant's response with a specific protocol (e.g.,
`!bfa commit-prepare`), the assistant will automatically execute that protocol.

## Best Practices

1. **Use BFF commands** for common tasks
2. **Always run `bff f` and `bff ci`** before committing
3. **Follow modular structure** for code organization
4. **Write tests** for new functionality
5. **Generally avoid inline code comments.** Inline code comments clutter an
   implementation of a function or class. If you have to document something,
   it's a much better idea to explain it in a logger.debug message than in a
   code comment. This makes it easier to fix problems.
6. **Use JSDOCs in most places** JSDOCs explain interfaces, so they're a great
   way to help developers understand intentions without providing too much
   verbosity.
7. **Use typed interfaces** for better reliability
8. **Overrides shouldn't use return types unless the return type is changing
   significantly** Class overrides typically should implement their parent
   class's behavior and interface, and adding additional return types can really
   complicate and confuse the type system.
9. **Use project root-relative paths** in imports and file references, not
   relative to the current file. For example, use
   `import { X } from "apps/web/component.ts"` instead of
   `import { X } from "../web/component.ts"`.
10. **Use lexically sortable inheritance naming** for classes that implement
    interfaces or extend base classes. Start with the base class or interface
    name, followed by specifics, like `DatabaseBackendPostgres` instead of
    `PostgresDatabaseBackend`. This makes imports and directory listings easier
    to scan and understand inheritance hierarchies.

    The lexical sorting approach to class names follows these principles:
    - Start class names with the base class or interface name
    - Follow with specifics about the implementation
    - This creates natural groupings in directory listings and imports
    - Makes inheritance relationships immediately visible

    [See examples of lexical naming patterns]([^lexical_naming])

    This naming convention creates natural groupings in code editors, making it
    easier to:
    - Find related implementations
    - Understand class hierarchies at a glance
    - Locate all implementations of a particular interface
    - Maintain consistency in large codebases

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

# Development Philosophies

### The Cult of Done Manifesto

Content Foundry development embraces principles from the "Cult of Done
Manifesto," created by Bre Pettis and Kio Stark in 2009. This philosophy aligns
with our "Worse is Better" approach and Test-Driven Development methodology.

#### The 13 Principles

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

# Test-Driven Development (TDD)

Content Foundry strictly follows Test-Driven Development for creating robust and
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
   - **CRITICAL**: When implementing new functionality, ALWAYS create "red
     tests" first - implement the tests that define the intended behavior before
     implementing the actual functionality
   - The red test itself should be a separate, dedicated commit

2. **Green**: Write the simplest code to make the test pass
   - Focus on just making the test pass, not on perfect code
   - The goal is to satisfy the requirements defined by the test
   - Avoid optimizing at this stage
   - Only implement this AFTER the red test is committed

3. **Refactor**: Clean up the code while ensuring tests still pass
   - Improve the implementation without changing its behavior
   - Eliminate code duplication, improve naming, etc.
   - Run tests after each change to ensure functionality is preserved

### Common TDD Mistakes to Avoid

1. **Implementing functionality before tests**: Never implement a feature or
   bugfix without first writing a failing test that defines the expected
   behavior.

2. **Skipping the "Red" phase**: Always verify that your test fails before
   implementing the functionality. A test that passes immediately will not be
   testing anythign meaningul.

3. **Writing tests after implementation**: This defeats the purpose of TDD and
   often results in tests that verify what the code does, rather than what it
   should do.

4. **Implementing too much at once**: Write minimal tests and implement minimal
   code to pass those tests. Build functionality incrementally.

5. **Creating test and implementation in the same commit**: Separate your
   commits - first commit the failing test, then commit the implementation that
   makes it pass.

6. **Add minimum requirements for type checking in the test itself.** If testing
   a new class for instance, create the class in the test, not in the file it
   will go to.

### Example TDD Process

Here's a simple example of how TDD might be applied to a Content Foundry
feature:

[See complete TDD example with Red-Green-Refactor process]([^tdd_example])

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

> 🔑 **CRITICAL**: Always build red tests by themselves initially as a separate
> commit. Don't skip steps in the TDD process.

### Testing Abstract Base Classes vs. Concrete Implementations

When testing class hierarchies, follow these principles:

1. **For abstract base classes (like `BfEdgeBase`)**:
   - Test the contract/interface that subclasses should follow
   - Test the common behavior that applies to all subclasses
   - Don't write tests that simply verify "not implemented" errors in
     placeholder methods
   - Instead, write tests that verify the proper behavior those methods should
     have when implemented

2. **For concrete implementations (like `BfEdgeInMemory`)**:
   - Run all the base class tests (using the inheritance pattern described
     earlier)
   - Add tests for implementation-specific behavior
   - Test that placeholder methods from the base class are properly implemented

Remember that the goal of testing abstract base classes is to define the
contract that concrete implementations must follow, not to verify that
unimplemented methods throw errors.

### Running Tests

Content Foundry provides several ways to run tests:

- Run all tests: `bff test`
- Run specific tests: `deno test packages/path/to/test.ts`

### Frequent testing gotchas

When writing tests, remember to use the `@std/assert` module for assertions:

```typescript
import { assertEquals, assertThrows } from "@std/assert";
````

# Common Tasks

- Build: `bff build`
- Lint: `bff lint [--fix]`
- Format: `bff format` (alias: `bff f`)
- Type check: `bff check [file_path]`
- Test all: `bff test`
- Run single test: `bff t path/to/test/file.test.ts`

  > 🔍 **IMPORTANT**: Always use `bff t` rather than raw `deno test` commands.
  > The `bff t` command ensures consistent permission flags, environment
  > variables, and test configuration. This prevents issues with permissions and
  > improves test reliability across environments.
- Development environment: `bff devTools`
- Full CI check: `bff ci` (combines format, lint, check, test, build)

# Footnotes

[^commit_example]: Full commit message example:

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

[^test_inheritance]: Test inheritance pattern example:

    ```typescript
    // In BfNodeBaseTest.ts
    export function runBaseNodeTests(NodeClass) {
      Deno.test("should implement common node behavior", async () => {
        // Test base functionality
      });
    }

    // In BfNodeOnDisk.test.ts
    import { runBaseNodeTests } from "./BfNodeBaseTest.ts";

    // Run the base tests first
    runBaseNodeTests(BfNodeOnDisk);

    // Then add tests specific to BfNodeOnDisk
    Deno.test("BfNodeOnDisk should save to disk", async () => {
      // Test disk-specific functionality
    });
    ```

[^node_relationships_bad]: Incorrect node relationship pattern:

    ```typescript
    // ❌ In BfContentCollection.ts - AVOID THIS APPROACH
    class BfContentCollection extends BfNodeBase<BfContentCollectionProps> {
      // Don't create custom relationship methods in model classes
      async addItem(cv: BfCurrentViewer, item: BfContentItem): Promise<BfEdge> {
        return BfEdge.createBetweenNodes(cv, this, item);
      }

      async getItems(cv: BfCurrentViewer): Promise<BfContentItem[]> {
        const edges = await BfEdge.queryTargetInstances(
          cv,
          BfContentItem,
          this.metadata.bfGid,
        );
        return edges;
      }
    }
    ```

[^node_relationships_good]: Correct node relationship pattern:

    ```typescript
    // ✅ Use standard methods directly where needed
    // Creating relationships
    const edge = await BfEdge.createBetweenNodes(cv, collection, item);

    // Querying relationships
    const items = await BfEdge.queryTargetInstances(
      cv,
      BfContentItem,
      collection.metadata.bfGid,
    );
    ```

[^current_viewer_mocking]: Mocking current viewers examples:

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

[^constructive_feedback]: Constructive feedback examples:

    ```
    // Instead of: "This code is confusing"
    // Say: "Consider extracting this logic into a named function to clarify its purpose"

    // Instead of: "Why does this work this way?"
    // Say: "Help me understand how this code works."
    ```

[^json_stringify]: JSON.stringify examples:

    ```typescript
    // ❌ BAD - will throw if object contains BigInt
    logger.debug(`Object data: ${JSON.stringify(objWithBigInt)}`);

    // ✅ GOOD - pass as separate argument
    logger.debug("Object data:", objWithBigInt);
    ```

[^standard_testing]: Standard testing example:

    ```typescript
    // Example standard test
    import { assertEquals } from "@std/assert";

    Deno.test("my test function", (t) => {
      assertEquals(1 + 1, 2);

      t.step("example step", () => {
        assertEquals(2 + 2, 4);
      });
    });
    ```

[^graphql_resolver]: GraphQL resolver example:

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

[^override_keyword]: Override keyword example:

    ```typescript
    // CORRECT: Using override for methods that exist in the parent class
    class BfContentItem extends BfNodeBase<BfContentItemProps> {
      override async save(): Promise<this> {
        logger.debug(`Saving BfContentItem: ${this.metadata.bfGid}`);
        // Implementation details
        return this;
      }
    }
    ```

[^override_example]: Override real-world example:

    ```typescript
    // Base class
    abstract class BfNodeBase<T extends BfNodeBaseProps> {
      async save(): Promise<this> {
        // Base implementation
        return this;
      }
    }

    // ❌ Child class - INCORRECT (missing override and changes return signature unnecessarily)
    class BfContentItem extends BfNodeBase<BfContentItemProps> {
      async save(): Promise<this> { // TypeScript won't catch potential errors
        return this;
      }
    }

    // ✅ Child class - CORRECT
    class BfContentItem extends BfNodeBase<BfContentItemProps> {
      override async save() { // Properly marked as overriding
        // Implementation
        return this;
      }
    }
    ```

[^testing_imports]: Testing imports example:

    ```typescript
    // ❌ INCORRECT - will cause error
    import { assertEquals } from "@std/testing/asserts";

    // ✅ CORRECT
    import { assertEquals } from "@std/assert";
    ```

[^optional_chaining]: Optional chaining example:

    ```typescript
    // ❌ PROBLEMATIC - TypeScript will warn about possible null/undefined
    <Component key={item.id} />; // Error: 'item' is possibly 'null'

    // ✅ BETTER - Using conditional rendering with && and Using optional chaining operator
    {
      item && <Component key={item?.id} />;
    }
    ```

[^type_vs_interface]: Type vs interface examples:

    ```typescript
    // ✅ PREFERRED: Using type for props objects
    export type BfContentItemProps = BfNodeBaseProps & {
      title: string;
      body: string;
      slug: string;
      filePath?: string;
      summary?: string;
      author?: string;
      cta?: string;
      href?: string;
    };

    // ❌ AVOID: Using interface for props objects
    export interface BfContentItemProps extends BfNodeBaseProps {
      title: string;
      body: string;
      slug: string;
      filePath?: string;
      summary?: string;
      author?: string;
      cta?: string;
      href?: string;
    }
    ```

[^bfgid_conversion]: BfGid type conversion example:

    ```typescript
    // ❌ Incorrect - will cause type error
    const collection = collectionsCache.get("collection-id");

    // ✅ Correct - converts string to BfGid
    const collection = collectionsCache.get(toBfGid("collection-id"));
    ```

[^direct_imports]: Import patterns example:

    ```typescript
    // ✅ PREFERRED: Direct import from specific file
    import { BfPerson } from "apps/bfDb/models/BfPerson.ts";

    // ❌ AVOID: Import from barrel file
    import { BfPerson } from "apps/bfDb/models/index.ts";
    ```

[^lexical_naming]: Lexical naming examples:

    ```typescript
    // ✅ PREFERRED: Lexically sortable naming
    class DatabaseBackendPostgres implements DatabaseBackend { ... }
    class DatabaseBackendSQLite implements DatabaseBackend { ... }
    class BfNodeInMemory extends BfNodeBase { ... }
    class BfNodeOnDisk extends BfNodeBase { ... }

    // ❌ AVOID: Non-sortable naming
    class PostgresDatabaseBackend implements DatabaseBackend { ... }
    class SQLiteDatabaseBackend implements DatabaseBackend { ... }
    class InMemoryBfNode extends BfNodeBase { ... }
    class OnDiskBfNode extends BfNodeBase { ... }
    ```

[^tdd_example]: TDD example process:

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

    // ❌ INCORRECT - This test just verifies current implementation (error throwing)
    Deno.test("BfEdgeBase save method should throw NotImplemented error", async () => {
      // Import the BfErrorNotImplemented class
      const { BfErrorNotImplemented } = await import("infra/BfError.ts");

      // Create an edge
      const edge = new BfEdgeBase();

      // Assert that calling save throws the correct error - THIS IS WRONG!
      await assertThrows(() => edge.save(), BfErrorNotImplemented);
    });

    // ✅ CORRECT - Test verifies desired behavior for concrete subclasses
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

    // 2. GREEN: Implement the minimum code to make the test pass
    static async findBySource(
      cv: BfCurrentViewer, 
      sourceNode: BfNodeBase
    ): Promise<BfEdgeInMemory[]> { 
      const result: BfEdgeInMemory[] = [];

      for (const edge of this.inMemoryEdges.values()) { 
        if (edge.metadata.bfSid === sourceNode.metadata.bfGid) { 
          result.push(edge); 
        } 
      }

      return result; 
    }

    // 3. REFACTOR: Improve the implementation while keeping tests passing
    static async findBySource(
      cv: BfCurrentViewer, 
      sourceNode: BfNodeBase, 
      role?: string
    ): Promise<BfEdgeInMemory[]> { 
      return Array.from(this.inMemoryEdges.values()).filter(edge => { 
        const sourceMatches = edge.metadata.bfSid === sourceNode.metadata.bfGid; 
        return role ? (sourceMatches && edge.props.role === role) : sourceMatches; 
      }); 
    }
    ```
