# BF Product Plan 2025

## Objective

_Improve the reliability of customers' LLM capabilities by building an
evaluation and observability pipeline that enables continuous improvement._

## Next step

0.1 is in progress. Randall is currently implementing it by doing the plan
outlined in
[apps/boltFoundry/login/product-plan](../apps/boltFoundry/docs/login/project-plan.md)

## Milestones

- **0.0 →** Metrics flowing through PostHog.
- **0.1 →** Users can log in with Google
  - Metric: Unique users
- **0.2 →** Collect requests and responses in our system (bfdb), for multiple
  organizations.
  - Metric: Samples ingested
- **0.3** **→** Structured prompt generator to more easily generate the persona
  and behavior cards. Structured inputs get filled into mustache bracket
  templates.
  - Metric: Structured calls made
- **0.4 →** Generate the persona card, behavior card, and reconciled samples
  for a specific, narrow use case of the prompt.
  - Metric: Cards generated
- **0.5** **→** Reconcile generated response samples against established
  persona and behavior card principles.
  - Metric: Samples reconciled
- **0.6** **→** Backtesting. If I give it a certain prompt or persona card, and
  run it 100 times, is it better or the same? (Based on RLHF).
  - TBD
- **0.7 →** Heatmap. ?
- **0.8 →** We are actively delivering ongoing value. (Advance to v1.0).
  - Metric: DAP

## Out of scope

- Lightweight experimentation framework

## Success metrics

_Our core success metric ultimately will be the **number of reconciled samples**
— meaning real-world examples that have been reviewed, evaluated, and made
actionable for iteration._

Along the way we'll track specific metrics by version as follows:

- 0.1 → Unique users
- 0.2 → Samples ingested
- 0.3 → Structured calls made
- 0.4 → Cards generated
- 0.5 → Samples reconciled
- 0.6 / 0.7 → (Heatmap / Backtest) ?
- 0.8 → DAP

For reference, a sample is reconciled when:

1. The AI agent’s behavior in the sample has been captured.
2. The sample is then judged against the persona + behavior cards and links the
   specific principles to the individual samples
3. It has a clear score or rating (+3 to -3)
