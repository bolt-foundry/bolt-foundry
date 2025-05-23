# Backlog Management Protocol

This behavior card defines the process for managing and documenting future work
items that are currently out of scope but may be implemented in future versions.

## Purpose

The backlog serves as a structured collection of potential features,
enhancements, and improvements that have been identified but are not scheduled
for immediate implementation. It helps maintain visibility of potential future
work while keeping current implementation plans focused.

## Backlog Structure

Backlogs can be organized in two main ways depending on the complexity of the
items:

### 1. Simple Backlog Lists

For straightforward backlog items that can be documented in a single file:

#### Location

- Project-level backlogs should be stored in `apps/[project]/docs/backlog.md`
- Version-specific deferred items should be documented in
  `apps/[project]/docs/[version]/backlog.md`

#### Organization

Backlog items should be organized by:

1. **Priority**: High/Medium/Low
2. **Type**: Feature/Enhancement/Bug/Technical Debt
3. **Complexity**: Simple/Moderate/Complex
4. **Target Version**: The anticipated version when the item might be
   implemented

### 2. Feature-Focused Backlog Structure

For more complex features that require multiple related documents:

#### Location

Complex backlog features should be stored in the top-level backlog directory:

```
docs/backlog/
├── README.md                    (Structure explanation)
├── feature-name/                (Directory for a specific feature)
│   ├── project-plan.md          (User-focused goals and vision)
│   ├── implementation-plan.md   (Technical approach and strategy)
│   └── supporting-docs/         (Research, diagrams, etc.)
└── ...
```

#### When to Use Feature Directories

Use the feature directory structure when:

1. A potential feature requires detailed planning before it can be considered
   for the roadmap
2. Multiple related documents are needed to fully describe the feature
3. The feature might be complex enough to warrant versioned implementation plans
4. Collaborative discussion and iteration on the feature design is expected

## Backlog Item Documentation Format

### For Simple Backlog Lists

Each backlog item should include:

```markdown
### [Item Name]

**Priority**: [High/Medium/Low] **Type**: [Feature/Enhancement/Bug/Technical
Debt] **Complexity**: [Simple/Moderate/Complex] **Target Version**: [e.g., 0.3
or Future]

**Description**: Brief description of the backlog item.

**Justification**: Why this item should be considered for future implementation.

**Dependencies**: Any dependencies or prerequisites needed.

**Acceptance Criteria**: What would constitute a successful implementation.

**Why aren't we working on this yet?** Explaining why we haven't started working
on it yet.
```

### For Feature Directories

Each feature directory should contain at minimum:

1. `project-plan.md` - Describing the user-focused goals and vision
2. `implementation-plan.md` - Outlining the technical approach and
   implementation strategy

Additional supporting documents can be included as needed in a
`supporting-docs/` subdirectory.

## Backlog Review Process

1. **Regular Reviews**: The backlog should be reviewed at the end of each
   implementation cycle
2. **Promotion**: Items can be promoted from the backlog into an upcoming
   version's implementation plan
3. **Deferral**: Items from the current version that can't be completed should
   be moved to the backlog
4. **Pruning**: Items that are no longer relevant should be removed or archived

## Relationship with Implementation Plans

- Implementation plans focus on what WILL be built in the current version
- Backlogs document what MIGHT be built in future versions
- Items should move from backlog → implementation plan when they come into scope

## Example Structures

### Simple Backlog Structure

```
apps/project-name/
  └── docs/
      ├── project-plan.md             (Overall vision)
      ├── implementation-plan.md      (Cross-version strategy)
      ├── backlog.md                  (Potential future work)
      ├── 0.1/
      │   ├── implementation-plan.md  (Version 0.1 details)
      │   └── backlog.md              (Items deferred from 0.1)
      └── 0.2/
          ├── implementation-plan.md  (Version 0.2 details)
          └── backlog.md              (Items deferred from 0.2)
```

### Feature-Focused Backlog Structure

```
docs/backlog/
├── README.md
├── feature-a/
│   ├── project-plan.md
│   ├── implementation-plan.md
│   └── supporting-docs/
│       ├── research.md
│       └── diagrams/
├── feature-b/
│   ├── project-plan.md
│   └── implementation-plan.md
└── ...
```

## Best Practices

1. **Be Specific**: Backlog items should be specific enough to be actionable
2. **Provide Context**: Include enough context for future developers to
   understand the item
3. **Link Related Items**: Cross-reference related backlog items
4. **Avoid Scope Creep**: Don't use the backlog as a dumping ground - items
   should be valuable
5. **Regular Triage**: Periodically review and prioritize items to keep the
   backlog fresh
6. **Choose the Right Format**: Use simple backlog items for straightforward
   work and feature directories for complex features

Remember that a well-maintained backlog provides a roadmap for future
development while helping the team stay focused on current priorities.
