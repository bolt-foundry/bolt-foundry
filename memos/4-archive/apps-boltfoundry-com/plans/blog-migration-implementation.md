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

### 📁 Legacy Blog Infrastructure in apps/boltFoundry

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

**Create E2E Test File with First Scenario**:

```
apps/boltfoundry-com/__tests__/e2e/blog.test.e2e.ts
```

**Test Structure**:

- Start with one basic test scenario (e.g., "blog routes resolve")
- This file will be progressively expanded with new scenarios as we implement
  features
- Enable one test scenario at a time as we implement that functionality
- Each component implementation should make the next test scenario pass

#### Step 2: Outer Layer - Routing & Entry Point + Styling

**EntrypointBlog.ts + routes.ts**:

- Create basic blog routing infrastructure
- Get `/blog` and `/blog/:slug` responding (even with empty content)

**Add Blog Styles Early**:

- Import blog CSS styles to enable visual styling throughout development
- **Add to styles/index.ts**:

```typescript
import "@bfmono/static/blogStyle.css";
```

**Verify**: Blog styles don't conflict with existing boltfoundry-com design

**Add test scenario**: "blog routes resolve" - verify routes return 200 status

**Update routes.ts**:

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

**GraphQL Integration**: Server queries already exist (`blogPost`,
`blogPosts`) - just need to create Isograph client fields by copying from
boltFoundry app.

#### Step 3: Shell Component - Blog.tsx

**Main Blog Component**:

- Create outer blog shell that renders placeholder content
- Update imports from `@iso` to `@iso-bfc`
- Should compile and render basic structure
- **Verify styling**: Check that blog shell renders with proper CSS styling

**Add test scenario**: "blog page loads" - verify page renders with expected
content/structure and styling

#### Step 4: Inner Components - BlogPostList & BlogPostListItem

**Component by Component**:

- Add BlogPostList.tsx for list container functionality
- Add BlogPostListItem.tsx for individual post preview/summary components
- Each should integrate cleanly with Blog.tsx
- **Verify styling**: Check that list and list items render with proper styling
  and layout

**Add test scenarios**:

- "blog list displays posts" - verify list shows blog posts with titles/metadata
  and proper styling
- "blog post previews render" - verify individual post items display correctly
  in list with styling

#### Step 5: Individual Post Component - BlogPostView

**Full Post Display**:

- Add BlogPostView.tsx for individual post rendering
- Handle full post content, hero images, metadata
- Integrate with Blog.tsx routing logic
- **Verify styling**: Check that individual posts render with proper typography,
  hero images, and layout

**Add test scenario**:

- "individual blog post loads" - verify `/blog/slug` shows full post content
  with proper styling

#### Step 6: Supporting Layer - Utilities

**Final Integration**:

- Add blogHelper.ts utilities for date/metadata formatting
- Polish and complete functionality
- **Verify styling**: Final check that all utilities work with styling

**Add test scenario**:

- "blog metadata displays" - verify author/date formatting works correctly with
  proper styling

#### Step 7: Navigation Integration

**Update Nav.tsx**:

- Add blog navigation button with proper active state
- Ensure mobile menu includes blog link
- Test navigation flow between sections

**Add test scenario**: "blog navigation works" - verify nav highlights blog
section and links work

#### Step 8: Final Validation & Polish

**Final Integration**:

- Verify design consistency with existing boltfoundry-com
- Test mobile responsive behavior
- Validate all blog content renders correctly
- Check hero images, tags, metadata display
- Ensure no TypeScript or build errors
- Confirm SEO functionality maintained

**Add comprehensive test scenarios**:

- "mobile blog works" - verify responsive design on mobile
- "hero images display" - verify blog post hero images render correctly
- "tags and metadata work" - verify all post metadata displays properly
- "all 5 blog posts load" - verify every existing post renders correctly
- "internal/external links work" - verify navigation and external links function

**Final Checks**:

- Performance equivalent to current blog
- CSS integration without conflicts

## Future Enhancements (Optional)

- **RSS/Atom Feeds**: Feed generation for blog subscribers
- **Tag-based Filtering**: Clickable tags for post filtering and browsing
- **Search Functionality**: Full-text search across blog content
- **Advanced Pagination**: Beyond basic "Load more" functionality
- **Post Navigation**: Previous/next post navigation
- **Social Features**: Sharing buttons and comment system integration
- **Enhanced SEO**: Per-post meta descriptions and Open Graph tags

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
- `apps/boltFoundry/components/BlogList.tsx` - Blog list with pagination (will
  become BlogPostList + BlogPostListItem)
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
  List types (will be split into BlogPostList + BlogPostListItem types)

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
- `apps/boltfoundry-com/components/BlogPostList.tsx` (port from boltFoundry
  BlogList.tsx)
- `apps/boltfoundry-com/components/BlogPostListItem.tsx` (extract from
  BlogList.tsx)
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
