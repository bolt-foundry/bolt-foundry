+++
author = "Dan Sisco"
publishedAt = 2025-06-10T10:00:00-07:00
updatedAt = 2025-06-10T10:00:00-07:00
tags = ["llm", "prompts", "reliability", "engineering"]
excerpt = "Most teams are building LLM prompts wrong. Here are 5 essential concepts for building reliable LLM applications."
+++

![image](/static/blog/2025-06-5-image.jpg)

# 5 things about LLM prompts we think everyone should know

Most teams are building LLM prompts wrong.

We were at the [AI Engineer World’s Fair](https://www.ai.engineer/) this week,
and with all the talk about agent reliability, we haven’t heard much talk about
how to write prompts that work. We’ve built our company to make these concepts
accessible, and help everyone get their LLM products to 99.9% levels of
reliability.

## 1. Your first prompt should be your eval grader

We've built a number of LLM apps, and while we could ship decent tech demos, we
were disappointed with how they'd perform over time.

We figured out the best way to get reliable outputs from LLMs is by starting
with quality evals and _then_ driving the attention of the model through
structured prompts and user turns.

If you're starting from scratch, we've found test-driven development is a great
approach to prompt creation. Start by asking an LLM to generate synthetic data,
then you be the first judge creating scores, then create a grader and continue
to refine it till its scores match your ground truth scores.

Once you’ve completed this step, you’re ready to move on to formatting your
actual prompt.

When you make calibrating your actual data the first thing in your process, and
then grade the grader before you write a single line of your prompt, you’re
gonna have a great time.

## 2. Structured prompt generation is the foundation

If there’s one thing to take away from this post it’s this: Properly structuring
your prompt is _the_ most important thing you can do to improve the reliability
of your model, and set you up to measure your output.

Do you get annoyed when your LLM doesn’t output properly formatted JSON? Or when
you expect it to output a specific string and it
[Waluiguis](https://en.wikipedia.org/wiki/Waluigi_effect)? This happens, but
it’s preventable!

We recommend breaking prompts down into specific sections, or “cards.” This
typically includes:

- An assistant card to define the assistant's persona
- A behavior card that outlines specific behaviors
- A user persona card that defines the user's goals and mindset
- A tool calls card

By breaking these sections down, you’re structuring your prompt the way an LLM
thinks and directing its attention to the principles you want it to follow,
rather than mixing a bunch of random rules and context together.

## 3. Synthetic user turns are your most powerful tool

We see folks dropping examples in the middle of their prompts all the time, it’s
a common practice. It’s also hugely distracting for an LLM.

Imagine you were in the middle of teaching someone to become a professional
cookie baker, and then in the middle of explaining everything, you went on a
tangent on how to grow a cacao bean, and then finally came back to the finishing
steps of the recipe. It'd be confusing, right?

Instead, we recommend directing the model’s attention by putting additional
context in synthetic user turns after the system prompt. Need to output JSON?
Put it in a user turn.

### Before (Traditional Approach)

```tsx
const prompt =
  `You are a helpful assistant. Please analyze the sentiment of the following text and return JSON with score and reasoning. Text: "${userText}" Never say something is valid when it's not, and NEVER EVER hallucinate a key. Also, if you don't follow these instructions, my cousin is likely to be hit by a train."`;

// Results are inconsistent - sometimes valid JSON, sometimes not
```

### After (Bolt Foundry Approach)

> **Note**: This code example is outdated and does not reflect the current API.
> See the [current SDK documentation](../../packages/bolt-foundry/README.md) for
> up-to-date examples.

```tsx
import { BfClient } from "@bolt-foundry/sdk";

const client = BfClient.create();

const sentimentAnalyzer = client.createAssistantCard(
  "sentiment-analyzer",
  (card) =>
    card
      .spec("Analyze sentiment and return structured JSON")
      .context((ctx) => ctx.string("userText", "The text to analyze")),
);

// Always returns valid, structured JSON
const result = await client.generate(sentimentAnalyzer, {
  userText: "I love this product!",
});
```

## 4. Structure unlocks sophisticated evaluation

This structure is how we make prompt engineering more science than art.

Most teams are trying to measure systems built from unmeasurable parts. But with
prompts structured as cards and specs, every component becomes hashable and
referenceable. We built a
[library](https://www.npmjs.com/package/@bolt-foundry/bolt-foundry) to help
folks structure their prompts correctly.

Building evals from scratch is extremely hard, but this structure lays the
foundation for evals that are straightforward and easy to implement. Eventually
you’ll be able to run A/B tests on individual components, and generate heatmaps
showing which parts of your prompt are doing the heavy lifting. Our evals are
even built to work with our framework.

Traditional evals force you to look at the entire prompt as a black box. With
structured components, you can isolate variables, measure incrementally, and get
valuable data that wasn’t previously possible.

## 5. Debugging LLMs requires structured transparency

When your LLM goes sideways, you want to know why.

Unless you are extremely experienced, optimizing traditional prompts feels more
like tea leaves. Developers are stuck trying to guess which buried clause caused
the unexpected behavior.

With structured, hashed prompts, when an output is wrong, you can trace it back
to the specific card or spec that misfired. Was it the tone card that made the
response too casual? The format spec that confused the JSON structure? The
context card that introduced conflicting instructions? You know exactly where to
look.

---

These concepts work. We know because we've used them to fix broken LLM products
in production. One company went from 20% to 100% reliability in less than an
hour.

Start structuring your prompts like software, measuring them like systems, and
debugging them like code.

You can run a demo of these principles yourself directly in your CLI. Try it
out:

`aibff calibrate grader.deck.md`
