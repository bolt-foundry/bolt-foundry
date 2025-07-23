# Blog Migration Implementation Plan

**Date**: 2025-07-23\
**Status**: Planning\
**Priority**: Medium

## Overview

Migrate the blog functionality from `apps/boltFoundry` to `apps/boltfoundry-com`
to consolidate our web presence into a single application. The existing blog
infrastructure is well-architected and should port over with moderate effort.

## Current State Analysis

### ✅ What's Already Compatible

- **GraphQL Schema**: boltfoundry-com already uses the same bfDb schema with
  BlogPost resolvers
- **Tech Stack**: Identical (Deno, React, Isograph, Vite)
- **Content Storage**: Blog posts in shared `/docs/blog/` directory (TOML
  frontmatter + Markdown)
- **Build System**: Same compilation and deployment process

### 📁 Blog Infrastructure in boltFoundry

- **Components**: Blog.tsx, BlogList.tsx, BlogPostView.tsx, BlogSimple.tsx
- **Utilities**: blogHelper.ts for markdown processing and data management
- **Styling**: Complete CSS in `/static/blogStyle.css`
- **Routing**: `/blog` (list) and `/blog/:slug` (individual posts)
- **Features**: Pagination, tags, hero images, responsive design, anchor links
- **Testing**: Comprehensive E2E test suite

## Implementation Plan

### Phase 1: Core Migration

#### 1.1 Test Setup (First Priority)

**Port E2E Tests Early**:

```
apps/boltFoundry/__tests__/e2e/blog*.test.e2e.ts → apps/boltfoundry-com/__tests__/e2e/
```

**Benefits**:

- Test each component as we port it
- Catch integration issues immediately
- Iterative validation instead of big-bang testing
- Confidence in each step

#### 1.2 Component Migration

**Start with Empty Shell, Add Components One by One**:

**Step 1**: Create minimal Blog.tsx that renders empty content

- Copy basic structure from boltFoundry Blog.tsx
- Update import from `@iso` to `@iso-bfc`
- Remove all inner component dependencies
- Make it render a simple "Blog loading..." or empty div
- Test that it compiles and routing works

**Step 2**: Add BlogList component

- Copy BlogList.tsx with import update
- Update Blog.tsx to include BlogList reference
- Test that list renders (even if empty)

**Step 3**: Add BlogPostView component

- Copy BlogPostView.tsx with import update
- Update Blog.tsx to include BlogPostView reference
- Test individual post rendering

**Step 4**: Add supporting utilities

- Copy blogHelper.ts with any needed import updates
- Test complete functionality

**Approach**: Each step should compile and run before moving to the next step

#### 1.3 GraphQL Integration

**✅ Server Queries Already Exist**: The `blogPost` and `blogPosts` root queries
are already available in the shared bfDb schema that boltfoundry-com uses.

**What We Need to Create**:

```
apps/boltfoundry-com/entrypoints/EntrypointBlog.ts
```

**Implementation Details**:

- **Root queries** (already exist): `blogPost(slug: String)` and
  `blogPosts(first: Int, sortDirection: String)` defined in
  `apps/bfDb/graphql/roots/Query.ts`
- **Isograph client field**: Create `Query.Blog` field that combines both server
  queries (like in boltFoundry)
- **Component fields**: Port `BlogPost.BlogPostView` and
  `BlogPostConnection.BlogList` field definitions

**Architecture**:

- BlogPost model = data model only (already exists)
- Query.ts = server-side resolvers (already exists)
- Query.Blog = client-side aggregation field (needs to be created)
- Components = client-side data requirements (need to be ported)

#### 1.4 Routing Setup

**Update `routes.ts`**:

```typescript
export const isographAppRoutes = new Map<string, IsographRoute>([
  ["/", entrypointHome],
  ["/login", entrypointLogin],
  ["/rlhf", entrypointRlhf],
  // ADD:
  ["/blog", entrypointBlog],
  ["/blog/", entrypointBlog],
  ["/blog/:slug", entrypointBlog],
]);
```

#### 1.5 Navigation Integration

**Update `Nav.tsx`**:

- Add blog navigation button
- Implement active state logic for blog routes
- Maintain existing GitHub/Discord/Login buttons
- Ensure mobile menu includes blog

#### 1.6 Styling Integration

**Add to `styles/index.ts`**:

```typescript
import "@bfmono/static/blogStyle.css";
```

**Potential Conflicts**: Verify blog styles don't interfere with existing
boltfoundry-com design

### Phase 2: Design Integration & Polish

#### 2.1 Design Integration

**Verify Consistency**:

- Blog styles match boltfoundry-com design language
- Navigation states work properly
- Mobile menu behavior
- Hero section integration on homepage

### Phase 3: Deployment & Validation

#### 3.1 Build Verification

- Isograph compilation includes BlogPost types
- CSS bundling works correctly
- All routes resolve properly
- No TypeScript errors

#### 3.2 Content Validation

- All existing blog posts render correctly
- Hero images display properly
- Tags and metadata show correctly
- Internal links work
- External links open properly

## Future Enhancements (Optional)

### Not Currently Implemented

- **RSS/Atom Feeds**: No feed generation in either app
- **Tag-based Filtering**: Tags display but aren't clickable
- **Search Functionality**: No blog search capability
- **Advanced Pagination**: Only basic "Load more" (currently disabled)
- **Comments System**: No commenting functionality
- **Enhanced SEO**: Missing per-post meta descriptions, Open Graph tags

### Potential Additions

- RSS feed generation for blog subscribers
- Tag-based post filtering and browsing
- Full-text search across blog content
- Previous/next post navigation
- Social sharing buttons
- Comment system integration

## Risk Assessment

### Low Risk

- **Technical Compatibility**: Same tech stack and shared infrastructure
- **Content Migration**: No content changes needed
- **Build Process**: Proven patterns already working

### Medium Risk

- **CSS Conflicts**: Blog styles may need adjustment for design consistency
- **Navigation UX**: Need to ensure smooth integration with existing nav
- **Mobile Experience**: Verify responsive design works with new layout

### Mitigation Strategies

- Thorough testing of CSS integration before deployment
- Incremental rollout with feature flags if needed
- Maintain boltFoundry blog as fallback during transition

## Success Criteria

### Functional Requirements

- ✅ All blog posts render correctly with proper formatting
- ✅ Navigation between blog list and individual posts works
- ✅ Tags, metadata, and hero images display properly
- ✅ Mobile responsive design functions correctly
- ✅ All existing URLs continue to work

### Quality Requirements

- ✅ Performance is equivalent or better than current blog
- ✅ Design consistency with boltfoundry-com
- ✅ E2E tests pass for all blog functionality
- ✅ No TypeScript or build errors
- ✅ SEO functionality maintained

## Dependencies

### External

- Blog content in `/docs/blog/` directory
- bfDb GraphQL schema with BlogPost resolvers
- Shared static assets (`@bfmono/static/blogStyle.css`)

### Internal

- Completion of existing boltfoundry-com features
- Stable routing and navigation patterns
- Established design system integration

## Notes

- This migration leverages existing, well-tested blog infrastructure
- The shared GraphQL layer makes data access seamless
- Focus on maintaining existing functionality first, enhancements later
- Consider this a stepping stone toward full site consolidation
