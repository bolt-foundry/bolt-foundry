# Bolt Foundry Project Status

This document provides a centralized view of all active projects across Bolt
Foundry. It serves as a quick reference for overall project status and progress
toward company milestones.

Current status overview

## Status Overview Table

| Project Name      | Current Version | Status      | Next Milestone                        | Key Files                                                                                                        | Owner   |
| ----------------- | --------------- | ----------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------- |
| GraphQL Builder   | 0.1             | In Progress | Migrate existing nodes to new builder | [Implementation Plan](/apps/bfDb/docs/0.1/implementation-plan.md), [Status](/apps/bfDb/docs/status.md)           | -       |
| Login Integration | 0.1             | Blocked     | Waiting on GraphQL Builder completion | [Project Plan](/apps/boltFoundry/docs/login/project-plan.md)                                                     | Randall |
| Collector         | 0.1             | Paused      | Pending product rethinking            | [Implementation Plan](/apps/collector/docs/0.1/implementation-plan.md), [Status](/apps/collector/docs/status.md) | -       |
| BfDB              | 0.1             | Stabilizing | Relation builder improvements         | [Status](/apps/bfDb/docs/backlog.md)                                                                             | -       |

## Milestone Progress

Current company milestone: **0.1 → Users can log in with Google**

- ✅ **0.0** → Metrics flowing through PostHog
- 🔄 **0.1** → Users can log in with Google (In Progress)
- 📅 **0.2** → Collect requests and responses in our system (bfdb), for multiple
  organizations
- 📅 **0.3** → Structured prompt generator for persona and behavior cards
- 📅 **0.4** → Generate persona card, behavior card, and reconciled samples
- 📅 **0.5** → Reconcile generated response samples

## Notes

- Project ownership should be added to the table as it becomes formalized
- Status updates should be synchronized with implementation status documentation
- Projects are primarily tracked through their respective documentation in
  `apps/[project]/docs/`
