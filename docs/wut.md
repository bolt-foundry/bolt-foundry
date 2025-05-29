# WUT???

A rosetta stone for understanding Bolt Foundry culture and terminology. For when
you're like "wut does this mean?????"

## Dictionary

| Term                  | Definition                                                                 | Sample                                            | Links                                                                                    |
| --------------------- | -------------------------------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| AI                    | Artificial Intelligence                                                    | "Our AI assistants use structured prompts"        |                                                                                          |
| Alpha                 | Early proof of concept phase                                               | "bolt-foundry v0.3.0 is in alpha"                 | [more](#project-phases)                                                                  |
| API                   | Application Programming Interface                                          | "Use our API to integrate with your system"       |                                                                                          |
| ARR                   | Annual Recurring Revenue                                                   | "We hit $1M ARR this quarter"                     |                                                                                          |
| Behavior Card         | Type of card defining actionable protocols                                 | "The coding behavior card defines best practices" | [more](#cards)                                                                           |
| Beta                  | Testing phase before production                                            | "Join the private beta waitlist"                  | [more](#project-phases)                                                                  |
| BF                    | Bolt Foundry                                                               | "BF is building the OS for LLMs"                  |                                                                                          |
| BFF                   | Bolt Foundry Friend (CLI tool)                                             | "Run `bff test` to run tests"                     |                                                                                          |
| Card                  | Foundation of Bolt Foundry - contains specs and spec items                 | "Create a new card for that pattern"              | [more](#cards)                                                                           |
| CD                    | Continuous Deployment                                                      | "Our CD pipeline deploys on merge"                |                                                                                          |
| CI                    | Continuous Integration                                                     | "CI failed on your PR"                            |                                                                                          |
| CLI                   | Command Line Interface                                                     | "Install our CLI with npm"                        |                                                                                          |
| Complete              | Project status: done, just maintaining                                     | "The collector is complete ✅"                    | [more](#project-status)                                                                  |
| Constitution          | Anthropic's concept that inspired our card system                          | "Cards are like constitutions but more flexible"  | [more](#card-types)                                                                      |
| Deprecated            | Project status: please stop using                                          | "contacts app is deprecated 🚫"                   | [more](#project-status)                                                                  |
| DSL                   | Domain-Specific Language                                                   | "We built a DSL for prompts"                      |                                                                                          |
| Example               | We use "sample" instead                                                    | "Don't say example, say sample"                   | [more](#sample-vs-example)                                                               |
| GPT                   | Generative Pre-trained Transformer                                         | "GPT-4 powers our system"                         |                                                                                          |
| Important             | Has significant long-term impact                                           | "This feature is important for our strategy"      | [Eisenhower matrix](https://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method) |
| In Progress           | Project status: actively working on it                                     | "bolt-foundry is in progress 🚀"                  | [more](#project-status)                                                                  |
| KPI                   | Key Performance Indicator (use "metric" instead)                           | "Track metrics weekly"                            |                                                                                          |
| Production            | Launched and fully supported                                               | "Version 1.0 is in production"                    | [more](#project-phases)                                                                  |
| LLM                   | Large Language Model                                                       | "LLMs need structured prompts"                    |                                                                                          |
| Metric                | Measurable value that tracks progress                                      | "Track metrics weekly"                            |                                                                                          |
| MRR                   | Monthly Recurring Revenue                                                  | "$100k MRR milestone"                             |                                                                                          |
| NPS                   | Net Promoter Score                                                         | "Our NPS is 72"                                   |                                                                                          |
| On Hold               | Project status: paused                                                     | "bfDb is on hold ⏱️"                              | [more](#project-status)                                                                  |
| ORM                   | Object-Relational Mapping                                                  | "bfDb is our ORM layer"                           |                                                                                          |
| OS                    | Operating System                                                           | "The OS for LLMs"                                 |                                                                                          |
| P0                    | THE thing we're heading toward                                             | "Fixing the NextJS example is P0"                 | [more](#priority-system)                                                                 |
| P1.x                  | Someone is actively working on this                                        | "Documentation is P1.1"                           | [more](#priority-system)                                                                 |
| P2.x                  | We should do this soon                                                     | "Performance optimization is P2.1"                | [more](#priority-system)                                                                 |
| Persona Card          | Type of card defining core essence and characteristics                     | "The assistant persona card defines tone"         | [more](#cards)                                                                           |
| PLG                   | Product-Led Growth                                                         | "We follow PLG principles"                        |                                                                                          |
| POC                   | Proof of Concept                                                           | "Built a POC in two days"                         |                                                                                          |
| PR                    | Pull Request                                                               | "Your PR needs review"                            |                                                                                          |
| Pre-alpha             | Experimental project phase                                                 | "This feature is still pre-alpha"                 | [more](#project-phases)                                                                  |
| QA                    | Quality Assurance                                                          | "QA found three bugs"                             |                                                                                          |
| RLHF                  | Reinforcement Learning from Human Fingers (or feedback, if you're boring.) | "Models trained with RLHF"                        |                                                                                          |
| Sample                | Instance of LLM behavior or output                                         | "Add more samples to test coverage"               | [more](#sample-vs-example)                                                               |
| SDK                   | Software Development Kit                                                   | "Install our SDK with npm"                        |                                                                                          |
| SEV                   | Site Event - production incident requiring immediate response              | "This is a SEV-0"                                 | [more](#sevs-site-events)                                                                |
| Spec (or spec item)   | Individual rule or guideline within specs (can have samples)               | "Each spec should be actionable"                  |                                                                                          |
| Specs (or spec group) | Groups of related specs or other spec groups (can have samples)            | "The validation specs contain three rules"        |                                                                                          |
| SQL                   | Structured Query Language                                                  | "Write SQL queries for reports"                   |                                                                                          |
| Stable                | Project status: works, not changing much                                   | "Logger is stable 🟢"                             | [more](#project-status)                                                                  |
| Structured prompt     | Prompt built from composable cards with defined specs                      | "Use structured prompts for reliability"          | [more](#cards)                                                                           |
| TBD                   | To Be Determined                                                           | "Launch date TBD"                                 |                                                                                          |
| TDD                   | Test-Driven Development                                                    | "We practice TDD"                                 |                                                                                          |
| UBN                   | See P🔥 (UBN)                                                              | "This is a P🔥"                                   | [more](#priority-system)                                                                 |
| Unsupported           | Project phase: no longer maintained                                        | "That version is unsupported"                     | [more](#project-phases)                                                                  |
| Urgent                | Needs immediate attention                                                  | "This bug is urgent"                              | [Eisenhower matrix](https://en.wikipedia.org/wiki/Time_management#The_Eisenhower_Method) |
| UX                    | User Experience                                                            | "Focus on developer UX"                           |                                                                                          |

## Cards

Cards are the foundation of Bolt Foundry. They can be represented as markdown
text or in code. Each card contains:

1. A title
2. A summary
3. Specs (or spec groups) - groups of related specs or other spec groups (can
   have samples attached)
4. Spec (or spec items) - individual rules or guidelines within specs (can have
   samples attached)

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
was an inspiration for our card system. While constitutions define AI behavior
through principles, we expanded this into a more flexible card system.

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

| Phase        | Characteristics                                                                                                                  | Customer commitment                                                                                                                                     |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pre-alpha    | • Experimental code<br>• May not work at all<br>• APIs change daily<br>• Internal use only<br>• Never creates SEVs               | • Internal team only<br>• No external access<br>• No documentation<br>• No support commitments                                                          |
| Alpha        | • Basic functionality implemented<br>• API will definitely change<br>• Expect bugs<br>• Never creates SEVs                       | • Invite only<br>• Individualized onboarding with customer success person<br>• Direct access to engineering team                                        |
| Private Beta | • Core features work<br>• API stabilizing<br>• Still finding edge cases<br>• Can create SEVs                                     | • Waitlist entry<br>• Scaled onboarding with individualized support<br>• Priority support channels<br>• Individual customer SLAs available              |
| Public Beta  | • Feature complete<br>• Good documentation<br>• Ready for early adopters<br>• Can create SEVs                                    | • Open to anyone<br>• Scaled onboarding with some priority support<br>• Community forums with priority response<br>• Individual customer SLAs available |
| Production   | • Stable APIs<br>• Full documentation<br>• Backward compatibility maintained<br>• Can create SEVs                                | • Public availability<br>• Production quality onboarding<br>• Standard support options<br>• Standard SLAs apply                                         |
| Deprecated   | • Still functional but not recommended<br>• Security patches only<br>• Migration path documented<br>• End-of-life date announced | • New customers discouraged or not allowed<br>• Migration assistance available<br>• Limited support<br>• Reduced SLAs, no new SLAs established          |
| Unsupported  | • No longer maintained<br>• No security patches<br>• No support available<br>• May stop working at any time                      | • No commitments<br>• Use at your own risk<br>• No support<br>• No SLAs                                                                                 |

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
