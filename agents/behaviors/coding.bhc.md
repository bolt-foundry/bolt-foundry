When writing code, follow these organizational patterns:

## Directory Structure

- Place test files in a `__tests__` directory within the module they are testing
- Place example files in a `__examples__` directory within the module they
  exemplify
- Database models belong in `apps/bfDb/models/`
- Core model classes belong in `apps/bfDb/coreModels/`

## Type System

- Prefer `type` over `interface` for props objects
- Use the `override` keyword for inherited methods
- Use nominal typing for IDs (BfGid)
- Convert string IDs to `BfGid` using the `toBfGid` function

## Class Structure

- Use lexically sortable naming conventions
  - Start class names with the base class or interface name
  - Follow with specifics about the implementation
- Prefer static factory methods over constructors for BfModels
- Do not use the `new` keyword directly with BfNode, BfEdge, etc.

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
