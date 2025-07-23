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

### Component-First Migration with Progressive E2E Testing

**Core Approach**: Build components outer-to-inner, guided by E2E tests that
progressively enable scenarios as we implement features.

#### Step 1: E2E Test Foundation

**Create Comprehensive E2E Test with Most Scenarios Disabled**:

```
apps/boltfoundry-com/__tests__/e2e/blog.test.e2e.ts
```

**Test Structure**:

- Write all blog scenarios (routing, list view, individual posts, navigation,
  etc.)
- Start with most tests as `.skip()` or equivalent to ignore them
- Enable one test scenario at a time as we implement that functionality
- Each component implementation should make the next test scenario pass

**Benefits**:

- Clear roadmap of what we're building
- Immediate feedback on progress
- No noise from unimplemented features
- Confidence each component works before moving inward

#### Step 2: Outer Layer - Routing & Entry Point

**EntrypointBlog.ts + routes.ts**:

- Create basic blog routing infrastructure
- Enable: "blog routes resolve" test scenario
- Get `/blog` and `/blog/:slug` responding (even with empty content)

#### Step 3: Shell Component - Blog.tsx

**Main Blog Component**:

- Create outer blog shell that renders placeholder content
- Update imports from `@iso` to `@iso-bfc`
- Enable: "blog page loads" test scenario
- Should compile and render basic structure

#### Step 4: Inner Components - BlogList & BlogPostView

**Component by Component**:

- Add BlogList.tsx for list view functionality
- Add BlogPostView.tsx for individual post rendering
- Enable corresponding test scenarios as each component works
- Each should integrate cleanly with Blog.tsx

#### Step 5: Supporting Layer - Utilities & Styling

**Final Integration**:

- Add blogHelper.ts utilities
- Import blog CSS styles
- Enable remaining test scenarios
- Polish and complete functionality

**Approach**: Each step should make the enabled E2E test scenarios pass before
moving to the next layer.

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

#### Step 6: Navigation Integration

**Update Nav.tsx**:

- Add blog navigation button with proper active state
- Ensure mobile menu includes blog link
- Test navigation flow between sections
- Enable: "blog navigation works" test scenario

#### Step 7: Final Validation & Polish

**Complete E2E Test Suite**:

- Enable all remaining test scenarios
- Verify design consistency with existing boltfoundry-com
- Test mobile responsive behavior
- Validate all blog content renders correctly
- Check hero images, tags, metadata display
- Ensure no TypeScript or build errors
- Confirm SEO functionality maintained

**Final Checks**:

- All 5 blog posts render properly
- Internal/external links work correctly
- Performance equivalent to current blog
- CSS integration without conflicts

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

## Appendix: Related Files and Documentation

### Core Blog Files to Migrate (from apps/boltFoundry)

**Main Components:**

- `apps/boltFoundry/components/Blog.tsx` - Main blog router component
- `apps/boltFoundry/components/BlogList.tsx` - Blog list with pagination
- `apps/boltFoundry/components/BlogPostView.tsx` - Individual post renderer
- `apps/boltFoundry/components/BlogSimple.tsx` - SSR fallback component
- `apps/boltFoundry/lib/blogHelper.ts` - Date/metadata formatting utilities

**GraphQL Integration:**

- `apps/boltFoundry/entrypoints/EntrypointBlog.ts` - Isograph blog entrypoint
- `apps/boltFoundry/__generated__/__isograph/Query/Blog/` - Generated GraphQL
  types
- `apps/boltFoundry/__generated__/__isograph/BlogPost/BlogPostView/` - Post
  component types
- `apps/boltFoundry/__generated__/__isograph/BlogPostConnection/BlogList/` -
  List types

**Backend Infrastructure (Already Available):**

- `apps/bfDb/nodeTypes/BlogPost.ts` - Core BlogPost data model
- `apps/bfDb/graphql/roots/Query.ts` - `blogPost` and `blogPosts` resolvers
- `apps/bfDb/utils/contentUtils.ts` - Frontmatter parsing utilities
- `docs/blog/` - Blog content directory (shared)
- `static/blogStyle.css` - Complete blog styling (shared)

**Testing:**

- `apps/boltFoundry/__tests__/e2e/blog.test.e2e.ts` - E2E tests for blog
  functionality
- `apps/boltFoundry/__tests__/e2e/blog-simple.test.e2e.ts` - Blog route tests
- `apps/bfDb/nodeTypes/__tests__/BlogPost.test.ts` - BlogPost model tests

**Routing & Configuration:**

- `apps/boltFoundry/routes.ts` - Blog route definitions (`/blog`, `/blog/:slug`)
- `apps/boltFoundry/isograph.config.json` - Isograph configuration
- `apps/boltFoundry/isographEnvironment.ts` - GraphQL client setup

### Target Files in apps/boltfoundry-com

**Files to Create:**

- `apps/boltfoundry-com/components/Blog.tsx` (port from boltFoundry)
- `apps/boltfoundry-com/components/BlogList.tsx` (port from boltFoundry)
- `apps/boltfoundry-com/components/BlogPostView.tsx` (port from boltFoundry)
- `apps/boltfoundry-com/entrypoints/EntrypointBlog.ts` (port from boltFoundry)
- `apps/boltfoundry-com/lib/blogHelper.ts` (port from boltFoundry)

**Files to Update:**

- `apps/boltfoundry-com/routes.ts` - Add blog routes
- `apps/boltfoundry-com/components/Nav.tsx` - Add blog navigation
- `apps/boltfoundry-com/styles/index.ts` - Import blog styles

### Isograph Framework Resources

**Core Documentation:**

- Website: https://isograph.dev
- Key concepts: Component-level GraphQL data specification, entrypoints,
  compiler-driven development
- Architecture: Uses `iso` literals to define component data requirements and
  generate optimized queries

**Key Isograph Patterns in Bolt Foundry:**

- Entrypoints handle routing and top-level queries
- Components use `iso` to specify GraphQL fragments
- Generated code in `__generated__/__isograph/` directories
- Environment setup in `isographEnvironment.ts` files
- Configuration in `isograph.config.json` files

**Migration-Relevant Concepts:**

- Import alias update: `@iso` → `@iso-bfc` for boltfoundry-com
- Consistent file structure across apps
- Shared GraphQL schema from bfDb enables seamless data access
- Component-level data requirements automatically aggregate into optimized
  queries
