# Document Ordering System Design

## Overview

Implement a flexible document ordering system that uses folder structure by
default but allows customization through `config.toml` files in each directory.
This gives automatic discovery of new documents while maintaining control over
presentation order.

## Design

### Directory Structure Example

```
docs/guides/
├── config.toml              # Root configuration
├── 01-getting-started/
│   ├── config.toml         # Section configuration
│   ├── README.md
│   ├── quickstart.md
│   └── installation.md
├── 02-development/
│   ├── config.toml
│   ├── coding-standards.md
│   └── testing.md
└── 03-reference/
    ├── api.md
    └── cli.md
```

### config.toml Format

```toml
# Section metadata
[section]
title = "Getting Started"
description = "Begin your journey"

# Document ordering (optional)
[[documents]]
slug = "README"
title = "Overview"

[[documents]]
slug = "quickstart"
title = "Quick Start Guide"

# Hide specific files (optional)
[settings]
hidden = ["draft.md", "old-version.md"]
```

### Ordering Rules

1. **Directories**:
   - Numbered prefixes (01-, 02-) for explicit ordering
   - Alphabetical otherwise

2. **Documents within directory**:
   - If config.toml exists: Use specified order
   - Otherwise: Alphabetical by filename

3. **Special cases**:
   - README.md always first if no config
   - Hidden files never appear

## Implementation Plan

### 1. Update Document Model

- Add `path` field to track full path
- Add `section` field for grouping
- Add `order` field for sorting

### 2. Create DocumentStructure Type

```typescript
interface DocumentSection {
  title: string;
  slug: string;
  description?: string;
  documents: Array<DocumentInfo>;
  subsections: Array<DocumentSection>;
}

interface DocumentInfo {
  slug: string;
  title: string;
  path: string;
}
```

### 3. Add Structure Discovery

- Recursive directory traversal
- TOML parsing for config files
- Merge automatic discovery with manual config

### 4. Update GraphQL Schema

- Add `documentStructure` query returning hierarchical data
- Keep existing flat queries for compatibility

## Benefits

1. **Automatic**: New docs appear without configuration
2. **Flexible**: Override when needed
3. **Maintainable**: Config lives with content
4. **Scalable**: Works with deep hierarchies
5. **Backwards Compatible**: Existing queries continue working
