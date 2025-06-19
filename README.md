# aibff - Make Your AI Outputs Reliable

Most developers don't write AI evaluations because they're impossible to
understand. aibff changes that with graders - simple markdown files that make
your AI outputs testable, reliable, and easy to improve.

## The Problem

AI outputs are inconsistent. The same prompt gives different results, making it
hard to:

- Build reliable features
- Test AI behavior
- Improve performance over time
- Trust AI in production

## The Solution

aibff uses **graders** - markdown files that define what good AI output looks
like. Run `aibff calibrate` to see exactly how reliable your AI is and where to
improve.

## Quick Start

### 1. Try the Example

Clone this repo and try our fastpitch grader:

```bash
git clone [repo-url]
cd bolt-foundry
export OPENROUTER_API_KEY=your-api-key
aibff calibrate decks/fastpitch/ai_gen_grader.deck.md
```

You'll get a reliability report showing exactly how your AI performs.

### 2. Install aibff

Download for your platform:

- **[Download aibff releases →](https://github.com/content-foundry/content-foundry/releases?q=aibff&expanded=true)**

```bash
# Linux/macOS
curl -L https://github.com/content-foundry/content-foundry/releases/download/aibff-vX.X.X/aibff-linux-x86_64.tar.gz | tar xz
./aibff --help
```

## What are graders?

Graders are markdown files that define reliable AI behavior:

```markdown
# Email Response Grader

Evaluate email responses for professionalism and helpfulness.

## Evaluation Criteria

- Uses professional tone
- Addresses the customer's question directly
- Provides clear next steps

## Scoring Guidelines

- **+3**: Perfect professional response with clear solution
- **+1**: Good response, minor improvements possible
- **-1**: Somewhat unprofessional or unclear
- **-3**: Rude or completely unhelpful

![samples and context](./email-grader-context-and-samples.deck.toml)
```

The scoring system (-3 to +3) gives you precise control over AI reliability.

## Why This Works

Traditional AI testing is guesswork. aibff gives you:

- **Precise measurement** of AI reliability
- **Clear improvement targets** through calibration
- **Testable specifications** that both humans and AI understand
- **Reliable outputs** through structured evaluation

## Learn More

- **[Getting Started Guide](docs/getting-started.md)** - Complete setup
  walkthrough
- **[Calibrate Guide](docs/calibrate-guide.md)** - Understanding your
  reliability reports
- **[Create Graders Guide](docs/graders-guide.md)** - Build your own evaluations

---

**Contact**: Questions? Email us at
[contact@boltfoundry.com](mailto:contact@boltfoundry.com)
