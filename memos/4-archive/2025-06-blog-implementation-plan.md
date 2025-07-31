# Blog Implementation Plan

## What are we building?

We're building a simple blog system that reads markdown files from
`./content/blog`. Blog posts are organized in date folders like
`content/blog/2025/06/01/post-title.md`. Individual posts can be read at URLs
like `/blog/2025/06/01/post-title`.

This is a minimal first version - just copy the docs system and modify it to
read from a different directory.

## Why do we need to build it?

We need a place to publish content that is timely and not evergreen. Unlike
documentation that needs constant updates and maintenance, blog posts capture
thoughts, announcements, and insights at a specific point in time. The datestamp
helps us keep this content around without worrying about fixing it up
individually - it's understood that blog posts reflect the state of things when
they were written.

## Status

| Task                      | Status   | Description                                       |
| ------------------------- | -------- | ------------------------------------------------- |
| Create BlogPost class     | Complete | Copied PublishedDocument, reads from content/blog |
| Add blog GraphQL query    | Complete | Single query: blogPost(slug)                      |
| Create Blog.tsx component | Complete | Copied Docs.tsx, modified for blog                |
| Add blog route            | Complete | Support /blog/:slug                               |
| Create sample blog post   | Complete | content/blog/hello-world-2025-06-01.md            |
| Add content permissions   | Complete | Added content/ to readable locations in build     |
| E2E test                  | Complete | Test passes for blog post reading                 |

## Versions

| Version         | Status   | Description                                   |
| --------------- | -------- | --------------------------------------------- |
| [v0.1](/404.md) | Complete | Basic blog reading functionality              |
| v0.2            | Planned  | Blog listing page with chronological ordering |
| v0.3            | Planned  | Author metadata and tags                      |

## Future work

| Task             | Description                             |
| ---------------- | --------------------------------------- |
| User-facing docs | Move user documentation to content/docs |
| Blog RSS feed    | Generate RSS/Atom feeds for blog posts  |
| Blog search      | Full-text search across blog posts      |
| Draft posts      | Support for unpublished draft posts     |

## Measurement

| Metric          | Purpose                    | Description                  |
| --------------- | -------------------------- | ---------------------------- |
| Blog post count | Track content creation     | Number of published posts    |
| Page views      | Understand popular content | Analytics on blog post views |
| Build time      | Ensure performance         | Time to process blog content |
