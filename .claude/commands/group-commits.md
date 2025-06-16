---
name: group-commits
description: Analyze uncommitted changes and suggest logical commit groupings
---

# Group Commits

Analyzes uncommitted changes and suggests how to group them into logical, atomic
commits.

## Usage

Run `sl diff` to see all changes, then analyze them to identify:

- Distinct features or fixes
- Dependencies between changes
- Related functionality that should stay together

## Output

The command will suggest commit groups ordered by dependencies:

1. Infrastructure/utilities (least dependent)
2. Core features
3. Integration code
4. Tests and documentation

Each group should:

- Have a single, clear purpose
- Build and test independently
- Include all files needed for that feature
