# Documentation Publishing System

## What are we building?

We're building a documentation publishing system within the Bolt Foundry app
that serves markdown files from the `/docs` directory as web pages. This system
will reuse the MDX infrastructure from our previous blog implementation (which
worked well) but adapt it for documentation purposes. The key is that this
leverages server-side rendering through Isograph for SEO and fast page loads,
something our previous docs attempt didn't achieve.

The system will transform plain markdown files into rich, interactive MDX
content at build time, serve them through GraphQL, and render them server-side.
Users will access docs through clean URLs like `/docs/getting-started` without
file extensions.

## Why do we need to build it?

Our docs are trapped in markdown files. People can't read them on the website.

The old docs system didn't have SSR. Google couldn't index it. Pages loaded
slow. Documentation needs both - people find it through search, then need it to
load fast.

We already fixed this for the blog. Same stack works for docs. No point building
something new when we have working code to adapt.

## Status

| Task                         | Status  | Description                                                |
| ---------------------------- | ------- | ---------------------------------------------------------- |
| Project setup                | Active  | Creating initial project structure and planning            |
| Review blog implementation   | Planned | Study commit df18cd2273e6 to understand the working system |
| Extract reusable components  | Planned | Identify and restore MDX/Isograph infrastructure           |
| Implement docs GraphQL types | Planned | Create documentation-specific GraphQL schema               |
| Build docs routes            | Planned | Set up `/docs` routing in Bolt Foundry                     |
| Content processing           | Planned | Build-time markdown to MDX conversion                      |

## Versions

| Version         | Status  | Description                                             |
| --------------- | ------- | ------------------------------------------------------- |
| [v0.1](V0.1.md) | Current | Basic docs serving with SSR, flat file list, clean URLs |
| v0.2            | Planned | Add navigation, search, and categories                  |

## Future work

| Task                 | Description                                           |
| -------------------- | ----------------------------------------------------- |
| Navigation sidebar   | Add hierarchical navigation based on file structure   |
| Search functionality | Full-text search across all documentation             |
| Syntax highlighting  | Enhanced code block rendering with language detection |
| Version switching    | Support multiple documentation versions               |
| Edit on GitHub links | Direct links to edit documentation source             |

## Measurement

| Metric         | Purpose                | Description                           |
| -------------- | ---------------------- | ------------------------------------- |
| Page load time | Ensure SSR is working  | Time to first contentful paint < 1s   |
| SEO indexing   | Verify discoverability | Google Search Console indexing status |
| Build time     | Monitor performance    | Full rebuild time with all docs       |
| 404 rate       | Content accessibility  | Track missing document requests       |
