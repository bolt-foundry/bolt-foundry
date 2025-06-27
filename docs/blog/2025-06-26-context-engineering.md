+++
author = "Dan Sisco"
publishedAt = 2025-06-26T10:00:00-07:00
updatedAt = 2025-06-26T10:00:00-07:00
tags = ["context engineering", "evals", "reliability", "llm"]
excerpt = "Context engineering is the new term for what we've been working on at Bolt Foundry: systematically optimizing LLM performance through structured samples, graders, and proper information hierarchy."
+++

# Context engineering is the way

![image.png](/static/blog/2025-06-26-drake-meme.jpg)

We’ve…been working on this for over a year…and…he just…he tweeted it out.

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">I really like the term “context engineering” over prompt engineering. <br><br>It describes the core skill better: the art of providing all the context for the task to be plausibly solvable by the LLM.</p>&mdash; tobi lutke (@tobi) <a href="https://twitter.com/tobi/status/1935533422589399127?ref_src=twsrc%5Etfw">June 19, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Context engineering is the new hotness, and we’re so excited there’s a term for
this now!

Threading this needle is the key to building a reliable, successful LLM
application. And it happens to be exactly what we’ve been working on at Bolt
Foundry.

## What is context?

Context is everything your model sees before it sends a response.

It’s your prompt, user message, tool calls, user turns, samples, and grader.

With too much context (like prompt stuffing) you divert the LLM’s attention and
reliability plummets. With too little context, LLMs are left guessing and
filling in gaps, which is similarly unreliable.

## Why does this matter?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">In every industrial-strength LLM app, context engineering is the delicate art and science of filling the context window with just the right information for the next step</p>&mdash; Andrej Karpathy (@karpathy) <a href="https://twitter.com/karpathy/status/1937902205765607626?ref_src=twsrc%5Etfw">June 25, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In human-to-human communication, context is key. We get context through dozens
of verbal and nonverbal cues, like body language, tone of voice, eye contact,
pitch, and more. Notably remote work sucks because we lose the majority of these
contextual clues on Zoom.

LLMs also need context to perform reliably.

We’ve found the best way to provide this context is:

1. Create data samples from examples of success and failure
2. Build graders from those samples that reinforce what you want the LLM to do
3. Structure your prompt with clear information hierarchy

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The difference between ai slop and magical experiences is the context you give to the model </p>&mdash; boris tane (@boristane) <a href="https://twitter.com/boristane/status/1937133556444127429?ref_src=twsrc%5Etfw">June 23, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Our work with samples, graders, and evals is context engineering at its core.
We’re structuring feedback and examples to optimize LLM performance, which is
exactly what Karpathy is describing.

## What does this look like in practice?

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Merely crafting prompts does not seem like a real fulltime role, but figuring out how to compress context, chain prompts, recover from errors, and measure improvements is super challenging.”</p>&mdash; Amjad Masad (@amasad) <a href="https://twitter.com/amasad/status/1616670863373512705?ref_src=twsrc%5Etfw">January 21, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

We recently implemented this approach with Fastpitch, an AI-generated sports
newsletter. We wrote about it **[here](2025-06-23-llm-evals-with-aibff.md)**,
but the highlights are:

1. We started by creating Ground Truth samples of stories collected by the LLM,
   scored by a human
2. We created an additional collection of synthetic samples to reinforce the
   learning
3. We used those data samples to build a Grader that evaluates story data
4. We iterated on that Grader until it agreed with the Ground Truth samples
5. We then used that Grader to adjust our prompt

Proper information hierarchy also helps LLMs perform better. We've seen this
over and over with customers.

We took one customer from
[86% reliability on XML output to 100%](2025-06-inconsistent-outputs-to-perfect-reliability.md)
in less than an hour with some basic prompt tweaks.

This approach to giving the model "just the right information" with human-graded
samples, a calibrated Grader, and correctly formatted prompt is the heart of
context engineering.

We're thrilled to see more people talking about this.

If you're interested in learning more about context engineering, and making LLM
development more science than art,
[join our community on Discord](https://discord.gg/tU5ksTBfEj).
