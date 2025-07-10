# Bolt Foundry Project Status

This document provides a centralized view of all active projects across Bolt
Foundry. It serves as a quick reference for overall project status and progress
toward company milestones.

Last Updated: January 29, 2025

For detailed product roadmap and milestones, see [Product Plan](/404.md).

## Current Focus

Bolt Foundry is building the **Operating System for LLMs**. Our current
priorities for v0.1 are:

| Priority | Focus Area             | Description                                                                 | Active Work                                                     |
| -------- | ---------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------- |
| P0       | Developer Experience   | Creating clear, working examples that demonstrate Bolt Foundry capabilities | Creating deployment examples and improving developer onboarding |
| P1       | Core SDK Stability     | Ensuring the bolt-foundry package (v0.1.0) provides a solid foundation      | Stabilizing API interfaces and adding comprehensive tests       |
| P2       | Documentation & Guides | Interactive documentation and developer guides for SDK adoption             | Building interactive demos and improving getting started guides |

## Priority Projects

_For definitions of project phases and priority levels, see [WUT](/404.md) and
[WUT](/404.md)._

| Priority | Project Name          | Project Phase | Status | Next Milestone            | Description                          | References                                                                                           |
| -------- | --------------------- | ------------- | ------ | ------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| P0       | examples              | Alpha         | 🟢     | Add more example patterns | Working examples demonstrating SDK   | [README](../../docs/guides/README.md), [NextJS](../../docs/guides/README.md)                         |
| P1       | packages/bolt-foundry | Alpha         | 🚀     | Stabilize API interfaces  | Core SDK for AI-powered applications | [NPM](https://www.npmjs.com/package/@bolt-foundry/bolt-foundry), [Docs](../../docs/guides/README.md) |

## Other Projects

| Project Name                   | Project Phase | Status | Next Milestone                         | Description                                       | References                                                               |
| ------------------------------ | ------------- | ------ | -------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------ |
| apps/bfDs                      | Alpha         | 🟢     | Component documentation                | Design system with React components               | [Components](/404.md)                                                    |
| apps/boltFoundry               | Alpha         | 🟢     | User onboarding improvements           | Main web application with Isograph GraphQL        | [Routes](/404.md), [Docs](https://boltfoundry.com/docs)                  |
| apps/internalbf                | Production    | 🟢     | Bot feature additions                  | Discord bot and internal tools                    | [Code](/404.md)                                                          |
| apps/web                       | Production    | 🟢     | Performance optimizations              | Core web server and routing system                | [Web server](/404.md)                                                    |
| packages/get-configuration-var | Production    | 🟢     | Documentation improvements             | Secure configuration management                   | [NPM](https://www.npmjs.com/package/@bolt-foundry/get-configuration-var) |
| packages/logger                | Production    | 🟢     | Feature stability                      | Centralized logging utilities                     | [NPM](https://www.npmjs.com/package/@bolt-foundry/logger)                |
| apps/bfDb                      | Alpha         | ⏱️     | Expand barrel system for GraphQL types | Database ORM with multi-backend support & GraphQL | [README](../../apps/bfDb/memos/guides/data-model.md), [GraphQL](/404.md) |
| apps/collector                 | Production    | ✅     | Future roadmap expansion               | LLM usage analytics collector                     | [Status](../../apps/collector/memos/guides/status.md)                    |
| apps/contacts                  | Private Beta  | 🚫     | Migrate waitlist to bfDb               | CRM application with email integration            | [Server](/404.md)                                                        |

## Notes

- **NextJS example** is now working with proper TypeScript support and build
  process
- The bolt-foundry library is actively being developed with focus on API
  stability for v0.1
- Documentation site now includes interactive examples at
  [/docs](https://boltfoundry.com/docs)
- The Collector (v0.0.1) provides foundational analytics that will expand with
  future product features
- GraphQL Builder (v0.0.3) has core functionality but is on hold pending v0.0.4
  improvements
- **Contacts app is deprecated** - Waitlist functionality needs to be migrated
  to bfDb with GraphQL integration
- For detailed 2025 roadmap including Alpha, Private Beta, and Public Beta
  phases, see [Product Plan](/404.md)
- Individual project status is tracked in their respective docs directories when
  available
