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
- Any non-H1 heading starts a new card
- Bullet points under headers define specs
- All reference links should use postscript style (footnotes)
- Regular markdown links `[text](url)` or `[text][ref]` are "zoom in" links -
  not traversed, but serve as useful context for assistants and humans who may
  be editing the deck

File references work differently for containers vs elements:

- **Embeds** `![description for people](pathToEmbed)` hoist content into parent
  context
- **Footnotes** `[^ref]` attach to current element (specs, headings, embeds)
- **Regular links** `[text](url)` have their targets stripped, leaving just the
  text
- Embeds can have footnotes: `![card description](./card.md) [^usage-example]`
- Footnotes can resolve to `![sample description](file.toml#id)` or
  `![context description](file.toml#id)` embeds
- Footnotes can also be plain text for reference
- TOML files use `[samples.id]` or `[context.id]` format

Unclear Markdown elements are stripped from LLM prompts:

- Tables, horizontal rules, blockquotes, code blocks → removed from output
- Preserved in source for documentation purposes
- Validation warns about non-standard elements in development

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

The renderer will:

- Recursively crawl all embeds to assemble the complete deck
- Preserve ordering (order matters for prompt construction)
- Build prompts following the same patterns as current TypeScript builders
