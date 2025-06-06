# Blog v0.1 - Simplified Implementation

## Overview

Copy the docs system, change the directory to `content/blog`. That's it.

## Implementation Steps

### 1. Create BlogPost.ts

- Copy `apps/bfDb/nodeTypes/PublishedDocument.ts`
- Change class name to `BlogPost`
- Change directory from "docs" to "content/blog"
- Add date parsing from path (year/month/day/slug)

### 2. Add GraphQL Query

In `apps/bfDb/graphql/roots/Query.ts`:

```typescript
blogPost(year: Int!, month: Int!, day: Int!, slug: String!): BlogPost
```

### 3. Create Blog.tsx

- Copy `apps/boltFoundry/components/Docs.tsx`
- Change to use BlogPost instead of PublishedDocument
- Remove sidebar (no blog listing yet)

### 4. Create EntrypointBlog.ts

- Copy `apps/boltFoundry/entrypoints/EntrypointDocs.ts`
- Update to use blog query and Blog component

### 5. Add Route

In `apps/boltFoundry/routes.ts`:

```typescript
{
  path: "/blog/:year/:month/:day/:slug",
  entrypoint: "EntrypointBlog"
}
```

### 6. Create Test Post

Create `content/blog/2025/06/01/hello-world.md`:

```markdown
# Hello World

This is our first blog post.
```

## What We're NOT Doing

- No ContentNode abstraction
- No renaming docs folder
- No flexible date parsing (must be YYYY/MM/DD)
- No blog listing page
- No frontmatter parsing
- No title extraction
- No publishDate field (just parse from path when needed)

## Testing

One e2e test:

### blog.test.e2e.ts

```typescript
-"Can read blog post at /blog/2025/06/01/hello-world";
```

Create the test post, run `bff e2e`, verify it loads.

That's it. Ship it.
