# Bolt Foundry Project Status

This document provides a centralized view of all active projects across Bolt
Foundry. It serves as a quick reference for overall project status and progress
toward company milestones.

Last Updated: July 14, 2025

For detailed product roadmap and milestones, see [Product Plan](/404.md).

## Current Focus

Bolt Foundry is building the **Customer Success Platform for AI**. Our mission
is to make AI systems continuously improve through customer feedback, creating
reliable, customer-centric AI that gets better every day.

Our current priorities focus on customer success outcomes:

| Priority | Focus Area                   | Description                                                             | Active Work                                                         |
| -------- | ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------- |
| P0       | Customer Success Validation  | Proving customer success value through real customer implementations    | example-customer.com invoice extraction pipeline with >90% accuracy |
| P1       | RLHF Workflow Infrastructure | Building systematic customer feedback-to-AI improvement workflows       | Enhanced prompt iteration tools and customer feedback processing    |
| P2       | Business Value Measurement   | Demonstrating measurable ROI through customer satisfaction improvements | Success metrics tracking and customer satisfaction analytics        |

## Priority Projects

_For definitions of project phases and priority levels, see [WUT](/404.md) and
[WUT](/404.md)._

| Priority | Project Name                    | Project Phase | Status | Next Milestone                        | Description                                    | References                                                                             |
| -------- | ------------------------------- | ------------- | ------ | ------------------------------------- | ---------------------------------------------- | -------------------------------------------------------------------------------------- |
| P0       | Customer Success Implementation | Alpha         | 🚀     | >90% extraction accuracy achieved     | example-customer.com invoice extraction system | [Customer Success Plan](../plans/2025-07-14-customer-success-prompt-iteration-plan.md) |
| P1       | RLHF Workflow Platform          | Alpha         | 🟢     | Enhanced prompt iteration interface   | Customer feedback-to-AI improvement workflow   | [Business Vision](./business-vision.md), [Company Vision](./company-vision.md)         |
| P2       | Customer Success Analytics      | Alpha         | 🟢     | Customer satisfaction tracking system | Measurable customer success outcomes           | [Business Vision](./business-vision.md)                                                |

## Supporting Infrastructure

| Project Name                   | Project Phase | Status | Next Milestone                        | Description                                    | References                                                               |
| ------------------------------ | ------------- | ------ | ------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------ |
| apps/aibff                     | Alpha         | 🚀     | Customer-specific extraction pipeline | AI prompt testing and iteration platform       | [GUI](../../apps/aibff/gui/README.md)                                    |
| apps/boltFoundry               | Alpha         | 🟢     | Customer success dashboard            | Customer success platform web application      | [Routes](/404.md), [Docs](https://boltfoundry.com/docs)                  |
| apps/bfDs                      | Alpha         | 🟢     | Customer success UI components        | Design system for customer success interfaces  | [Components](/404.md)                                                    |
| apps/bfDb                      | Alpha         | 🟢     | Customer feedback data model          | Database system for customer success metrics   | [README](../../apps/bfDb/memos/guides/data-model.md), [GraphQL](/404.md) |
| apps/collector                 | Production    | 🟢     | Customer satisfaction analytics       | Customer feedback and satisfaction tracking    | [Status](../../apps/collector/memos/guides/status.md)                    |
| apps/web                       | Production    | 🟢     | Customer success API endpoints        | Core web server and customer success routing   | [Web server](/404.md)                                                    |
| packages/get-configuration-var | Production    | 🟢     | Customer deployment configurations    | Secure configuration for customer environments | [NPM](https://www.npmjs.com/package/@bolt-foundry/get-configuration-var) |
| packages/logger                | Production    | 🟢     | Customer success event logging        | Centralized logging for customer interactions  | [NPM](https://www.npmjs.com/package/@bolt-foundry/logger)                |
| apps/internalbf                | Production    | 🟢     | Customer success team tools           | Internal tools for customer success operations | [Code](/404.md)                                                          |

## Notes

- **Customer Success Implementation** is actively driving development through
  real customer validation with example-customer.com
- **aibff platform** is being enhanced with customer-specific extraction
  pipelines and prompt iteration workflows
- **RLHF Workflow System** provides the foundation for systematic customer
  feedback-to-AI improvement processes
- **Customer Success Analytics** will track measurable customer satisfaction
  improvements and business value
- **Credit-based Revenue Model** supports usage-based pricing for customer
  feedback processing and AI optimization services
- The Collector provides foundational customer feedback analytics that will
  expand with future customer success features
- **Prompt Iteration Platform** enables customers to independently test and
  improve AI responses based on customer feedback
- For detailed customer success roadmap including Alpha, Private Beta, and
  Public Beta phases, see [Product Plan](/404.md)
- Individual project status is tracked in their respective docs directories when
  available
