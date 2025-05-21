# Bolt Foundry Project Status

This document provides a centralized view of all active projects across Bolt
Foundry. It serves as a quick reference for overall project status and progress
toward company milestones.

Current status overview

## Status Overview Table

| Project Name      | Current Version | Status      | Next Milestone                         | Key Files                                                                                                                                  | Owner   |
| ----------------- | --------------- | ----------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------- |
| bolt-foundry lib  | 0.2 → 0.3       | PLANNING ⏱️ | Project plan and implementation design | [Project Plan](/packages/bolt-foundry/docs/project-plan.md), [Implementation Plan](/packages/bolt-foundry/docs/0.3/implementation-plan.md) | -       |
| GraphQL Builder   | 0.3 → 0.4       | ON HOLD ⏱️  | Expand barrel system for GraphQL types | [Implementation Plan](/apps/bfDb/docs/0.3/implementation-plan.md), [Status](/apps/bfDb/docs/status.md)                                     | -       |
| Login Integration | 0.1             | ON HOLD ⏱️  | Implement Google OAuth login           | [Project Plan](/apps/boltFoundry/docs/login/project-plan.md)                                                                               | Randall |
| Collector         | 0.1             | ON HOLD ⏱️  | Pending product rethinking             | [Implementation Plan](/apps/collector/docs/0.1/implementation-plan.md), [Status](/apps/collector/docs/status.md)                           | -       |
| BfDB              | 0.1             | ON HOLD ⏱️  | Relation builder improvements          | [Status](/apps/bfDb/docs/backlog.md)                                                                                                       | -       |

## Milestone Progress

Current company milestone: **Updating bolt-foundry library**

- ✅ **0.0** → Metrics flowing through PostHog
- ⏱️ **0.1** → Users can log in with Google (ON HOLD)
- ⏱️ **0.2** → Collect requests and responses in our system (bfdb), for multiple
  organizations (ON HOLD)
- ⏱️ **0.3** → Structured prompt generator for persona and behavior cards (ON
  HOLD)
- ⏱️ **0.4** → Generate persona card, behavior card, and reconciled samples (ON
  HOLD)
- ⏱️ **0.5** → Reconcile generated response samples (ON HOLD)

## Notes

- All projects except bolt-foundry library are currently on hold while we focus
  on updating the bolt-foundry library in the packages directory
- Project ownership should be added to the table as it becomes formalized
- Status updates should be synchronized with implementation status documentation
- Projects are primarily tracked through their respective documentation in
  `apps/[project]/docs/` and `packages/[project]/docs/`
