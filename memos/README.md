# Documentation Structure

This document outlines Bolt Foundry's three-tier documentation approach.

## Documentation Tiers

### 1. Public-Focused (`/docs`)

**Purpose**: External users understanding what we do and how to use our
products\
**Location**: `/docs` folder in the monorepo\
**Audience**: Mixed (developers, business users, potential customers)\
**Content**:

- Product overviews and value propositions
- Getting started guides
- API reference (auto-generated)
- Examples and tutorials
- Public changelog
- Use cases and case studies

**Key Principle**: Clear, polished, user-focused content that helps people
succeed with our products.

### 2. Internal-Focused (`/memos`)

**Purpose**: Team understanding and collaboration on non-confidential topics\
**Location**: `/memos` folder in the monorepo\
**Audience**: Bolt Foundry team members and contributors\
**Organization**: PARA Method

- **Projects** - Active initiatives with deadlines
- **Areas** - Ongoing responsibilities to maintain
- **Resources** - Reference materials for the future
- **Archive** - Inactive items from the other categories

**Content**:

- Technical design decisions
- Architecture discussions
- Development processes
- Company vision and philosophy
- Team workflows
- Implementation guides
- Post-mortems and learnings

**Key Principle**: Working documents that help the team build better products.
Can be rougher/more technical than public docs.

### 3. Internal-Only / Confidential (`@internalbf-docs`)

**Purpose**: Sensitive information that should not be in the public monorepo\
**Location**: `/@internalbf-docs/` workspace (access controlled)\
**Audience**: Bolt Foundry team only\
**Organization**: PARA Method

- **Projects** - Active confidential initiatives
- **Areas** - Ongoing private responsibilities
- **Resources** - Sensitive reference materials
- **Archive** - Inactive confidential items

**Content**:

- Financial information (revenue, pricing, projections)
- Customer names, contracts, and usage data
- Employee compensation and performance reviews
- Legal agreements and contracts
- Investor communications
- Competitive intelligence with confidential data

**Key Principle**: Information containing personal data, financial numbers, or
legal obligations.

## Guidelines

### When to use `/docs`:

- You're explaining how to use a feature
- You're writing for external users
- The content helps users succeed
- You want the content to appear in documentation sites

### When to use `/memos`:

- You're documenting a technical decision
- You're explaining internal architecture
- You're sharing learnings with the team
- The content helps developers contribute
- You're documenting company vision or philosophy
- You're creating team processes or workflows

### When to use `@internalbf-docs`:

- The content contains real customer names or data
- The information includes financial numbers
- You're documenting employee-specific information
- The content has legal implications
- You're storing contracts or agreements

## Writing Style

- **Docs**: Professional, clear, user-focused. Think "documentation you'd be
  proud to show customers."
- **Memos**: Direct, technical, team-focused. Think "explaining to a colleague."
- **Private**: Candid, strategic, confidential. Think "internal strategy
  meeting."

## Maintenance

- All public docs should be reviewed before major releases
- Memos can be updated by anyone on the team
- `@internalbf-docs` requires appropriate access permissions

## PARA Method Structure

Both `/memos` and `@internalbf-docs` follow the PARA method:

- **Projects**: Outcomes you're actively working toward (with deadlines)
- **Areas**: Ongoing responsibilities to maintain (no end date)
- **Resources**: Topics of ongoing interest for reference
- **Archive**: Inactive items from the other three categories

This creates a consistent organizational system across all internal
documentation.

Remember: When in doubt about where something belongs, ask yourself:

- Does it contain names, numbers, or legal obligations? → `@internalbf-docs`
- Is it vision, philosophy, or technical discussion? → `/memos`
- Is it user-facing documentation? → `/docs`
