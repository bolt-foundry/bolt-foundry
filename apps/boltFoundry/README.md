# Bolt Foundry Platform

The main Bolt Foundry web application - our platform for building reliable LLM
systems through structured Persona Cards and behavior-driven development.

## Overview

This is the core web application that serves the Bolt Foundry platform. It
includes:

- **Marketing pages** - Homepage, product information, pricing
- **Authentication** - User login and session management via Google OAuth
- **GraphQL API** - Data layer built on Isograph
- **Interactive demos** - Plinko game and other examples
- **Documentation** - Technical docs served from `/docs`
- **UI Components** - Built with our bfDs design system

## Architecture

- **Framework**: React 19 with TypeScript
- **Data Layer**: GraphQL via Isograph (with SSR support)
- **Routing**: File-based routing with Isograph entrypoints
- **Styling**: CSS modules with design system tokens
- **Build**: ESBuild + Deno compilation

## Key Directories

- `/entrypoints` - Isograph route definitions
- `/pages` - Page components
- `/components` - Reusable UI components
- `/docs` - Documentation system planning (see docs/README.md)
- `/routes.ts` - Traditional route definitions

## Development

The app is built and served as part of the main platform:

```bash
bff build  # Build the entire platform
bff test   # Run tests
```

## Features

### Current

- Server-side rendered pages via Isograph
- Google OAuth authentication
- GraphQL API with type safety
- Marketing pages with demos

### In Development

- Documentation publishing system (v0.1)
- Enhanced user dashboard
- Team collaboration features

## Related Systems

- **bfDb** - Database and GraphQL layer
- **bfDs** - Design system components
- **web** - Web server and routing layer
