
# Content Collections

This directory contains top-level content collections for the Content Foundry platform. Each subdirectory here represents a separate content collection, which is automatically loaded at application startup.

## Structure

Content collections follow a hierarchical structure similar to Next.js routing:

- Top-level directories (e.g., `contentfoundry.com`, `biglittletech.ai`) are separate content collections
- Files and subdirectories within each collection map to routes and nested routes
- Each `.md` or `.mdx` file becomes a content item in the collection

## Routing

The routing structure follows Next.js conventions:

- `collection/page.md` → `/collection`
- `collection/about.md` → `/collection/about`
- `collection/blog/post-1.md` → `/collection/blog/post-1`
- `collection/docs/[slug].md` → Dynamic routes with parameters

## Usage

Content collections are automatically loaded at application startup via the `initializeContentCollections` function. Each collection and its content items are stored in the database and can be queried through the GraphQL API or directly using BfDb methods.

To create a new content collection, simply add a new directory at this level and populate it with content files.
