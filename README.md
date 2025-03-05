# Content Foundry: The Content Operating System

> **Developer Experience First:** Content Foundry is building an open-source
> platform with the best developer experience in mind. We're focused on making
> it easier to contribute than to Wikipedia, while creating powerful tools for
> content creators.

## What is Content Foundry?

Content Foundry is an open-source platform that helps creators tell compelling
stories across all platforms. We provide an end-to-end solution that guides you
through the entire content creation lifecycle with our five pillars:

### Identity

Take anecdotes, inspirations, ideas, user research, sales calls, and whatever
information you have that relates to your brand and put it here. This serves as
origin material for the rest of the process.

### Research

Figure out what you should say before you say it. Come up with sketches,
outlines or other ideas for tweets, posts, videos, etc.

### Creation

Write your content with AI-assistance that maintains your unique voice.

### Distribution

Get your content where it needs to go efficiently and effectively.

### Analytics

Learn what works with your audience, and feed it back into the process.

---

## Developer Experience

We want to create the best developer experience possible. We want it to be
simpler to contribute to Content Foundry than it is to contribute to Wikipedia.
We're not there yet, but here's what we do have.

### Replit-first Developer Experience

The best way to get started with Content Foundry is to
[head to our Replit project](https://replit.com/t/bolt-foundry/repls/Content-Foundry/view).

From there, you can fork (they call it remix now) our app into your own Replit
account.

### Getting Started Locally

If you prefer to work locally, you'll need:

1. [Deno 2](https://deno.com/) (version 2.x)
2. [Sapling SCM](https://sapling-scm.com/) (for source control)
3. [Nix](https://nixos.org/) (optional, for reproducible environments)

Clone the repository, then run:

```bash
# Start development tools
bff devTools
```

This will start various tools including:

- Sapling web interface (port 3011)
- Jupyter notebook (port 8888)
- Tools web interface (port 9999)

#### Dependencies

Content Foundry uses Deno 2's built-in dependency management with both JSR and
npm packages:

```bash
# Add a dependency from JSR (JavaScript Registry)
deno add jsr:@std/http

# Add a dependency from npm
deno add npm:react
```

Our project uses both JSR packages and npm packages as specified in `deno.jsonc`
and `package.json`.

### BFF (Bolt Foundry Friend)

Content Foundry uses BFF, our custom task runner to simplify common development
tasks:

- `bff build` - Build the project
- `bff test` or `bff t` - Run tests
- `bff format` or `bff f` - Format code
- `bff lint` - Lint code
- `bff check` - Type check
- `bff ci` - Run CI checks (format, lint, check, test, build)
- `bff devTools` - Start development tools

Run `bff help` to see all available commands.

### Project Structure

```
.
├── build/                      # Compiled application output
├── content/                    # Content and documentation
├── infra/                      # Infrastructure code
├── lib/                        # Shared utility functions
├── packages/                   # Project modules
├── static/                     # Static assets and CSS
```

### Development Workflow

For more details on contributing to Content Foundry, check out our
[contributing guide](/content/documentation/community/contributing.md) and the
[AGENT.md](AGENT.md) file which contains comprehensive documentation on our
coding practices and workflows.
