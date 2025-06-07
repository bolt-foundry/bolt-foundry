# Introduction to Deno: A Modern JavaScript Runtime

_March 15, 2023_

Deno is a modern runtime for JavaScript and TypeScript that addresses many of
the design flaws in Node.js. Created by Ryan Dahl (the original creator of
Node.js), Deno provides built-in TypeScript support, secure defaults, and a
standard library inspired by Go.

## Key Features

- **Secure by default**: No file, network, or environment access unless
  explicitly enabled
- **TypeScript support out of the box**: No need for separate compilation steps
- **Standard modules**: Curated set of standard modules that are guaranteed to
  work with Deno
- **Built-in tooling**: Formatter, linter, and test runner included

## Getting Started

```bash
# Install Deno
curl -fsSL https://deno.land/install.sh | sh

# Run a simple script
deno run https://deno.land/std/examples/welcome.ts
```

Deno represents a fresh take on server-side JavaScript, learning from a decade
of Node.js experience.
