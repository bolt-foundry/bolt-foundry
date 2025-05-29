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

## Priority Projects

_For definitions of project phases and priority levels, see
[WUT](/docs/wut.md#project-phases) and [WUT](/docs/wut.md#priority-system)._

| Priority | Project Name          | Project Phase | Status | Next Milestone                | Description                          | References                                                                                         |
| -------- | --------------------- | ------------- | ------ | ----------------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- |
| P0       | examples              | Pre-alpha     | 🚀     | Fix NextJS TypeScript & build | Working examples demonstrating SDK   | [README](../examples/README.md), [NextJS](../examples/nextjs-sample/README.md)                     |
| P1       | packages/bolt-foundry | Alpha         | 🚀     | Stabilize API interfaces      | Core SDK for AI-powered applications | [NPM](https://www.npmjs.com/package/@bolt-foundry/sdk), [Docs](../packages/bolt-foundry/README.md) |

## Other Projects

| Project Name                   | Project Phase | Status | Next Milestone                         | Description                                       | References                                                                      |
| ------------------------------ | ------------- | ------ | -------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| apps/bfDs                      | Alpha         | 🟢     | Component documentation                | Design system with React components               | [Components](../apps/bfDs/components/)                                          |
| apps/boltFoundry               | Alpha         | 🟢     | User onboarding improvements           | Main web application with Isograph GraphQL        | [Routes](../apps/boltFoundry/routes.ts)                                         |
| apps/internalbf                | Production    | 🟢     | Bot feature additions                  | Discord bot and internal tools                    | [Code](../apps/internalbf/)                                                     |
| apps/web                       | Production    | 🟢     | Performance optimizations              | Core web server and routing system                | [Web server](../apps/web/web.tsx)                                               |
| packages/get-configuration-var | Production    | 🟢     | Documentation improvements             | Secure configuration management                   | [NPM](https://www.npmjs.com/package/@bolt-foundry/get-configuration-var)        |
| packages/logger                | Production    | 🟢     | Feature stability                      | Centralized logging utilities                     | [NPM](https://www.npmjs.com/package/@bolt-foundry/logger)                       |
| apps/bfDb                      | Alpha         | ⏱️     | Expand barrel system for GraphQL types | Database ORM with multi-backend support & GraphQL | [README](../apps/bfDb/docs/0.3/data-model.md), [GraphQL](../apps/bfDb/graphql/) |
| apps/collector                 | Production    | ✅     | Future roadmap expansion               | LLM usage analytics collector                     | [Status](../apps/collector/docs/status.md)                                      |
| apps/contacts                  | Private Beta  | 🚫     | Migrate waitlist to bfDb               | CRM application with email integration            | [Server](../apps/contacts/server.ts)                                            |

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
