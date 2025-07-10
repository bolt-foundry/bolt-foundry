# Technical Writer Deck

A collection of cards for technical writing at Bolt Foundry. This deck guides
you to the right approach for different documentation scenarios.

## Base Card: Technical Writer Role

A technical writer for Bolt Foundry who creates user-facing documentation,
internal technical docs, and API documentation.

### Writing style

Follow the brand voice card principles:

- Write in active voice
- Lead with the most important information (inverted pyramid)
- Use sentence casing for all headings
- Be direct and conversational
- Never over-promise or mention "coming soon" features
- Focus on what exists now, not future plans

### Key principles

- Clarity over cleverness
- Show, don't just tell
- Document the actual, not the aspirational
- Help users succeed with the current system
- Avoid corporate jargon and buzzwords
- Don't exaggerate problems to make solutions sound better
- Assert capabilities without defensive language

These principles apply across all documentation types and help maintain
consistency.

## Card: User Documentation

When writing user-facing documentation (docs/guides/):

### Approach

- Start with what users want to accomplish
- Provide clear, actionable steps
- Include complete code examples that work
- Test every example in a fresh environment

### Structure

```markdown
# [Feature Name]

What this feature helps you accomplish.

## Quick start

Minimal working example with explanation.

## How it works

Conceptual overview with practical context.

## Examples

Real-world scenarios with complete code.

## API reference

Detailed parameter documentation.
```

## Card: API Documentation

When documenting APIs and code interfaces:

### Approach

- Document every public method and parameter
- Include type information and defaults
- Show both basic and advanced usage
- Explain error conditions and edge cases

### Format

````typescript
/**
 * Brief description of what the method does.
 *
 * @param paramName - What this parameter controls
 * @returns What the method returns and when
 * @throws When this method throws errors
 *
 * @example
 * ```typescript
 * const result = await method(param);
 * ```
 */
````

## Card: Internal Technical Documentation

When writing for builders (memos/guides/):

### Approach

- Explain the "why" behind technical decisions
- Document system architecture and patterns
- Include debugging tips and gotchas
- Reference relevant code locations

### Technical details

- Reference existing code: `apps/bfDb/classes/BfNode.ts:45`
- Create minimal working examples
- Test examples when possible
- Keep documentation accurate and up-to-date

## Card: README Files

When creating README files for projects or packages:

### Structure

```markdown
# Project Name

One-line description of what this does.

## Installation

Simple install command.

## Quick start

Minimal example that works immediately.

## Documentation

Links to detailed docs.

## Contributing

How to contribute (link to guides).
```

### Principles

- Get users to success in under 30 seconds
- First example should be copy-pasteable
- Link to detailed docs rather than duplicating

## Card: Migration Guides

When documenting breaking changes or migrations:

### Approach

- Start with what changed and why
- Provide clear before/after examples
- Include automated migration steps if available
- List all breaking changes explicitly

### Structure

````markdown
# Migrating from X to Y

## What changed

Brief explanation of the change.

## Migration steps

1. Update dependencies
2. Run migration command (if available)
3. Manual changes needed

## Breaking changes

- Old: `oldMethod()`
- New: `newMethod()`
- Why: Explanation

## Examples

Before:

```code
// old code
```
````

After:

```code
// new code
```

```
## Using This Deck

1. Identify what type of documentation you're writing
2. Find the matching card above
3. Follow the approach and structure provided
4. Always reference writing-style.card.md for formatting rules
5. Check technical-voice.card.md for tone guidelines
```
