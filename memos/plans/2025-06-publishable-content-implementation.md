# PublishableContent Base Class Implementation Plan

## Overview

This work creates a unified base class for all publishable content types (blog
posts, documentation, etc.) in the GraphQL API. By extracting common
functionality from BlogPost and PublishedDocument into a shared
PublishableContent base class, we'll eliminate code duplication and provide a
consistent API for all content types. This enables docs to have the same
powerful querying capabilities as blog posts, including connections, pagination,
and filtering.

## Goals

| Goal                                 | Description                                                      | Success Criteria                          |
| ------------------------------------ | ---------------------------------------------------------------- | ----------------------------------------- |
| Create PublishableContent base class | Extract common functionality from BlogPost and PublishedDocument | Base class with shared fields and methods |
| Migrate existing content types       | Update BlogPost and Document to extend PublishableContent        | Both types work with no breaking changes  |
| Add docs connection query            | Enable listing/pagination for documentation                      | `documents` query with relay connections  |
| Unify content loading                | Single approach for loading markdown content                     | Shared caching and file reading logic     |

## Anti-Goals

| Anti-Goal                       | Reason                                            |
| ------------------------------- | ------------------------------------------------- |
| Breaking existing queries       | Need backward compatibility for current consumers |
| Adding complex metadata parsing | Keep scope focused on inheritance refactor        |
| Changing file storage structure | Minimize migration complexity                     |
| Creating new content types      | Focus on refactoring existing types first         |

## Technical Approach

The core insight is that BlogPost and PublishedDocument are nearly identical -
both load markdown files from disk, cache them, and expose content through
GraphQL. By creating a PublishableContent abstract base class, we can share this
common functionality while allowing each content type to specify its own
directory and add type-specific fields.

The base class will handle:

- File loading and caching
- Basic GraphQL fields (id, content, slug)
- Common query patterns (findX, listAll)
- Connection/pagination support

Subclasses will provide:

- Content directory path
- Type-specific fields or methods
- Custom filtering logic if needed

## Components

| Status | Component                     | Purpose                                             |
| ------ | ----------------------------- | --------------------------------------------------- |
| [ ]    | PublishableContent base class | Abstract base with common fields and file loading   |
| [ ]    | Updated BlogPost class        | Extends PublishableContent, maintains current API   |
| [ ]    | Updated Document class        | Extends PublishableContent, adds connection support |
| [ ]    | Query.documents field         | New connection query for documentation              |
| [ ]    | Tests for PublishableContent  | Verify shared functionality works correctly         |
| [ ]    | Tests for migration           | Ensure no breaking changes                          |

## Technical Decisions

| Decision                          | Reasoning                                     | Alternatives Considered                       |
| --------------------------------- | --------------------------------------------- | --------------------------------------------- |
| Abstract class vs interface       | Need shared implementation, not just contract | Pure interface would require duplicating code |
| Keep separate content directories | Minimize migration, clear separation          | Single directory with type field              |
| Reuse existing GraphQLNode base   | Already provides Node interface compliance    | Create new base class hierarchy               |
| Cache at instance level           | Match current BlogPost pattern                | Global cache or no caching                    |

## Next Steps

| Question                             | How to Explore                                               |
| ------------------------------------ | ------------------------------------------------------------ |
| What fields should be in base class? | Analyze common fields between BlogPost and PublishedDocument |
| How to handle type-specific queries? | Review current query patterns and requirements               |
| Should we add frontmatter parsing?   | Check if any existing content uses frontmatter               |
| How to test the refactoring?         | Create tests for current behavior first                      |

## Implementation Order

1. Create comprehensive tests for current BlogPost behavior
2. Create tests for current PublishedDocument behavior
3. Extract PublishableContent base class with common code
4. Migrate BlogPost to extend PublishableContent
5. Migrate Document (renamed from PublishedDocument) to extend
   PublishableContent
6. Add documents connection query
7. Update frontend to use new queries
8. Verify all tests pass
