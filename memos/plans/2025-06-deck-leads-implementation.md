# Implementation Plan: Deck Leads Feature

## Overview

Add support for "leads" - transitional text elements in decks that provide
context and flow. Leads are paragraph text that can appear:

- After deck headers (H1) to introduce the deck
- After card headers (H2/H3+) to explain the card's purpose
- Between cards for transitions
- After specs within a card (causing contextual "jump out")

## Goals

| Goal                     | Description                                                        | Success Criteria                                            |
| ------------------------ | ------------------------------------------------------------------ | ----------------------------------------------------------- |
| Add lead support         | Enable paragraph text to serve as transitional/explanatory content | Leads can be added via builder API and parsed from markdown |
| Maintain simplicity      | Keep leads as simple strings without complex formatting            | Lead = string, no nested structures                         |
| Position-based semantics | Lead meaning determined by position in deck structure              | Parser correctly identifies all lead positions              |
| Backward compatibility   | Existing decks continue to work without modification               | All current tests pass                                      |

## Anti-Goals

| Anti-Goal               | Reason                                         |
| ----------------------- | ---------------------------------------------- |
| Complex lead formatting | Keep initial implementation simple - just text |
| Nested leads            | Leads should not contain other deck elements   |
| Multiple lead types     | Position determines purpose, not type system   |

## Technical Approach

Leads will be implemented as optional string fields that can appear at various
positions in the deck structure. The markdown parser will identify paragraph
text in specific positions and convert them to leads. The builder API will
provide methods to add leads programmatically.

### Components

| Status | Component        | Purpose                                             |
| ------ | ---------------- | --------------------------------------------------- |
| [ ]    | Card type update | Add optional `lead` field to Card interface         |
| [ ]    | Builder methods  | Add `lead()` methods to DeckBuilder and CardBuilder |
| [ ]    | Render logic     | Update renderCards to output leads appropriately    |
| [ ]    | Markdown parser  | Recognize paragraphs as leads based on position     |
| [ ]    | Tests            | Ensure leads work correctly in all positions        |
| [ ]    | Documentation    | Explain lead concept and usage                      |

### Technical Decisions

| Decision                 | Reasoning                                  | Alternatives Considered                 |
| ------------------------ | ------------------------------------------ | --------------------------------------- |
| Leads as strings         | Simple to implement and understand         | Rich text format - too complex for v1   |
| Position-based detection | Natural mapping from markdown structure    | Explicit lead markers - less readable   |
| Single lead per position | Keeps data model clean                     | Array of leads - unnecessary complexity |
| Jump-out behavior        | Natural way to transition between contexts | Keep leads strictly hierarchical        |

### Implementation Details

1. **Data Structure**
   - Add `lead?: string` to Card type
   - Deck-level leads stored as special cards with only lead value

2. **Builder API**
   ```typescript
   // DeckBuilder
   lead(text: string): DeckBuilder

   // CardBuilder  
   lead(text: string): CardBuilder
   ```

3. **Markdown Parsing Rules**
   - Paragraph after H1 → deck introduction lead
   - Paragraph after H2/H3+ → card introduction lead
   - Paragraph between cards → transitional lead
   - Paragraph after specs → jump-out lead

4. **Rendering**
   - Leads render as plain text
   - Position determines output location
   - Jump-out leads render after card closing tag

## Next Steps

| Question                                           | How to Explore                                 |
| -------------------------------------------------- | ---------------------------------------------- |
| How to handle multiple consecutive paragraphs?     | Test with real deck examples                   |
| Should leads support basic markdown (bold, links)? | Gather user feedback after v1                  |
| Best way to represent deck-level leads?            | Prototype both special cards vs separate array |

## Example Usage

```markdown
# Technical Writer Deck

This lead introduces the entire deck, explaining its purpose and setting context
for what follows.

## Base Card: Technical Writer Role

This lead explains what this card is about before diving into the specific specs
below.

### Writing style

A nested card can also have an introductory lead.

- Write in active voice
- Use sentence casing

This lead after specs "jumps out" to provide a transition or additional context.

## Card: User Documentation

Another card with its own introduction...
```

## Testing Strategy

- Unit tests for all builder API methods with leads
- Parser tests for each lead position type
- Render tests verifying output structure
- Integration test with comprehensive example
- Edge cases: empty leads, special characters
