# Bolt Foundry Project Status

This document provides a centralized view of all active projects across Bolt
Foundry. It serves as a quick reference for overall project status and progress
toward company milestones.

Last Updated: January 2025

For detailed product roadmap and milestones, see
[Product Plan](/docs/product-plan.md).

## Current Focus

Bolt Foundry is building the **Operating System for LLMs**. Our current
priorities for v0.1 are:

| Priority | Focus Area               | Description                                                                           | Active Work                                                                         |
| -------- | ------------------------ | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| P0       | Examples & Documentation | Fixing the NextJS sample application with proper TypeScript support and build process | • Fixing TypeScript issues in NextJS example<br>• Adding proper build documentation |
| P1.1     | Developer Experience     | Creating clear, working examples that demonstrate Bolt Foundry capabilities           | • Creating deployment examples<br>• Improving developer onboarding experience       |
| P1.2     | Core SDK Stability       | Ensuring the bolt-foundry package (v0.1.0) provides a solid foundation                | • Stabilizing API interfaces<br>• Adding comprehensive tests                        |

## Status Overview Table

_For definitions of project states (Alpha, Beta, Launched) and status
indicators, see [WUT](/docs/wut.md#project-states)._

### In Progress 🚀

| Project Name | Type    | Current Version | State             | Next Milestone                     | Priority Link | Description                          |
| ------------ | ------- | --------------- | ----------------- | ---------------------------------- | ------------- | ------------------------------------ |
| bolt-foundry | Package | 0.1.0           | Alpha (Tech Demo) | Fix NextJS example & documentation | P0            | Core SDK for AI-powered applications |

### Stable (Not Currently Prioritized) 🟢

| Project Name          | Type    | Current Version | State             | Next Milestone               | Description                                |
| --------------------- | ------- | --------------- | ----------------- | ---------------------------- | ------------------------------------------ |
| bfDs                  | App     | -               | Alpha (Tech Demo) | Component documentation      | Design system with React components        |
| boltFoundry           | App     | -               | Alpha (Tech Demo) | User onboarding improvements | Main web application with Isograph GraphQL |
| internalbf            | App     | -               | Launched          | Bot feature additions        | Discord bot and internal tools             |
| web                   | App     | -               | Launched          | Performance optimizations    | Core web server and routing system         |
| get-configuration-var | Package | 0.1.0           | Launched          | Documentation improvements   | Secure configuration management            |
| logger                | Package | 0.1.0           | Launched          | Feature stability            | Centralized logging utilities              |

### On Hold ⏱️

| Project Name | Type | Current Version | State             | Next Milestone                         | Description                                       |
| ------------ | ---- | --------------- | ----------------- | -------------------------------------- | ------------------------------------------------- |
| bfDb         | App  | 0.0.3           | Alpha (Tech Demo) | Expand barrel system for GraphQL types | Database ORM with multi-backend support & GraphQL |

### Complete ✅

| Project Name | Type | Current Version | State    | Next Milestone           | Description                   |
| ------------ | ---- | --------------- | -------- | ------------------------ | ----------------------------- |
| collector    | App  | 0.0.1           | Launched | Future roadmap expansion | LLM usage analytics collector |

### Deprecated 🚫

| Project Name | Type | Current Version | State        | Migration Plan           | Description                            |
| ------------ | ---- | --------------- | ------------ | ------------------------ | -------------------------------------- |
| contacts     | App  | 1.0.0           | Private Beta | Migrate waitlist to bfDb | CRM application with email integration |

## Notes

- The bolt-foundry library is actively being developed with focus on examples
  for v0.1
- The Collector (v0.0.1) provides foundational analytics that will expand with
  future product features
- GraphQL Builder (v0.0.3) has core functionality but is on hold pending v0.0.4
  improvements
- **Contacts app is deprecated** - Waitlist functionality needs to be migrated
  to bfDb with GraphQL integration
- For detailed 2025 roadmap including Alpha, Private Beta, and Public Beta
  phases, see [Product Plan](/docs/product-plan.md)
- Individual project status is tracked in their respective docs directories when
  available
