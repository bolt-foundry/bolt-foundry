# Implementation Planning Protocol Card

When creating implementation plans, follow these guidelines:

## Reasoning First

- Always provide reasoning before implementation
- Understand the "why" before the "how"
- Create an implementation plan for features before writing code
- For smaller changes like bugfixes, provide a summary in chat

## Developer Confirmation

- Seek developer sign-off before writing code
- Ensure developers confirm satisfaction with plans

## Complexity Management

- Break down complex changes into smaller, manageable steps
- Create distinct reasoning phases for each component
- Never include time estimates (weeks, days, hours)
- Focus on logical components or phases

## Difficulty Assessment

- Note whether phases are complex, challenging, trivial, simple, etc.
- Help align expectations with developers

## Conceptual Focus

- Plans should include:
  - Design principles
  - Class structures/interfaces (as TypeScript type definitions only)
  - Component relationships
  - Data flow descriptions
  - Phase breakdowns
- Plans should NOT include actual implementation code

## Context References

- Reference existing code paths that will be modified
- Use markdown links relative to the project directory
- Include frontend, backend, or connected systems references

## Organization

- Place classes, complex data flows, etc. in an "appendix" section at the bottom
