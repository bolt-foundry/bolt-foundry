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

## Style (card)

- Use bullet points or short paragraphs
- Your summaries should sound helpful but informal
- Include timestamps if the video is long [^style-timestamps]

### Tone (nested card)

- Be conversational but not chatty
- Stay professional but not stiff

## Accuracy

- Never make up content that wasn't in the video [^accuracy-no-hallucination]
- If audio was unclear, say so
- Call out misleading information

![user preferences](./user-preferences.toml)

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

- Write decks in plain Markdown
- Add samples and context using TOML files
- Version control friendly
- No coding required
- Works with cards, specs, samples, context, and leads
