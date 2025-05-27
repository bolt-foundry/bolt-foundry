# The Bolt Foundry Card System

## Overview

The Bolt Foundry Card System transforms prompt engineering from brittle text strings into structured, composable specifications. Like trading cards, each card has well-defined attributes, clear rules for combination, and can be collected, shared, and traded across teams.

## Core Concepts

### What is a Card?

A **card** is a collection of structured specifications that define a particular aspect of LLM behavior. Cards are:
- **Semantic**: Each card has clear meaning and purpose
- **Composable**: Cards can be combined to create complex behaviors
- **Testable**: Individual cards can be validated in isolation
- **Versionable**: Cards can evolve without breaking existing combinations
- **Shareable**: Cards can be published and reused across projects

### Types of Cards

#### Persona Cards (.psc)
**Persona Spec Cards** define who the LLM should be:
- **Traits**: Personality characteristics and behavioral tendencies
- **Constraints**: Boundaries and limitations on responses
- **Voice**: Tone, style, and communication patterns
- **Knowledge**: Domain expertise and background

Example structure:
```markdown
# Assistant Persona Card

## Description
You are a helpful, professional assistant focused on clear communication.

## Traits
- Patient and understanding
- Detail-oriented
- Proactive in offering solutions

## Constraints
- Never discuss pricing without authorization
- Maintain professional boundaries
- Respect user privacy

## Voice
- Clear and concise
- Second person perspective
- Active voice preferred
```

#### Behavior Cards (.bhc)
**Behavior Cards** define what the LLM should do:
- **Goals**: What the behavior aims to achieve
- **Steps**: Sequential actions to accomplish the goal
- **Formats**: Expected output structure
- **References**: External resources or documentation

Example structure:
```markdown
# Code Review Behavior Card

## Goal
Provide comprehensive, constructive code reviews that improve code quality.

## Steps
1. Analyze code structure and patterns
2. Identify potential bugs or issues
3. Suggest improvements for readability
4. Check for security vulnerabilities
5. Provide specific, actionable feedback

## Format
- Use markdown with clear sections
- Include code examples for suggestions
- Prioritize issues by severity

## References
- Team style guide: /docs/style-guide.md
- Security checklist: /docs/security.md
```

### Card Composition

Cards combine through a fluent builder API:

```typescript
const assistant = new LLMBuilder()
  .personaCard("helpful-assistant")
  .behaviorCard("code-reviewer")
  .behaviorCard("test-writer")
  .context({ language: "TypeScript" })
  .build();
```

### Card Packs

Related cards can be grouped into packs for specific domains:
- **Engineering Pack**: Code review, debugging, architecture design
- **Writing Pack**: Copy editing, content creation, SEO optimization
- **Analysis Pack**: Data interpretation, report generation, insights

## Implementation

### Card Storage

Cards are stored as markdown files with structured frontmatter:
```yaml
---
type: persona
version: 1.0.0
tags: [assistant, professional, technical]
compatibility: [gpt-4, claude-3]
---
```

### Card Naming Convention

- **Persona Cards**: `{name}.psc.md` (Persona Spec Card)
- **Behavior Cards**: `{name}.bhc.md` (Behavior Card)
- **Card Packs**: `{domain}-pack/` directory structure

### Card Discovery

Cards can be discovered through:
1. **Local Registry**: Project-specific cards in `/cards` directory
2. **Shared Registry**: Organization-wide card repository
3. **Public Registry**: Community-contributed cards (future)

## Benefits

### For Developers
- **Consistency**: Same card produces reliable behavior
- **Reusability**: Build once, use everywhere
- **Testing**: Validate cards independently
- **Debugging**: Isolate issues to specific cards

### For Teams
- **Knowledge Sharing**: Codify best practices in cards
- **Onboarding**: New developers inherit proven patterns
- **Governance**: Control and audit LLM behaviors
- **Evolution**: Improve cards without breaking systems

### For Organizations
- **Standardization**: Consistent AI behavior across products
- **Compliance**: Ensure AI follows company policies
- **Efficiency**: Reduce duplicate prompt engineering
- **Innovation**: Build on proven foundations

## Best Practices

1. **Start Specific**: Create focused cards for single responsibilities
2. **Document Well**: Clear descriptions help others understand usage
3. **Version Carefully**: Use semantic versioning for breaking changes
4. **Test Thoroughly**: Validate cards with comprehensive test suites
5. **Share Generously**: Contribute useful cards back to the community

## Future Vision

The card system will evolve to support:
- **Card Marketplace**: Trade and sell premium card packs
- **Card Analytics**: Track performance and usage metrics
- **Card Optimization**: AI-powered improvements to existing cards
- **Card Certification**: Verified cards for regulated industries
- **Card Ecosystems**: Domain-specific card communities

## Getting Started

1. Review existing cards in `/cards` directory
2. Use the card builder API in your code
3. Create custom cards for your specific needs
4. Share successful patterns with your team
5. Contribute improvements back to the system

The card system transforms prompt engineering from an art into a science, making LLM applications as reliable and maintainable as traditional software.