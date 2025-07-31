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
**Content**:

- Technical design decisions
- Architecture discussions
- Development processes
- Non-sensitive roadmaps
- Team workflows
- Implementation guides
- Post-mortems and learnings

**Key Principle**: Working documents that help the team build better products.
Can be rougher/more technical than public docs.

### 3. Internal-Only / Confidential (separate private repository)

**Purpose**: Sensitive information that should not be in the public monorepo\
**Location**: Private repository (access controlled)\
**Audience**: Bolt Foundry team only\
**Content**:

- Company vision and strategy
- Financial information
- Customer details and contracts
- Sprint planning and internal roadmaps
- Team meeting notes
- Experimental research
- Business metrics
- Hiring plans

**Key Principle**: Information that gives us competitive advantage or contains
private data.

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

### When to use the private repo:

- The content contains customer names or data
- You're discussing business strategy
- The information is financially sensitive
- You're planning future competitive moves
- The content includes private metrics

## Writing Style

- **Docs**: Professional, clear, user-focused. Think "documentation you'd be
  proud to show customers."
- **Memos**: Direct, technical, team-focused. Think "explaining to a colleague."
- **Private**: Candid, strategic, confidential. Think "internal strategy
  meeting."

## Maintenance

- All public docs should be reviewed before major releases
- Memos can be updated by anyone on the team
- Private repo requires appropriate access permissions

Remember: When in doubt about where something belongs, consider who needs to see
it and whether it could help or harm us if made public.
