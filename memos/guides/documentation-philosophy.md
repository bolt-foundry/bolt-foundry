# Documentation Philosophy

This document describes how we organize documentation at Bolt Foundry. We
maintain three distinct categories of documentation, each serving a different
purpose and audience.

## Core Structure

### content/

What users read - how to use our products. This is public-facing documentation.

- **`content/docs/`** - Evergreen user documentation (getting started, API
  references, guides)
- **`content/blog/`** - Dated posts about features, updates, and announcements

### memos/

What builders read - how to build our products. This is for people working on
Bolt Foundry.

- **`memos/guides/`** - Evergreen builder documentation (architecture, patterns,
  philosophy)
- **`memos/plans/`** - Dated implementation plans (prefixed with YYYY-MM format)

### decks/

Scripts for humans and agents - structured behaviors and specifications. These
are both documentation and product, implementing the Bolt Foundry concept
itself.

- **`decks/`** - Collections that guide you to the right card for a situation
- **`decks/cards/`** - Individual specifications and behavioral patterns

## Key Principles

### Users vs Builders

We explicitly distinguish between documentation for people who _use_ our
products (content) and people who _build_ our products (memos). This removes
ambiguity about audience and purpose.

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
`content/docs/` - It teaches users how to use our product.

**Where does a new feature implementation plan go?**\
`memos/plans/2025-06-new-auth-system.md` - It's a dated plan for builders.

**Where does our coding style guide go?**\
`memos/guides/` - It's evergreen guidance for builders.

**Where does a new workflow specification go?**\
`decks/cards/` - It's a structured behavior pattern.

## Naming Conventions

- **Plans** use date prefixes: `YYYY-MM-description.md`
- **Blog posts** use date prefixes: `YYYY-MM-DD-title.md`
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

The split between content and memos isn't about secrecy - it's about context.
Users need to know what a product does and how to use it. Builders need to know
why decisions were made and how systems interconnect. Mixing these contexts
creates noise for both audiences.

By treating some documents as evergreen and others as explicitly dated, we
acknowledge that documentation serves two purposes: capturing the current state
of our thinking (plans, blogs) and distilling hard-won knowledge into reusable
patterns (guides, docs). Both are valuable, but conflating them leads to stale
"current" docs and lost historical context.

This structure is itself a deck - a map that helps both humans and AI agents
find the right card (document) for their current situation.
