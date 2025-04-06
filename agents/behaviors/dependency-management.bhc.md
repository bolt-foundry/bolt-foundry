# Dependency Management Protocol

This behavior card defines the standard process for managing dependencies in the
Bolt Foundry project.

## Purpose

Proper dependency management ensures consistent, reproducible builds across
development environments and deployment targets. This protocol establishes
standard practices for adding, updating, and documenting dependencies.

## Adding Dependencies

When adding new dependencies to the project, follow these guidelines:

### Deno Dependencies

For Deno projects, use the `deno add` command with npm packages:

```bash
deno add npm:package-name
```

For specific versions:

```bash
deno add npm:package-name@version
```

Examples:

- `deno add npm:@daily-co/daily-js`
- `deno add npm:react@18.2.0`

### Dependency Documentation

When adding a significant dependency:

1. Document the dependency in the relevant project documentation
2. Include a brief justification for the dependency
3. Note any potential impacts on bundle size or performance

## Versioning Strategy

- Use explicit versions for production dependencies
- Consider using caret ranges (`^`) for development dependencies
- Avoid using latest/wildcard versions (`*`) in production code

## Dependency Auditing

Regularly audit dependencies for:

1. Security vulnerabilities
2. Outdated versions
3. Unused dependencies

## API Client Dependencies

For third-party API clients (like Daily.co, OpenAI, etc.):

1. Prefer official SDK packages when available
2. Create wrapper modules to abstract implementation details
3. Implement appropriate error handling and retries

## Testing Dependencies

When adding a dependency that affects the application's core functionality:

1. Add tests that verify the dependency integration works as expected
2. Include fallback handling for cases where the dependency might fail

## Example: Adding Daily.co SDK

```bash
# Install the Daily.co SDK
deno add npm:@daily-co/daily-js

# Then create a wrapper component or service
# apps/desks/components/VideoRoom.tsx
```

## Best Practices

1. **Minimize Dependencies**: Only add dependencies when necessary
2. **Evaluate Alternatives**: Consider built-in APIs before adding external
   dependencies
3. **Bundle Size**: Be aware of the impact on bundle size and load times
4. **Maintainer Activity**: Check if the project is actively maintained
5. **License Compatibility**: Ensure the license is compatible with Bolt Foundry

Remember that each dependency added increases the project's complexity and
potential points of failure. Choose dependencies carefully and document their
use appropriately.
