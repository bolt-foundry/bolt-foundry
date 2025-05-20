# Backlog Feature Directory Structure

This directory contains potential features, enhancements, and changes that are
not currently on the roadmap but are being considered for future implementation.

## Purpose

The feature-focused backlog structure helps organize and document potential work
more comprehensively than simple backlog items. When a potential feature
requires multiple related documents (project plans, implementation plans,
research, etc.), it should be organized in its own directory rather than as a
single entry in a backlog list.

## Directory Structure

```
backlog/
├── README.md                    (This file)
├── feature-name/                (Directory for a specific feature)
│   ├── project-plan.md          (User-focused goals and vision)
│   ├── implementation-plan.md   (Technical approach and strategy)
│   └── supporting-docs/         (Research, diagrams, etc.)
├── another-feature/
│   ├── project-plan.md
│   └── implementation-plan.md
└── ...
```

## When to Use Feature Directories

Use this structure when:

1. A potential feature requires detailed planning before it can be considered
   for the roadmap
2. Multiple related documents are needed to fully describe the feature
3. The feature might be complex enough to warrant versioned implementation plans
4. Collaborative discussion and iteration on the feature design is expected

## Feature Directory Template

Each feature directory should contain at minimum:

1. `project-plan.md` - Describing the user-focused goals and vision
2. `implementation-plan.md` - Outlining the technical approach and
   implementation strategy

You can include additional supporting documents as needed, such as:

- Research findings
- Technical specifications
- Architecture diagrams
- UI mockups
- Competitive analysis

## Relationship to Project Roadmap

Features in this backlog are **not currently scheduled** for implementation.
When a feature is approved for the roadmap:

1. The feature directory can be moved to the appropriate project structure
2. The plans can be refined and versioned as needed
3. Implementation work can begin based on the established plans

## Managing the Backlog

Follow the
[Backlog Management Protocol](../cards/behaviors/backlog-management.bhc.md) for
guidelines on:

- Adding items to the backlog
- Reviewing and prioritizing backlog items
- Promoting items from backlog to implementation plans
- Deferring items from current plans to the backlog
