# Documentation Cleanup for Go-to-Market

_Plan created: 2025-06-18_

## Context & Goal

We're preparing aibff for go-to-market targeting individual developers. The user
journey is: **Blog post → Repl/fork → `aibff calibrate` → Success with grader
results**

The main README and docs/ directory currently contain mixed messaging that could
confuse new users. This plan addresses cleaning up the documentation to support
a clear, focused first impression.

## Current State Analysis

### Main README.md Issues

- **Conflicting concepts**: Mixes "decks/cards" terminology with "graders"
  terminology
- **Multiple explanations**: Has both TypeScript SDK examples AND CLI tool
  examples
- **Broken links**: References to `/404.md` and missing files
- **Mixed audiences**: Tries to serve both SDK users and CLI users
  simultaneously

### docs/ Directory Issues

- **Fragmented getting started**: Multiple overlapping guides
  (getting-started.md, quickstart.md)
- **SDK-focused content**: Most guides assume TypeScript SDK usage, not CLI
  usage
- **Broken navigation**: Many 404 links and circular references
- **Internal vs external confusion**: Mix of internal vision docs with
  user-facing guides

### Key Problems for Individual Developers

1. **Unclear value proposition**: What problem does aibff actually solve?
2. **Confusing first steps**: Multiple paths, unclear which to follow
3. **Terminology overload**: Cards, decks, graders, specs, samples - too much at
   once
4. **Missing CLI focus**: Most docs assume SDK usage, but target audience uses
   CLI

## Recommended Changes

### 1. Main README.md Overhaul

**KEEP:**

- Core value proposition about AI reliability
- The -3 to +3 scoring system explanation
- Contact information

**REMOVE:**

- TypeScript SDK examples (move to separate SDK docs)
- Conflicting terminology mixing
- Broken link references
- Complex deck system explanation in main README

**RESTRUCTURE TO:**

```markdown
# aibff - AI Reliability Through Graders

Simple tagline: "Make your AI outputs reliable and testable"

## The Problem

[Brief: AI outputs are inconsistent, hard to test]

## The Solution

[Brief: Graders + calibrate command = reliable results]

## Quick Start

1. Download aibff
2. Try the fastpitch example
3. Run aibff calibrate
4. See your reliability report

## What are graders?

[Simple explanation with one concrete example]

## Next Steps

[Links to 2-3 essential resources only]
```

### 2. docs/ Directory Cleanup

**ARCHIVE/MOVE TO MEMOS:**

- `docs/guides/company-vision.md` → Already in `memos/guides/`
- `docs/guides/big-picture-strategy.md` → Already in `memos/guides/`
- `docs/guides/improving-inference-philosophy.md` → Move to `memos/guides/`
- `docs/guides/wut.md` → Move to `memos/guides/` (internal culture doc)

**CONSOLIDATE:**

- Merge `getting-started.md` + `quickstart.md` → Single
  `docs/getting-started.md`
- Remove duplicate `README.md` in docs/guides/

**FOCUS ON CLI USER JOURNEY:**

- Rewrite all guides for CLI usage (not SDK)
- Clear progression: Install → Example → Calibrate → Understand Results
- Remove TypeScript code examples from main user docs

### 3. New Structure Proposal

```
docs/
├── getting-started.md          # Single, clear path for CLI users
├── graders-guide.md           # Deep dive on creating graders  
├── calibrate-guide.md         # Understanding calibrate results
└── examples/                  # Concrete examples only
    ├── fastpitch/            # Blog post example
    └── customer-support/     # Second example
```

**Remove entirely:**

- `docs/blog/` (move to separate blog repository)
- `docs/guides/evals-overview.md` (too technical for target audience)
- `docs/guides/deck-system.md` (move to memos - internal concept)

### 4. Terminology Simplification

**For external docs, use consistent language:**

- "Graders" (not "decks" or "cards" in user-facing docs)
- "Examples" (not "samples" - more familiar to developers)
- "Reliability" (not "inference-time control")

**Internal/memos can keep full terminology**

### 5. Fastpitch Integration

Ensure the fastpitch example in `decks/fastpitch/` is:

- Referenced clearly in main README
- Has simple setup instructions
- Works with `aibff calibrate` command
- Produces clear, understandable output

## Implementation Priority

**P0 (Do First):**

1. Rewrite main README.md with clear CLI focus
2. Create single docs/getting-started.md guide
3. Test fastpitch example works end-to-end

**P1 (Next):**

1. Move internal docs to memos/
2. Create docs/calibrate-guide.md
3. Fix all broken links

**P2 (Later):**

1. Create docs/graders-guide.md
2. Clean up examples directory
3. Archive blog posts

## Success Metrics

**We'll know this worked when:**

- A developer can go from README to successful `aibff calibrate` in <10 minutes
- Main README explains the core value prop in first 30 seconds of reading
- No broken links or 404s in main user journey
- Clear separation between user docs (docs/) and internal docs (memos/)

## Questions for Review

1. Should we completely remove TypeScript SDK examples from main README?
2. Do we want to keep any of the current docs/guides/ content?
3. Should fastpitch example be promoted to main examples directory?
4. Any specific messaging/tone preferences for the rewritten README?

---

**Next Steps:** Get approval on this plan, then execute in priority order.
