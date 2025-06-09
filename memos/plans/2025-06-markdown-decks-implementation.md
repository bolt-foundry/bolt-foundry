# Markdown decks implementation plan

## Overview

This plan outlines the transition from TypeScript-based deck creation to a
Markdown-based system that lets anyone write prompts. The goal is to make deck
creation as simple as writing an email. The decks will work exactly like they do
today, just written in Markdown instead of TypeScript.

## Technical approach

The system will use standard Markdown AST parsing to extract deck structure:

- H1 headers are ignored and for reference only
- Paragraph text becomes "lead" data type (flow control, not data)
- H2 headings (`##`) start new parent cards
- Each subsequent nested heading level (H3, H4, etc.) creates a nested card
- Bullet points under headers define specs
- All reference links should use postscript style (footnotes)
- Regular markdown links `[text](url)` or `[text][ref]` are "zoom in" links -
  not traversed, but serve as useful context for assistants and humans who may
  be editing the deck

File references work differently for containers vs elements:

- **Embeds** `![description for people](pathToEmbed)` hoist content into parent
  context
- **Card embeds** `![card description](./card.md#specific-card)` embed specific
  cards using hash fragments
- **Hierarchical references** use dot syntax: `#parent.child.grandchild`
- **Footnotes** `[^ref]` attach to current element (specs, headings, embeds)
- **Regular links** `[text](url)` have their targets stripped, leaving just the
  text
- Embeds can have footnotes: `![card description](./card.md) [^usage-example]`
- Footnotes can resolve to `![sample description](file.toml#id)` or
  `![context description](file.toml#id)` embeds
- Footnotes can also be plain text for reference
- TOML files use `[samples.id]` or `[contexts.id]` format

Card reference examples:

- Simple: `#review-process` (when unique in file)
- Hierarchical: `#review-process.deep-review` (for nested cards)
- Cross-file: `./code-review.md#assistant-persona.communication-style`
- TOML alignment: mirrors TOML's `contexts.videoUrl` and
  `samples.good-timestamps`

ID resolution example:

```markdown
## Overview <!-- #overview -->

### Setup <!-- #overview.setup -->

## Features <!-- #features -->

### Overview <!-- #features.overview -->
```

- `#overview` → resolves to the parent card (topmost match)
- `#features.overview` → unambiguous reference to the nested card
- Creating another `## Overview` would throw an error

Special Markdown elements:

**Callouts** (GitHub-style admonitions):

- Syntax: `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`,
  `> [!CAUTION]`
- Callouts are included in LLM prompts with their type preserved
- Example:
  ```markdown
  > [!WARNING]
  > Never share API keys or credentials in code reviews
  ```

**Tables** (for organizing information and samples):

- Tables are preserved in LLM prompts for context
- Can embed samples via footnotes: `Sample [^table-sample]`
- Samples in tables are NOT available to graders for calibration
- Use for reference data, comparison charts, or structured information
- Example:
  ```markdown
  | Language   | Use Case   | Review Focus                |
  | ---------- | ---------- | --------------------------- |
  | Python     | Backend    | Type hints [^python-sample] |
  | TypeScript | Full-stack | Strict mode                 |
  ```

**Elements stripped from LLM prompts:**

- Horizontal rules (`---`)
- HTML comments (`<!-- comment -->`)
- Raw HTML tags
- Preserved in source for documentation purposes
- Validation warns about unsupported elements in development

TOML files can contain both contexts and samples:

```toml
# video-summarizer.toml
[contexts.userMessage]
type = "string"
question = "What was the user's original message?"
description = "The original message from the user to be evaluated"
example = "Can you summarize this 2-hour podcast about AI?"

[contexts.maxTokens]
type = "number"
question = "What's the maximum number of tokens for the response?"
default = 500
description = "Maximum length of the generated response"
example = 1000

[samples.unclear-audio]
userMessage = "Summarize this video with unclear audio"
assistantResponse = "I couldn't make out parts of the audio clearly"
score = -2
description = "Acknowledges audio quality issues"

[samples.good-transcription]
userMessage = "Transcribe the speakers in this podcast"
assistantResponse = "Speaker 1: Welcome to the show...\nSpeaker 2: Thanks for having me..."
score = 3
description = "Accurately identifies and transcribes multiple speakers"
```

- Text in embedding brackets `![description for people]` is for readability
  only, doesn't affect parsing
- Without fragment: `![helpful description](./file.toml)` embeds the entire TOML
  file
- With fragment: `![specific context](./file.toml#id)` ensures that specific
  item is embedded
- Other items from the same file may be included if referenced elsewhere
- Use `[contexts.id]` for context variables and `[samples.id]` for samples
- Each ID must be unique within its category

Heading ID generation and uniqueness:

- Convert to lowercase, replace spaces with hyphens, remove special characters
- Build hierarchical IDs using dot notation for nested cards
- Example: `## Review Process` → `#review-process`
- Example: `### Deep Review` under `## Review Process` →
  `#review-process.deep-review`
- **Duplicate IDs at the same hierarchy level will throw an error**
- **When the same ID exists at different levels**, simple references (e.g.,
  `#overview`) will resolve to the **topmost matching ID**
- The parser will prevent creating multiple matching IDs and provide clear error
  messages
- Use hierarchical dot syntax to reference nested cards unambiguously

The renderer will:

- Recursively crawl all embeds to assemble the complete deck
- Preserve ordering (order matters for prompt construction)
- Build prompts following the same patterns as current TypeScript builders
- Validate heading uniqueness within each hierarchy level
- Generate appropriate IDs with dot syntax for nested structures
