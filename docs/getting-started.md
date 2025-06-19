# Getting Started with aibff

This guide walks you through setting up aibff and creating your first reliable
AI evaluation in under 15 minutes.

## What You'll Learn

By the end of this guide, you'll:

- Understand what makes AI outputs unreliable
- Install and run aibff
- Create your first grader
- Use `aibff calibrate` to measure AI reliability
- Know how to improve your AI's performance

## Prerequisites

- Basic command line familiarity
- An OpenRouter API key ([get one free](https://openrouter.ai/))
- 15 minutes

## Step 1: Understanding the Problem

Try this experiment. Ask any AI system the same question 3 times:

```
"Write a professional email declining a meeting request"
```

You'll get 3 different responses - different tone, length, and approach. This
inconsistency makes AI hard to use in production systems.

**aibff solves this by making AI behavior measurable and improvable.**

## Step 2: Installation

### Download aibff

Get the latest release for your platform:

- **[Download aibff releases →](https://github.com/content-foundry/content-foundry/releases?q=aibff&expanded=true)**

### Install

```bash
# Linux/macOS
curl -L https://github.com/content-foundry/content-foundry/releases/download/aibff-vX.X.X/aibff-linux-x86_64.tar.gz | tar xz
chmod +x aibff

# Windows (PowerShell)
# Download the .zip file and extract aibff.exe
```

### Verify Installation

```bash
./aibff --help
```

You should see the aibff command options.

## Step 3: Set Up Your API Key

aibff works with multiple AI providers. For this guide, we'll use OpenRouter.

**Get your free API key:** [Sign up at OpenRouter](https://openrouter.ai/keys)
and create a new API key.

Then set it in your environment:

```bash
export OPENROUTER_API_KEY=your-api-key-here
```

## Step 4: Try the Example

Let's use our fastpitch example to see aibff in action:

```bash
# Clone the repository (if you haven't already)
git clone [repo-url]
cd bolt-foundry

# Run calibration on the example grader
./aibff calibrate decks/fastpitch/ai_gen_grader.deck.md
```

This will:

1. Run the AI through various test scenarios
2. Score the outputs using the grader criteria
3. Show you exactly how reliable your AI is

You'll see output like:

```
Calibrating grader: AI Generation Grader
Running 12 test samples...
✓ Sample 1: Score +2 (Expected +2)
✗ Sample 2: Score -1 (Expected +3) 
...
Overall Reliability: 73%
```

## Step 5: Understanding Graders

Open `decks/fastpitch/ai_gen_grader.deck.md` to see how graders work:

```markdown
# AI Generation Grader

Evaluates AI-generated content for quality and helpfulness.

## Evaluation Criteria

- Content directly addresses the user's request
- Response is clear and actionable
- Tone is appropriate for the context

## Scoring Guidelines

- **+3**: Excellent response, exactly what was needed
- **+2**: Good response with minor improvements possible
- **+1**: Acceptable response, meets basic requirements
- **-1**: Response has issues but partially addresses request
- **-2**: Poor response, misses key requirements
- **-3**: Completely wrong or unhelpful response

![samples and context](./samples.jsonl)
```

The key insight: **graders turn subjective AI evaluation into objective
measurement.**

## Step 6: Create Your First Grader

Let's create a grader for email responses:

```bash
mkdir my-graders
cd my-graders
```

Create `email-grader.deck.md`:

```markdown
# Email Response Grader

Evaluates professional email responses for clarity and helpfulness.

## Evaluation Criteria

- Uses professional, courteous tone
- Addresses the recipient's question directly
- Provides clear next steps or information
- Appropriate email structure (greeting, body, closing)

## Scoring Guidelines

- **+3**: Perfect professional email with clear, helpful response
- **+2**: Good email with minor improvements possible
- **+1**: Acceptable professional email, meets basic requirements
- **-1**: Somewhat unprofessional or unclear response
- **-2**: Poor email structure or unhelpful content
- **-3**: Rude, confusing, or completely off-topic response

![samples and context](./email-grader-context-and-samples.deck.toml)
```

Create `email-grader-context-and-samples.deck.toml` with test examples:

```jsonl
{\"input\": \"Can you reschedule our 3pm meeting to tomorrow?\", \"expected_output\": \"Hi [Name],\\n\\nAbsolutely! I can move our 3pm meeting to tomorrow. What time works best for you? I have availability from 10am-2pm and 4pm-6pm.\\n\\nBest regards,\\n[Your name]\", \"score\": 3}
{\"input\": \"What's our budget for Q4?\", \"expected_output\": \"Hi [Name],\\n\\nI'll need to check with finance on the exact Q4 budget numbers. I'll get back to you by end of day with the details.\\n\\nThanks,\\n[Your name]\", \"score\": 2}
{\"input\": \"Can you help with the presentation?\", \"expected_output\": \"Sure, what do you need help with?\", \"score\": -2}
```

## Step 7: Test Your Grader

```bash
../aibff calibrate email-grader.deck.md
```

This will show you how well AI performs at writing professional emails according
to your criteria.

## Step 8: Improve Performance

Based on your calibration results, you can:

1. **Refine your grader**: Add more specific criteria or examples
2. **Adjust scoring**: Make sure your +3/-3 examples are clear
3. **Add more samples**: More examples = better calibration
4. **Iterate**: Run calibrate again to measure improvement

## Understanding Your Results

When you run `aibff calibrate`, you get:

- **Overall reliability score**: What percentage of outputs meet your standards
- **Sample-by-sample breakdown**: See exactly where AI succeeds/fails
- **Improvement suggestions**: Areas to focus on for better performance

## Next Steps

Now that you understand the basics:

1. **[Create better graders](graders-guide.md)** - Learn advanced grader
   techniques
2. **[Understand calibration](calibrate-guide.md)** - Deep dive into reliability
   measurement
3. **Try different models** - Compare AI providers with the same grader
4. **Build for production** - Use graders to ensure consistent AI behavior

## Common Questions

**Q: How many examples do I need in my grader?** A: Start with 6-12 examples
covering your +3 to -3 range. Add more if calibration results seem inconsistent.

**Q: What makes a good grader?** A: Clear criteria, diverse examples, and
scoring that reflects real-world quality standards.

**Q: Can I use aibff with different AI models?** A: Yes! aibff works with
OpenRouter, OpenAI, Anthropic, and other providers. Use the same grader to
compare models.

**Q: How reliable should my AI be?** A: Depends on your use case. Customer
support might need 95%+ reliability, while creative writing might be fine at
80%.

---

**Need help?** Email us at
[contact@boltfoundry.com](mailto:contact@boltfoundry.com) or check our
[documentation](../README.md).
