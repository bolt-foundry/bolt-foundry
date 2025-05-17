# Bolt Foundry Behavior Cards

## What Are Behavior Cards?

Behavior Cards are structured documents that define actionable workflows,
protocols, and best practices for building LLM systems. While Persona Cards
describe what a component is, Behavior Cards describe how to implement
functionality effectively.

## Purpose of Behavior Cards

Behavior Cards serve several key purposes in the Bolt Foundry system:

1. **Standardize Workflows**: Establish consistent patterns for development
   activities
2. **Codify Best Practices**: Document proven approaches for common tasks
3. **Guide Implementation**: Provide step-by-step guidance for developers
4. **Ensure Quality**: Maintain high standards through structured processes
5. **Improve Collaboration**: Create shared understanding of development
   procedures

## Behavior Card Structure

Each Behavior Card follows a consistent format:

- **Title**: Descriptive name of the protocol or workflow
- **Purpose Statement**: Brief explanation of the card's objective
- **Sections**: Organized guidelines related to specific aspects of the process
- **Examples**: Where applicable, concrete examples of the protocol in action

## Types of Behavior Cards

Bolt Foundry includes several types of Behavior Cards:

### Implementation Planning Protocol Card

Guides the process of planning feature implementations with a "reasoning first"
approach.

### Test-Driven Development Protocol Card

Outlines the TDD workflow specific to LLM components, with a focus on defining
behavior through tests.

### Coding Protocol Card

Establishes coding standards, patterns, and best practices for the codebase.

### Project Planning Protocol Card

Provides a framework for planning projects with a user-centered approach.

## Using Behavior Cards

Behavior Cards should be referenced at the beginning of and throughout the
relevant development activities:

1. When planning new features, refer to the Implementation Planning Protocol
2. Before writing code, consult the Test-Driven Development Protocol
3. During development, follow the Coding Protocol standards
4. For project-level planning, use the Project Planning Protocol

## Creating New Behavior Cards

When establishing new workflows or best practices, consider creating a new
Behavior Card:

1. Create a new markdown file in the `cards/behaviors/` directory with the
   `.bhc.md` extension
2. Follow the established format for consistency
3. Focus on actionable guidance rather than theoretical explanations
4. Include specific examples where helpful
5. Keep guidance concise and practical

## Integration with Persona Cards

Behavior Cards complement Persona Cards in the Bolt Foundry system:

- **Persona Cards** define the "what" - the components, their purpose, and
  characteristics
- **Behavior Cards** define the "how" - the processes for implementing and
  working with components

Together, these card types provide a comprehensive framework for building
reliable LLM systems.
