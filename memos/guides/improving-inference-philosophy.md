# Improving Inference Philosophy

## Why inference-time control matters

Right now, people build AI assistants in a way that's arbitrary. There's no real
way to steer them toward something actually helpful. When governments use AI to
draft policy documents, when doctors use it for diagnoses, when engineers use it
to write critical code — we need predictability and control.

The problem isn't just that models have built-in biases or behaviors. It's that
users are stuck with whatever instincts were baked in during training. You can
write the perfect prompt, but you're still at the mercy of the model's
pre-trained tendencies.

We believe AI should be reliable and predictable. It's already becoming an
indispensable system. Users should have control over how their model thinks, not
just work around its instincts.

## The virtuous cycle

Inference-time optimization isn't just about fixing problems in production. It
enables something bigger:

**Reliable inference → Synthetic data → Better training → More reliable models**

When you can control and predict model behavior at inference time, you can:

- Generate consistent, high-quality synthetic data
- Use that data for fine-tuning or distillation
- Create models that are inherently more steerable
- Build a feedback loop that continuously improves

This isn't theoretical. OpenAI and Anthropic use this approach internally to
create their instruct, chat, and reasoning models. The difference is we're
making these tools available to everyone.

## Sample scoring as a forcing function

The -3 to +3 scoring system forces teams to have the same debates OpenAI and
Anthropic have internally when they train their models.

The real debates happen at the edges:

- **+3/-3**: What's the perfect (or perfectly wrong) example of this behavior?
- **+1/-1**: Where's the line between acceptable and not quite right?
- **+2/-2**: These are just "adequate" — good enough but not debate-worthy

This process sparks crucial internal debates about what it means to embody a
principle. A +3 sample perfectly demonstrates the spec — it's the clearest, most
unambiguous example of the behavior. A -3 is equally clear in the opposite
direction. Quality samples lead to clear writing and clear understanding of how
an assistant should behave.

Making these choices explicit through scored samples creates an auditable record
of your AI's intended behavior. Just like code comments explain why a function
works a certain way, sample scores explain why an AI should behave a certain
way.

## Principles for achieving 99% reliability

In the early days of computing, computers had actual bugs in the vacuum tubes.
If we'd just tolerated that inconsistency, computers couldn't be trusted to fly
planes, build medical devices, or send people to space.

Your AI assistant's behavior needs to be:

- **Auditable** like source code — with comments explaining why values are set
- **Testable** — unit tests, backtests, A/B tests
- **Predictable** — you should know how it'll act before it acts
- **99% reliable** — not just "usually works"

The written word is the technology of rigor
([as Ezra Klein put it](https://x.com/david_perell/status/1927172733072228352)).
Any prompt that isn't rigorous is a wasted opportunity to increase reliability.
Through structured prompts with scored samples, we turn vague intentions into
precise, testable specifications.

That's what structured prompts give you — not just better prompts, but AI you
can actually trust in production.
