# Bolt Foundry company vision

## Mission

**Make LLM development as reliable and maintainable as traditional software
engineering.**

## The problem we're solving

Today's LLM development reflects earlier ages of programming. Developers write
prompts as text strings instead of composing them from structured cards... the
equivalent of writing SQL queries by hand instead of using an ORM, or building
HTML by concatenating strings instead of using components.

This creates four problems:

- **Unreliable systems**: One small change breaks two other things
- **Unmaintainable code**: No structure, no reusability, no clear interfaces
- **Untestable components**: Can't verify individual pieces work correctly
- **Scaling challenges**: Each new use case starts from scratch

LLM applications deserve the same engineering rigor as any other software
system.

## Why we're working on this

Our team has been building together for 7+ years, from our first company
Vidpresso (acquired by Facebook) through Content Foundry and now Bolt Foundry.
We discovered a consistent pattern: it's easy to build impressive LLM demos, but
hard to scale them into reliable, repeatable systems.

Our team combines journalism, content creation, and technical expertise. The
same principles that make great content (inverted pyramid, active voice, clear
structure) make LLMs perform reliably.

The timing is perfect. LLM model improvements have plateaued since GPT-4, but
inference-side optimization is wide open. Most companies accept "good enough"
reliability, but the ones who achieve 99% reliability will dominate their
markets. We're building the infrastructure to make that possible.

_For the complete story of our journey and insights, see
[Our Team Story](team-story.md)._

## Our vision

**Bolt Foundry aims to be the operating system for LLMs**: the foundational
infrastructure every LLM application needs for reliability, maintainability, and
scale.

Microsoft became the standard by making computing accessible. We're doing the
same for LLM development. Our card system abstracts away prompt engineering
complexity, making LLM development predictable and scalable.

## How we see the future

### Today: The SQL era

- Developers manually craft text prompts
- Each prompt ignores writing fundamentals: attention, organization, voice,
  tone, second person, inverted pyramid, active voice
- Testing takes hours, longer than writing the prompt
- Knowledge stays trapped in individual heads
- No clear upgrade paths or versioning

### Near-term vision: The framework era

- Developers compose prompts using semantic APIs built from reusable cards
- Reusable components with clear interfaces
- Unit testing for individual prompt components
- Automated testing and validation
- Shared libraries of proven card patterns
- Seamless updates and A/B testing

### Long-term vision: The operating system era

- Intelligent prompt optimization
- Real-time performance insights
- Automated quality assurance
- Enterprise-grade reliability and security
- Developer ecosystem around structured assistant cards

### The card system

Just like trading cards have structured attributes and clear rules for
combination, our assistant cards provide:

- **Persona cards**: Define who the LLM should be (traits, constraints, voice)
- **Behavior cards**: Define what the LLM should do (goals, steps, outputs)
- **Composability**: Mix and match cards to create new capabilities
- **Collectibility**: Share proven card patterns across teams

## Why this matters

### For developers

- Build faster with reusable components
- Unit test and validate prompt behavior at the component level
- Update systems without breaking everything
- Share and improve prompt patterns across teams

### For companies

- LLM applications that work consistently
- Systems that grow with business needs
- Optimize prompt performance automatically
- Predictable behavior in production

### For the industry

- Make advanced LLM techniques accessible
- Establish best practices and conventions
- Free developers to focus on unique value, not infrastructure
- Enable LLM adoption in mission-critical applications

## Our principles

### Engineering first

Great LLM applications are built, not discovered. They require the same
discipline, testing, and structure as any reliable software system.

Our approach centers on
[improving inference through structured rigor](improving-inference-philosophy.md),
giving developers control at runtime, not just hoping the model behaves
correctly.

### Developer experience

Tools feel natural to developers. We prioritize clarity, composability, and
familiar patterns over clever abstractions.

### Gradual adoption

Developers shouldn't have to rewrite everything. Our tools provide migration
paths from existing text prompts to structured systems.

### Open foundation

Core patterns and principles stay open and extensible. We build platforms, not
silos.

## What success looks like

We'll know we're succeeding when:

- Developers prefer structured prompts over text strings for new projects
- LLM applications achieve web-scale reliability (99.9%+ uptime)
- Prompt engineering becomes teachable through clear patterns, conventions, and
  unit testing practices
- Enterprise adoption accelerates due to predictable, maintainable systems
- An ecosystem emerges of shared components and best practices

## The world we're building

We're working toward a world where:

- Writing raw text prompts feels as archaic as programming in assembly language
- LLM applications have the same reliability expectations as web applications
- Companies deploy LLM systems confidently in production
- The next generation of AI applications is built on structured, semantic
  foundations

**Bolt Foundry is building the tools to make this happen.**

---

**Related documents:**

- [Our team story](team-story.md) - Detailed background on our journey and
  insights
- [Business vision](business-vision.md) - Go-to-market strategy and revenue
  model
- [Product plan](/404.md) - Technical roadmap and implementation details
