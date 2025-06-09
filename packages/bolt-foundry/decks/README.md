# Markdown decks

A text-based deck system for Bolt Foundry. Write LLM behaviors in Markdown
instead of code.

## Quick start

Create a deck by writing a Markdown file:

```markdown
# YouTube Summarizer (ignored, reference only)

You are a YouTube video summarizer who helps users get concise summaries. You
adapt based on video length, title, and user preferences.

![video context](./video-data.toml)

## Style (parent card)

- Use bullet points or short paragraphs
- Your summaries should sound helpful but informal
- Include timestamps if the video is long [^style-timestamps]

### Tone (nested card under Style)

- Be conversational but not chatty
- Stay professional but not stiff

## Accuracy (another parent card)

- Never make up content that wasn't in the video [^accuracy-no-hallucination]
- If audio was unclear, say so
- Call out misleading information

![user preferences](./user-preferences.toml)

## Advanced features

### Card embedding

Embed specific cards using simple or hierarchical references:

![review process](./code-review.deck.md#review-process)
![assistant's communication style](./code-review.deck.md#assistant-persona.communication-style)
![deep review step](./code-review.deck.md#review-process.deep-review)

### Callouts for important information

> [!NOTE]
> Callouts help highlight important information in your decks

> [!TIP]
> Use timestamps for videos longer than 10 minutes

> [!WARNING]
> Never make up information that wasn't in the source material

### Tables for structured data

| Summary Type | When to Use     | Example                              |
| ------------ | --------------- | ------------------------------------ |
| Brief        | < 5 min videos  | "Key point: X explained Y"           |
| Standard     | 5-30 min videos | Bullet points with main ideas        |
| Detailed     | > 30 min videos | Timestamped sections [^table-format] |

[^table-format]: ![detailed format example](./video-data.toml#detailed-summary)

[^style-timestamps]: ![timestamp example](./video-data.toml#good-timestamps)

[^accuracy-no-hallucination]: ![bad example](./video-data.toml#bad-made-up)
```

With supporting TOML file:

```toml
# video-data.toml
[contexts.videoUrl]
type = "string"
question = "What's the YouTube video URL?"
description = "The URL of the video to summarize"
example = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

[contexts.videoLength]  
type = "number"
question = "How long is the video in minutes?"
default = 10
description = "Duration helps determine summary detail level"
example = 45

[samples.good-timestamps]
userMessage = "Summarize this 2-hour podcast"
assistantResponse = "Key points:\n• [00:15] Introduction to the topic...\n• [15:30] Main argument about..."
score = 3
description = "Includes helpful timestamps for long content"

[samples.bad-made-up]
userMessage = "What did they say about quantum computing?"
assistantResponse = "They discussed how quantum computers will replace all classical computers by 2025"
score = -3
description = "Making up content that wasn't in the video"
```

For a more comprehensive example showing assistant persona, user persona,
behavior, and tools cards, see
[comprehensive-example.deck.md](./comprehensive-example.deck.md).

## Documentation

See [docs/README.md](./docs/README.md) for development details.

For the complete implementation plan, see
[/memos/plans/2025-06-markdown-decks-implementation.md](/memos/plans/2025-06-markdown-decks-implementation.md).

## Features

- Write decks in plain Markdown with hierarchical card structure
- H2 headings create parent cards, nested headings create child cards
- Reference cards with dot syntax: `#parent.child.grandchild`
- Embed specific cards from other decks: `![card](./file.md#parent.child)`
- GitHub-style callouts for important information (`> [!NOTE]`, `> [!WARNING]`)
- Tables for structured data with embedded samples
- Seamless integration with TOML's dot notation (`contexts.id`, `samples.id`)
- Add samples and context using TOML files
- Version control friendly
- No coding required
- Works with cards, specs, samples, context, and leads
