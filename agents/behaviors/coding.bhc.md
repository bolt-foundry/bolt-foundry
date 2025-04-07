When writing code, follow these organizational patterns:

## Directory Structure

- Place test files in a `__tests__` directory within the module they are testing
- Place example files in a `__examples__` directory within the module they
  exemplify
- Database models belong in `apps/bfDb/models/`
- Core model classes belong in `apps/bfDb/coreModels/`
- Each app follows a similar directory structure to the main boltFoundry app:
  - `components/` - UI components for the app
  - `contexts/` - React contexts
  - `hooks/` - Custom React hooks
  - `utils/` - Utility functions
  - `entrypoints/` - Isograph entrypoints
  - `__generated__/` - Generated code files

## Programming Paradigms

We support both object-oriented and functional programming approaches, choosing
the most appropriate paradigm for each specific use case:

### When to Use Object-Oriented Programming

Object-oriented programming is primarily used in our bfDb system and is ideal
for:

- **Domain modeling**: When creating classes that represent database entities
  (BfNode, BfEdge)
- **Inheritance hierarchies**: When implementing shared behavior across related
  models
- **Relationship modeling**: When expressing connections between entities
  (source/target nodes)
- **Encapsulation**: When you need to bundle data with the methods that operate
  on that data
- **Factory patterns**: When creating instances through controlled
  initialization paths
- **Polymorphic behavior**: When different implementations share the same
  interface

### Object-Oriented Style Guidelines

- Use the `override` keyword for inherited methods
- Use nominal typing for IDs (BfGid)
- Convert string IDs to `BfGid` using the `toBfGid` function
- Prefer static factory methods over constructors for BfModels
- Use class inheritance for core models (inheriting from BfNodeBase, BfEdgeBase)
- Implement required abstract methods from base classes
- Do not use the `new` keyword directly with BfNode, BfEdge, etc.
- Use protected properties for internal state that subclasses may need

### When to Use Functional Programming

Functional programming is preferred for most other areas of the codebase,
particularly:

- **Data transformations**: When processing or mapping data without side effects
- **UI components**: When creating React components and hooks
- **Utility functions**: When creating reusable, pure functions
- **API services**: When building interfaces to external systems
- **State management**: When using immutable patterns for application state

### Functional Style Guidelines

- Prefer pure functions without side effects
- Use immutable data structures whenever possible
- Leverage function composition over inheritance
- Utilize higher-order functions for reusable logic
- Consider using the pipe/flow pattern for data transformations
- Avoid hidden state and mutations within functions

## Type System

- Prefer `type` over `interface` for props objects and data structures
- Use exhaustive discriminated unions for type-safe pattern matching
- Consider using branded types for type safety with primitives
- Leverage TypeScript's inference capabilities when appropriate

## File Organization

- Name the main file of a module after its parent directory
- Use direct imports instead of barrel files (index.ts)
- Use project root-relative paths in imports
- Always include proper error handling

## Relationship Patterns

- Use standard methods from `BfNodeBase` and `BfEdge` directly
- Avoid creating custom relationship methods in model classes
- For testing, use proper factory methods from `BfCurrentViewer` classes

Follow these best practices consistently:

## Development Workflow

- Use BFF commands for common tasks
- Run `bff f` and `bff ci` before committing
- Build with `bff build`
- Type check with `bff check [file_path]`
- Test with `bff test` or `bff t path/to/test/file.test.ts`

## Process Execution

### Deno.Command (Preferred)

Use `Deno.Command` for process execution in Deno 2+:

```typescript
// Creating a command
const command = new Deno.Command("deno", {
  args: ["test", "--allow-net"],
  stdout: "piped",
  stderr: "piped",
});

// Spawning the process
const process = command.spawn();

// Waiting for completion and getting status
const status = await process.status;

// Checking success
if (status.success) {
  console.log("Process completed successfully");
}

// Killing a process if needed
process.kill();

// For output, you can use:
const output = await process.output(); // Includes stdout, stderr, and status
```

Avoid using `Deno.run()` as it's deprecated in Deno 2+.

## Code Quality

- Avoid inline code comments, preferring logger.debug messages
- Use JSDoc for interfaces and explanations
- Implement proper error handling
- Use typed interfaces for better reliability
- Don't use return types in overrides unless significantly changing behavior
- Follow "Worse is Better" philosophy:
  - Prioritize simplicity in implementation
  - Release early and iterate based on feedback
  - Add complexity only when justified by actual usage

## Logging and Debugging

- Use structured logging with levels (logger.info, etc.)
- Never use console.log
- Avoid JSON.stringify in debug messages
- Pass values as trailing arguments to logger functions

## Switch Statement Format

- Always wrap case and default blocks in curly braces `{}`
- Use block scoping to prevent variable declaration issues

## Database Access

- Use static factory methods for model creation
- Follow the standard patterns for node relationships
- Understand the separation between base classes and concrete implementations
