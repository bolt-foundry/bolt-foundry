# BF Product Plan 2025

## Objective

_Improve the reliability of customers' LLM capabilities by building an
evaluation and observability pipeline that enables continuous improvement._

## Next step

0.1 is in progress. Randall is currently implementing it by doing the plan
outlined in [apps/boltFoundry/login/product-plan](../apps/boltFoundry/docs/login/project-plan.md)

## Milestones

- **0.0 →** Metrics flowing through PostHog.
- **0.1 →** Collect requests and responses and keep them in our system, for
  multiple organizations.
- **0.2** **→** Structured prompt generator to more easily generate the identity
  and behavior cards. Structured inputs get filled into mustache bracket
  templates.
- **0.3 →** Generate the identity card, behavior card, and reconciled samples
  for a specific, narrow use case of the prompt.
- **0.4** **→** Reconcile generated response samples against established
  identity and behavior card principles.
- **0.5** **→** Backtesting. If I give it a certain prompt or identity card, and
  run it 100 times, is it better or the same? (Based on RLHF).
- **0.6 →** We are actively delivering ongoing value. (Advance to v1.0).

## Out of scope

- Lightweight experimentation framework

## Success metrics

_Our core success metric is the **number of reconciled samples** — meaning
real-world examples that have been reviewed, evaluated, and made actionable for
iteration._

A sample is reconciled when:

1. The AI agent’s behavior in the sample has been captured.
2. The sample is then judged against the identity + behavior cards and links the
   specific principles to the individual samples
3. It has a clear score or rating (+3 to -3)
