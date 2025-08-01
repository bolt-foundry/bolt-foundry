# Documentation Philosophy

This document describes how we organize documentation at Bolt Foundry. We
maintain four distinct categories of documentation, each serving a different
purpose and audience.

## Core Structure

### decks/

Scripts for humans and AI - structured behaviors and specifications. These are
both documentation and product, implementing the Bolt Foundry concept itself.

- **`decks/`** - Collections that guide you to the right card for a situation
- **`decks/cards/`** - Individual specifications and behavioral patterns

### docs/

What users read - how to use our products. This is public-facing documentation.

- **`docs/guides/`** - Evergreen user documentation (getting started, API
  references, guides)
- **`docs/blog/`** - Dated posts about features, updates, and announcements

### memos/

What builders read - how to build our products. This is for people working on
Bolt Foundry.

- **`memos/guides/`** - Evergreen builder documentation (architecture, patterns,
  philosophy)
- **`memos/plans/`** - Dated implementation plans (prefixed with YYYY-MM format)

### internal/

What the team shares - our internal knowledge base. This is a git submodule
pointing to a private GitHub repository that only specific team members have
access to, analogous to Facebook Workplace.

- **`internal/guides/`** - Evergreen internal documentation (onboarding,
  policies, processes)
- **`internal/plans/`** - Dated strategic plans and decisions (prefixed with
  YYYY-MM format)
- **`internal/blog/`** - Dated internal updates and announcements

## Key Principles

### Users vs Team vs Builders

We explicitly distinguish between documentation for people who _use_ our
products (docs), people who _work at_ our company (internal), and people who
_build_ our products (memos). This removes ambiguity about audience and purpose.

### Evergreen vs Dated

Within each category, we separate timeless documentation from temporal
documentation:

- Guides and docs are maintained as living documents
- Plans and blogs are snapshots in time, prefixed with dates

### READMEs

Every folder contains a README.md that helps navigate to relevant documents.
These aren't comprehensive indexes, but friendly guides pointing to the most
important information.

## Examples

**Where does an API tutorial go?**\
`docs/guides/` - It teaches users how to use our product.

**Where does a new feature implementation plan go?**\
`memos/plans/2025-06-new-auth-system.md` - It's a dated plan for builders.

**Where does our coding style guide go?**\
`memos/guides/` - It's evergreen guidance for builders.

**Where does a new workflow specification go?**\
`decks/cards/` - It's a structured behavior pattern.

**Where does our company strategy go?**\
`internal/plans/2025-06-growth-strategy.md` - It's a dated strategic plan for
the team.

**Where does our employee handbook go?**\
`internal/guides/` - It's evergreen documentation for team members.

## Naming Conventions

- **Plans** use date prefixes: `YYYY-MM-description.md`
- **Blog posts** use date prefixes: `YYYY-MM-title.md` or `YYYY-MM-DD-title.md`
  (whichever works better)
- **Cards** use the `.card.md` suffix
- **Decks** use the `.deck.md` suffix
- All other documents use simple, descriptive names

## Philosophy

Documentation is a first-class product at Bolt Foundry. Just as our deck/card
system brings structure to prompt engineering, this documentation system brings
structure to our team and product. Nobody (AI or human, customer or team member)
should be confused about what we're working on. Creating a clear structure helps
us keep everyone's attention focused on understanding what they need to know to
work with us.

The split between docs, internal, and memos isn't about secrecy - it's about
context. Users need to know what a product does and how to use it. Team members
need to understand company direction and policies. Builders need to know why
technical decisions were made and how systems interconnect. Mixing these
contexts creates noise for all audiences.

By treating some documents as evergreen and others as explicitly dated, we
acknowledge that documentation serves two purposes: capturing the current state
of our thinking (plans, blogs) and distilling hard-won knowledge into reusable
patterns (guides, docs). Both are valuable, but conflating them leads to stale
"current" docs and lost historical context.

This structure is itself is a type of deck - a map that helps both humans and AI
find the right card (document) for their current situation.
