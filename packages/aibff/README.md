# aibff - AI Best Friend

Create and refine graders for LLM evaluation with an interactive REPL.

## Installation

```bash
npm install -g aibff
```

This will automatically download the appropriate pre-built binary for your platform.

### Supported Platforms

- macOS (Apple Silicon)
- Linux (x64)

## Quick Start

```bash
# Start the interactive REPL
aibff repl

# Show available commands
aibff --help

# Show version information
aibff --version
```

## Commands

- **`repl`** - Start interactive grader creation session
- **`calibrate`** - Calibrate grader performance
- **`rebuild`** - Rebuild grader from source
- **`render`** - Render grader deck to various formats

## What is aibff?

aibff (AI Best Friend) is an interactive tool for creating and refining "graders" - evaluation criteria for LLM outputs. It helps you:

- Create graders through conversation
- Test graders against sample data
- Refine evaluation criteria iteratively
- Export graders in TOML format

## REPL Mode

The REPL (Read-Eval-Print Loop) is the primary way to interact with aibff:

```bash
aibff repl
```

In REPL mode, you can:
- Paste sample data for evaluation
- Discuss and refine grading criteria
- Generate grader configurations
- Test graders against new samples

## Environment Variables

- `OPENROUTER_API_KEY` - Required for LLM access via OpenRouter

## Documentation

For detailed documentation, see the [Bolt Foundry documentation](https://github.com/bolt-foundry/bolt-foundry).

## License

MIT License - see LICENSE file in the root repository.