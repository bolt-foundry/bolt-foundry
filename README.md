# Bolt Foundry

We're building structured prompt engineering. Instead of text strings,
developers compose AI from decks of cards with examples and specs that make it
99% reliable.

## The Deck System

Our deck system brings structured engineering to LLM applications:

- **Graders**: Markdown-based evaluation frameworks that define and score AI
  behaviors
- **Decks**: Composable collections of cards that define specific AI behaviors
- **Cards**: Hierarchical specifications organized by category (persona,
  behavior, etc.)
- **Specs**: Clear, testable requirements that define precise AI capabilities
- **Samples**: Rated examples (-3 to +3) showing good and bad behaviors

## Getting Started with aibff

aibff (AI BFF) is our interactive tool for building and testing AI evaluation
graders. It provides:

- **Interactive REPL**: Build graders through conversation with immediate
  feedback
- **Evaluation Engine**: Run evaluations against your deck specifications
- **Grader Calibration**: Ensure graders score accurately and consistently
- **Multi-Model Testing**: Compare outputs across different LLMs

### Installation

Download the latest release for your platform:

- **[Download aibff releases →](https://github.com/content-foundry/content-foundry/releases?q=aibff&expanded=true)**

Extract and run:

```bash
# Linux/macOS
curl -L https://github.com/content-foundry/content-foundry/releases/download/aibff-vX.X.X/aibff-linux-x86_64.tar.gz | tar xz
./aibff --help

# Windows (PowerShell)
# Download the .zip file and extract aibff.exe
```

### Quick Start

```bash
# Set your API key
export OPENROUTER_API_KEY=your-api-key

# Launch interactive mode (recommended)
./aibff

# Or run an evaluation directly
./aibff eval grader.deck.md samples.jsonl
```

### Interactive Mode

The easiest way to get started is with the interactive REPL:

```bash
./aibff
```

This launches an interactive environment where you can:

- Create graders from examples
- Test and refine evaluation criteria
- Get immediate feedback on your graders
- Export production-ready code

## What are graders?

Graders are markdown-based evaluation frameworks that turn AI instructions into
testable specifications:

- **Evaluation criteria**: Define what behaviors to assess
- **Scoring guidelines**: Clear rubrics from -3 to +3
- **Sample embeddings**: Reference TOML files with scored examples
- **Composable structure**: Mix and match grader components

## Your First Grader

Create a markdown-based grader that evaluates AI responses:

```markdown
# Customer Support Grader

Evaluate customer support responses for empathy and helpfulness.

## Evaluation Criteria

- Response shows empathy and understanding
- Provides actionable solutions
- Maintains professional tone

## Scoring Guidelines

- Score 3: Perfect empathy with clear solution
- Score 2: Good response with minor improvements possible
- Score 1: Acceptable but lacks warmth or clarity
- Score -1: Somewhat dismissive or unclear
- Score -2: Unprofessional or unhelpful
- Score -3: Rude or completely fails to address issue

![samples](./support-grader.deck.toml#samples)
```

Then reference scored examples in your TOML file:

```toml
[samples.perfect-empathy]
input = "My package never arrived"
response = "I understand how frustrating that must be. Let me track your order right away."
score = 3

[samples.dismissive]
input = "My package never arrived"
response = "Check your tracking number."
score = -3
```

The scoring system (-3 to +3) helps achieve reliable outputs:

- **+3**: Excellent example of desired behavior
- **+2**: Good example
- **+1**: Acceptable
- **-1**: Mildly undesirable
- **-2**: Bad example
- **-3**: Completely wrong behavior

## Choosing Your Workflow

### Interactive REPL (Development)

Best for:

- Creating new graders from scratch
- Learning the deck system
- Rapid prototyping and iteration
- Getting immediate feedback

```bash
./aibff  # Launches interactive mode
```

### Command Line (Automation)

Best for:

- CI/CD pipelines
- Batch evaluation runs
- Automated testing
- Production workflows

```bash
./aibff eval grader.deck.md samples.jsonl
```

## Learn more

- **[REPL Usage Guide](apps/aibff/memos/guides/repl-usage.md)**: Interactive
  grader development
- **[Company vision](docs/guides/company-vision.md)**: Making LLMs 99% reliable
  through structured prompt engineering
- **[Deck system guide](memos/guides/deck-system.md)**: How graders and cards
  work together
- **[Evals overview](memos/guides/evals-overview.md)**: Complete evaluation
  framework documentation
- **[Inference philosophy](docs/guides/improving-inference-philosophy.md)**: Why
  inference-time control matters
- **[Team story](memos/guides/team-story.md)**: Who we are and why we're doing
  this

---

**Contact**: Questions? Email us at
[contact@boltfoundry.com](mailto:contact@boltfoundry.com)
