+++
author = "Dan Sisco"
publishedAt = 2025-06-11T09:00:00-07:00
updatedAt = 2025-06-11T09:00:00-07:00
tags = ["case-study", "reliability", "llm", "attention-management"]
excerpt = "How Velvet increased their citation XML output reliability to 100% in under an hour using LLM attention management principles."
+++

# From inconsistent outputs to perfect reliability in under an hour

**How LLM attention management changes everything**

> This completely changes how we think about LLM development.
>
> - Joseph Ferro, Head of Product, Velvet

Velvet runs a research app that helps VCs and PE firms make decisions about
their investments. Their product works beautifully, but a formatting issue in
about 1 out of 7 citation responses was causing raw XML to show up in the UI.

The team knew even a small number of formatting issues could impact user trust,
especially in a research-heavy product.

And Velvet isn't alone. We've talked to dozens of programmers building LLM
applications and literally everyone has experienced some form of this pain
point.

The most common approach to fixing it would be to stuff the prompt with more
context and examples, then vibe check it to see if it gets better. But without a
structured approach, this turns into guesswork: unreliable and hard to debug.

> I used to be a developer, but when it comes to prompt engineering I feel like
> I'm sort of lost trying to figure out what the best practices are.
>
> - Joseph Ferro, Head of Product, Velvet

## The problem with prompts today 🧐

Velvet's monolithic prompt was diverting the LLM's attention in half a dozen
different directions. It followed the classic pattern:

- Some instructions about who the model is
- Variables from their database interpolated into a string
- A bunch of specific user context
- More instructions coaxing the model to "please please please output this
  correctly"
- Then "do the thing, but also don't ever do these bad things"

We see this type of prompting everywhere. The "do this right or a puppy will be
murdered" trope also seems to inexplicably be gaining traction.

## The Legend of the Cone 🍦

Monolithic prompts don't work because LLM reliability is all about managing
attention.

Think of a model's attention like a cone. It starts wide and should narrow as
your prompt progresses.

When you start, the model considers **all the information in its dataset**. It's
considering episodes of Baywatch, how to talk like a pirate, and occasionally
researching investment decisions.

The goal of the system prompt is to drive the attention of the model toward your
actual objective...to narrow the cone and do **just this one thing** really,
really well.

Velvet was asking the model to hold multiple competing concerns in its attention
simultaneously by mixing citation rules, format requirements, examples, and
warnings all together.

The massive example in the middle of the prompt was particularly destructive, as
it widened the cone right when they needed focus. Almost every company we've
talked to puts user data inside the system prompt. So whatever metadata you
provide about your user drives the assistant away from your goals and makes the
results less predictable.

The solution isn't prompt stuffing more context and "good" or "bad"
examples...it's structuring the conversation so each piece of information
logically builds toward a single, focused outcome.

We call this the Hourglass Shape and it's something we've seen work across the
board.

## A 60-minute fix ⏰

Without even using our software and only using
[our prompt philosophy](docs/blog/2025-06-5-things-about-llms.md), Velvet
increased their citation XML output reliability from 20% to 100%.

It literally never failed.

Everyone on their team and our team tried to break it, and were shocked when it
remained unbreakable.

## As the user turns 🌎

In this case, the most important part of the hourglass shape was moving the
context to [synthetic user turns](docs/guides/deck-system.md).

For Velvet, adding the variables into the top of the user turn, and the
formatting at the bottom as the last user turn before generation, meant that the
model's attention wasn't diverted and it was able to perform perfectly.

## The future of LLM reliability

Velvet's jump from 86% to 100% XML reliability shows what's possible when you
start working with LLMs the way they're designed to processes information.

Treating prompts like all-powerful magic spells is not engineering. Making
something measurable, repeatable, and scalable is.

Every LLM application struggling with reliability is fighting the same battle
Velvet was. The question isn't whether your prompts will need this systematic
approach...it's how much longer you'll wait before implementing it.
