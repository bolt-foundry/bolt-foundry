# Bolt Foundry Project Status

This document provides a centralized view of all active projects across Bolt
Foundry. It serves as a quick reference for overall project status and progress
toward company milestones.

Last Updated: January 2025

For detailed product roadmap and milestones, see [Product Plan](/docs/product-plan.md).

## Status Overview Table

### Applications

| Project Name     | Current Version | Status      | Next Milestone                         | Description                                               | Owner |
| ---------------- | --------------- | ----------- | -------------------------------------- | --------------------------------------------------------- | ----- |
| bfDb             | 0.0.3           | ON HOLD ⏱️  | Expand barrel system for GraphQL types | Database ORM with multi-backend support & GraphQL         | -     |
| bfDs             | -               | ACTIVE 🚀   | Component documentation                | Design system with React components                       | -     |
| boltFoundry      | -               | ACTIVE 🚀   | User onboarding improvements           | Main web application with Isograph GraphQL               | -     |
| collector        | 0.0.1           | COMPLETE ✅ | Future roadmap expansion               | LLM usage analytics collector                             | -     |
| contacts         | 1.0.0           | DEPRECATED 🚫 | Migrate waitlist to bfDb              | CRM application with email integration                    | -     |
| internalbf       | -               | ACTIVE 🚀   | Bot feature additions                  | Discord bot and internal tools                            | -     |
| web              | -               | ACTIVE 🚀   | Performance optimizations              | Core web server and routing system                        | -     |

### Packages

| Project Name     | Current Version | Status      | Next Milestone                         | Description                                               | Owner |
| ---------------- | --------------- | ----------- | -------------------------------------- | --------------------------------------------------------- | ----- |
| bolt-foundry     | 0.1.0           | ACTIVE 🚀   | Fix NextJS example & documentation     | Core SDK for AI-powered applications                      | -     |
| get-configuration-var | 0.1.0      | ACTIVE 🚀   | Documentation improvements             | Secure configuration management                           | -     |
| logger           | 0.1.0           | ACTIVE 🚀   | Feature stability                      | Centralized logging utilities                             | -     |

## Current Focus

Bolt Foundry is building the **Operating System for LLMs**. Our current priorities for v0.1 are:

1. **Examples & Documentation** - Fixing the NextJS sample application with proper TypeScript support and build process
2. **Developer Experience** - Creating clear, working examples that demonstrate Bolt Foundry capabilities
3. **Core SDK Stability** - Ensuring the bolt-foundry package (v0.1.0) provides a solid foundation

### Active Work (v0.1)
- Fixing TypeScript issues in NextJS example
- Adding proper build documentation
- Creating deployment examples
- Improving developer onboarding experience

## Notes

- The bolt-foundry library is actively being developed with focus on examples for v0.1
- The Collector (v0.0.1) provides foundational analytics that will expand with future product features
- GraphQL Builder (v0.0.3) has core functionality but is on hold pending v0.0.4 improvements
- **Contacts app is deprecated** - Waitlist functionality needs to be migrated to bfDb with GraphQL integration
- Project ownership assignments are pending team expansion
- For detailed 2025 roadmap including Alpha, Private Beta, and Public Beta phases, see [Product Plan](/docs/product-plan.md)
- Individual project status is tracked in their respective docs directories when available
