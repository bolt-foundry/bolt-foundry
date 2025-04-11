# Bolt Foundry: Reliable LLM Systems

> **Developer Experience First:** Bolt Foundry is building an open-source
> platform for creating reliable, testable, and verifiable LLM systems. We focus
> on making AI implementations that are robust and predictable.

## What is Bolt Foundry?

Bolt Foundry is an open-source platform that helps developers build reliable LLM
systems through our Identity Card approach. An Identity Card represents a
verified, tested unit of LLM functionality that can be composed into larger
systems.

### Core Features

- **Identity Cards**: Testable units of LLM functionality with built-in
  verification
- **Behavior Cards**: Actionable protocols and best practices for implementing
  LLM systems
- **Test-Driven LLMs**: Comprehensive testing framework for LLM behaviors
- **Composable Systems**: Build complex LLM applications from verified
  components
- **Versioning & Tracking**: Monitor and version your LLM system's behavior
- **Performance Analysis**: Measure and optimize your LLM implementation

---

## Developer Experience

We want to create the best developer experience possible. We want it to be
simpler to contribute to Bolt Foundry than it is to contribute to Wikipedia.
We're not there yet, but here's what we do have.

### Replit-first Developer Experience

The best way to get started with Bolt Foundry is to
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

Bolt Foundry uses Deno 2's built-in dependency management with both JSR and npm
packages:

```bash
# Add a dependency from JSR (JavaScript Registry)
deno add jsr:@std/http

# Add a dependency from npm
deno add npm:react
```

Our project uses both JSR packages and npm packages as specified in `deno.jsonc`
and `package.json`.

### BFF (Bolt Foundry Friend)

Bolt Foundry uses BFF, our custom task runner to simplify common development
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

For more details on contributing to Bolt Foundry, check out our
[contributing guide](/content/documentation/community/contributing.md) and the
[AGENT.md](AGENT.md) file which contains comprehensive documentation on our
coding practices and workflows.
