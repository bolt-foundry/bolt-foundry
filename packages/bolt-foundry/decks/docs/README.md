# Markdown decks - development documentation

## What are we building?

We're creating a new way to write Bolt Foundry decks using Markdown instead of
TypeScript. This shift moves deck creation from code to text, making it
accessible to everyone - not just developers. Think of it like switching from
writing HTML to using Markdown for documentation. The decks will still do
everything they do today. They'll define LLM behaviors, include samples, and
inject context, but now anyone can write them as easily as typing an email.

The system parses Markdown files with a specific structure:

- H1 headers are ignored (reference only)
- Paragraphs become leads (flow control)
- H2 headers (`##`) create parent cards
- H3, H4, etc. headers create nested cards under their parent
- Bullet points become specs
- Embeds (`![description](path)`) hoist content into parent
- Card embeds (`![card](file.md#card-id)`) embed specific cards via hash
  fragments
- Hierarchical references use dot syntax: `#parent.child.grandchild`
- Footnotes attach samples/context to elements
- Regular markdown links become plain text (targets stripped)
- Callouts (`> [!NOTE]`, `> [!WARNING]`, etc.) are preserved in prompts
- Tables are preserved for context, can embed samples via footnotes
- Samples in tables are NOT available to graders for calibration
- Code blocks and horizontal rules are stripped from LLM prompts
- Order matters and is preserved

Card reference examples:

- Simple: `#review-process` (when unique in file)
- Hierarchical: `#assistant-persona.communication-style`
- Cross-file: `./other-deck.md#tools.languages`
- TOML integration: mirrors `contexts.videoUrl` and `samples.good-timestamps`

For complete technical details, see the
[implementation plan](/memos/plans/2025-06-markdown-decks-implementation.md).

## Why do we need to build it?

Right now, creating a deck requires writing TypeScript code with builders,
imports, and specific API knowledge. This creates several problems:

1. **Barrier to entry** - Product managers, designers, and domain experts can't
   easily create or modify decks
2. **Slow iteration** - Every change requires a developer, creating bottlenecks
3. **Hard to reason about** - The code structure obscures the actual prompt
   content
4. **Limited collaboration** - Code reviews aren't the best medium for
   discussing LLM behaviors

By moving to Markdown, we let anyone create and edit prompts, not just
developers. Teams can iterate on decks in real-time, see exactly what will be
sent to the LLM, and focus on the content rather than the code structure.

## Status

| Task                   | Status      | Description                                             |
| ---------------------- | ----------- | ------------------------------------------------------- |
| Project structure      | Complete    | Created initial directories and documentation           |
| Markdown format design | Complete    | Defined how decks look in Markdown with samples/context |
| TOML format design     | Complete    | Defined structure for variables and samples             |
| Parser implementation  | Not started | Need to build Markdown AST parser                       |
| Migration strategy     | Not started | How to convert existing TypeScript decks                |

## Future work

| Task            | Description                                         |
| --------------- | --------------------------------------------------- |
| Markdown parser | Parses deck structure from Markdown AST             |
| TOML parser     | Parses samples and context from TOML files          |
| Prompt renderer | Converts parsed deck to LLM prompt                  |
| Migration tool  | Converts TypeScript decks to Markdown automatically |
| Editor tooling  | VS Code extension for deck authoring                |
| Validation      | Validates deck structure                            |

## Technical decisions

For complete technical details and decisions, see the
[implementation plan](/memos/plans/2025-06-markdown-decks-implementation.md).

Key decisions:

- Located in `packages/bolt-foundry/decks`
- Markdown for structure, TOML for data
- Embeds for containers, footnotes for elements
- Build-time parsing for performance
