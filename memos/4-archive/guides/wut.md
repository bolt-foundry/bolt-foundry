# WUT???

A rosetta stone for understanding Bolt Foundry culture and terminology. For when
you're like "wut does this mean?????"

## Dictionary

| Term                  | Definition                                                                        | Sample                                            | Links                                                                                                                  |
| --------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| AI                    | Artificial Intelligence                                                           | "Our AI assistants use structured prompts"        |                                                                                                                        |
| Alpha                 | Early proof of concept phase                                                      | "bolt-foundry v0.3.0 is in alpha"                 | [more](#project-phases)                                                                                                |
| API                   | Application Programming Interface                                                 | "Use our API to integrate with your system"       |                                                                                                                        |
| ARR                   | Annual Recurring Revenue                                                          | "We hit $1M ARR this quarter"                     |                                                                                                                        |
| Behavior Card         | Type of card defining actionable protocols                                        | "The coding behavior card defines best practices" | [more](#cards)                                                                                                         |
| Beta                  | Testing phase before production                                                   | "Join the private beta waitlist"                  | [more](#project-phases)                                                                                                |
| BF                    | Bolt Foundry                                                                      | "BF is building the OS for LLMs"                  |                                                                                                                        |
| BFT                   | Bolt Foundry Tools (CLI tool)                                                     | "Run `bft test` to run tests"                     |                                                                                                                        |
| Card                  | Component of a deck - contains specs and spec items                               | "Create a new card for that pattern"              | [more](#decks)                                                                                                         |
| CD                    | Continuous Deployment                                                             | "Our CD pipeline deploys on merge"                |                                                                                                                        |
| CI                    | Continuous Integration                                                            | "CI failed on your PR"                            |                                                                                                                        |
| CLI                   | Command Line Interface                                                            | "Install our CLI with npm"                        |                                                                                                                        |
| Complete              | Project status: done, just maintaining                                            | "The collector is complete ✅"                    | [more](#project-status)                                                                                                |
| Constitution          | Anthropic's concept that inspired our deck system                                 | "Cards are like constitutions but more flexible"  | [more](#card-types)                                                                                                    |
| Context               | Environment and background information within a deck                              | "Add context about the user's domain"             | [more](#decks)                                                                                                         |
| Deck                  | Foundation of Bolt Foundry - contains cards, specs, leads, and context            | "Deploy the customer service deck"                | [more](#decks)                                                                                                         |
| Deprecated            | Project status: please stop using                                                 | "contacts app is deprecated 🚫"                   | [more](#project-status)                                                                                                |
| DSL                   | Domain-Specific Language                                                          | "We built a DSL for prompts"                      |                                                                                                                        |
| Example               | We use "sample" instead                                                           | "Don't say example, say sample"                   | [more](#sample-vs-example)                                                                                             |
| GPT                   | Generative Pre-trained Transformer                                                | "GPT-4 powers our system"                         |                                                                                                                        |
| Important             | Has significant long-term impact                                                  | "This feature is important for our strategy"      | [Eisenhower matrix](https://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method)                               |
| In Progress           | Project status: actively working on it                                            | "bolt-foundry is in progress 🚀"                  | [more](#project-status)                                                                                                |
| Leads                 | Entry points and examples that guide deck usage                                   | "The leads show common interaction patterns"      | [more](#decks)                                                                                                         |
| KPI                   | Key Performance Indicator (use "metric" instead)                                  | "Track metrics weekly"                            |                                                                                                                        |
| Production            | Launched and fully supported                                                      | "Version 1.0 is in production"                    | [more](#project-phases)                                                                                                |
| LLM                   | Large Language Model                                                              | "LLMs need structured prompts"                    |                                                                                                                        |
| Metric                | Measurable value that tracks progress                                             | "Track metrics weekly"                            |                                                                                                                        |
| MRR                   | Monthly Recurring Revenue                                                         | "$100k MRR milestone"                             |                                                                                                                        |
| NPS                   | Net Promoter Score                                                                | "Our NPS is 72"                                   |                                                                                                                        |
| On Hold               | Project status: paused                                                            | "bfDb is on hold ⏱️"                              | [more](#project-status)                                                                                                |
| ORM                   | Object-Relational Mapping                                                         | "bfDb is our ORM layer"                           |                                                                                                                        |
| OS                    | Operating System                                                                  | "The OS for LLMs"                                 |                                                                                                                        |
| P0                    | THE thing we're heading toward                                                    | "Fixing the NextJS example is P0"                 | [more](#priority-system)                                                                                               |
| P1.x                  | Someone is actively working on this                                               | "Documentation is P1.1"                           | [more](#priority-system)                                                                                               |
| P2.x                  | We should do this soon                                                            | "Performance optimization is P2.1"                | [more](#priority-system)                                                                                               |
| Persona Card          | Type of card defining core essence and characteristics                            | "The assistant persona card defines tone"         | [more](#decks)                                                                                                         |
| PLG                   | Product-Led Growth                                                                | "We follow PLG principles"                        |                                                                                                                        |
| POC                   | Proof of Concept                                                                  | "Built a POC in two days"                         |                                                                                                                        |
| PR                    | Pull Request                                                                      | "Your PR needs review"                            |                                                                                                                        |
| Pre-alpha             | Experimental project phase                                                        | "This feature is still pre-alpha"                 | [more](#project-phases)                                                                                                |
| QA                    | Quality Assurance                                                                 | "QA found three bugs"                             |                                                                                                                        |
| RLHF                  | Reinforcement Learning from Hotdog Fingers (or human feedback, if you're boring.) | "Models trained with RLHF"                        | [more](https://tenor.com/view/finger-sausage-doigts-saucisses-fingers-sausages-main-saucisse-finger-food-gif-27441110) |
| Sample                | Instance of LLM behavior or output                                                | "Add more samples to test coverage"               | [more](#sample-vs-example)                                                                                             |
| SDK                   | Software Development Kit                                                          | "Install our SDK with npm"                        |                                                                                                                        |
| SEV                   | Site Event - production incident requiring immediate response                     | "This is a SEV-0"                                 | [more](#sevs-site-events)                                                                                              |
| Spec (or spec item)   | Individual rule or guideline within specs (can have samples)                      | "Each spec should be actionable"                  |                                                                                                                        |
| Specs (or spec group) | Groups of related specs or other spec groups (can have samples)                   | "The validation specs contain three rules"        |                                                                                                                        |
| SQL                   | Structured Query Language                                                         | "Write SQL queries for reports"                   |                                                                                                                        |
| Stable                | Project status: works, not changing much                                          | "Logger is stable 🟢"                             | [more](#project-status)                                                                                                |
| Structured prompt     | Prompt built from decks with defined specs, cards, leads, and context             | "Use structured prompts for reliability"          | [more](#decks)                                                                                                         |
| TBD                   | To Be Determined                                                                  | "Launch date TBD"                                 |                                                                                                                        |
| TDD                   | Test-Driven Development                                                           | "We practice TDD"                                 |                                                                                                                        |
| UBN                   | See P🔥 (UBN)                                                                     | "This is a P🔥"                                   | [more](#priority-system)                                                                                               |
| Unsupported           | Project phase: no longer maintained                                               | "That version is unsupported"                     | [more](#project-phases)                                                                                                |
| Urgent                | Needs immediate attention                                                         | "This bug is urgent"                              | [Eisenhower matrix](https://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method)                               |
| UX                    | User Experience                                                                   | "Focus on developer UX"                           |                                                                                                                        |

## Decks

Decks are the foundation of Bolt Foundry. A deck is a complete system that
contains four key components:

1. **Cards** - Define personas and behaviors, can be represented as markdown
   text or in code
2. **Specs** - Rules and guidelines organized into groups (spec groups) or
   individual items (spec items)
3. **Leads** - Entry points and examples that guide how to use the deck
4. **Context** - Environment and background information that shapes the deck's
   behavior

### Cards

Each card within a deck contains:

- A title
- A summary
- Associated specs and spec items

Both specs and individual spec items can have samples attached to demonstrate
the principle in action. While spec groups can be nested, we recommend limiting
nesting depth and instead composing multiple cards together. Cards are designed
for both humans and machines to understand, reference, and use to reinforce
specific principles and behaviors.

Cards typically define:

- **Persona cards** - Core essence and characteristics of an LLM system
- **Behavior cards** - Actionable protocols and best practices

This approach lets us build reliable LLM systems through composable, verifiable
components that both humans and machines can understand.

Anthropic's
[constitutional AI](https://www.anthropic.com/news/claudes-constitution) concept
was an inspiration for our deck system. While constitutions define AI behavior
through principles, we expanded this into a more flexible deck system.

## Priority system

| Priority  | Meaning                             | Description                                                            |
| --------- | ----------------------------------- | ---------------------------------------------------------------------- |
| P🔥 (UBN) | UNBREAK NOW!!                       | Urgent AND important - actively causing damage and needs immediate fix |
| P0        | THE thing we're heading toward      | Important and urgent, only one project at a time                       |
| P1.x      | Someone is actively working on this | Urgent, maybe important, but less important than P0                    |
| P2.x      | We should do this soon              | Important but not urgent yet - we expect it to become urgent soon      |

## Project phases

See [version numbers](#version-numbers) for how versions typically align with
project phases.

| Phase        | Characteristics                                                                                                         | Customer commitment                                                                                                                            |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Pre-alpha    | • Experimental code • May not work at all • APIs change daily • Internal use only • Never creates SEVs                  | • Internal team only • No external access • No documentation • No support commitments                                                          |
| Alpha        | • Basic functionality implemented • API will definitely change • Expect bugs • Never creates SEVs                       | • Invite only • Individualized onboarding with customer success person • Direct access to engineering team                                     |
| Private Beta | • Core features work • API stabilizing • Still finding edge cases • Can create SEVs                                     | • Waitlist entry • Scaled onboarding with individualized support • Priority support channels • Individual customer SLAs available              |
| Public Beta  | • Feature complete • Good documentation • Ready for early adopters • Can create SEVs                                    | • Open to anyone • Scaled onboarding with some priority support • Community forums with priority response • Individual customer SLAs available |
| Production   | • Stable APIs • Full documentation • Backward compatibility maintained • Can create SEVs                                | • Public availability • Production quality onboarding • Standard support options • Standard SLAs apply                                         |
| Deprecated   | • Still functional but not recommended • Security patches only • Migration path documented • End-of-life date announced | • New customers discouraged or not allowed • Migration assistance available • Limited support • Reduced SLAs, no new SLAs established          |
| Unsupported  | • No longer maintained • No security patches • No support available • May stop working at any time                      | • No commitments • Use at your own risk • No support • No SLAs                                                                                 |

## Project status

Wut do these status emojis mean?

- **In Progress 🚀** = Actively working on it right now
- **Stable 🟢** = It works, we're not changing it much
- **On Hold ⏱️** = Paused, might come back to it
- **Complete ✅** = Done. Just maintaining it now
- **Deprecated 🚫** = Please stop using this, we have something better

## Sample vs example

At Bolt Foundry, we use the term **samples** instead of "examples" when
referring to instances of LLM behavior or output. Samples represent concrete
instances of an LLM's capabilities that can be tested, verified, and reused.

## SEVs (site events)

SEVs are production incidents that require immediate response. Only launched
(production) systems can trigger SEVs.

### SEV levels

- **SEV-0**: Complete outage or data loss risk. Critical metrics (revenue) could
  be affected. The company's long-term trajectory could be altered if not dealt
  with
- **SEV-1**: Major functionality broken for many users. Significant business
  impact if not resolved quickly
- **SEV-2**: Significant issue affecting some users. Customer satisfaction at
  risk
- **SEV-3**: Minor issue with workaround available. Still needs timely
  resolution
- **SEV-4**: Planned maintenance or something happening that could cause an
  issue

### Pre-production incidents

For alpha, private beta, and public beta stages:

- Issues create UBN tasks instead of SEVs
- Direct engineering support without formal incident process
- No SLA commitments

### SEV reviews

- **SEV-0 through SEV-3**: Require postmortem after resolution
- **SEV-4**: Requires premortem before planned maintenance
- Reviews focus on learning, not blame
- Document what happened, why, and how to prevent recurrence
- SEV levels can increase but should never decrease
- Each SEV level indicates more systems and people should be working on the
  problem

## Version numbers

We follow [semantic versioning](https://semver.org/) with the pattern
v[MAJOR].[MINOR].[PATCH], where version numbers can be double digits (v0.15.2,
v1.23.0, etc.).

### How versions align with phases

[Project phases](#project-phases) don't cleanly map to specific version ranges -
a project might stay in alpha through v0.15 or reach production at v0.8. These
are rough guidelines:

- **v0.0.x** = Pre-alpha
- **Early v0.x** = Alpha
- **Mid v0.x** = Private Beta
- **Late v0.x** = Public Beta
- **v1.0+** = Production

Beta and earlier phases typically increment minor version numbers (v0.1 → v0.2),
while production releases increment the major version (v1.0 → v2.0) for each
significant release.

### Semantic versioning

Format: **Major.Minor.Patch**

- Major = Breaking changes
- Minor = New features
- Patch = Bug fixes
