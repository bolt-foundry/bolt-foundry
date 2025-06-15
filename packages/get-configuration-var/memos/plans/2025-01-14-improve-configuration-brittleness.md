# Implementation Plan: Improve get-configuration-var Brittleness

## Overview

The `get-configuration-var` package currently suffers from brittleness issues
that make it difficult to use outside of Bolt Foundry's own applications. The
core problems are:

1. **No shell environment injection**: 1Password secrets aren't available to
   external processes or scripts that don't import the package directly
2. **Replit constraints**: The Replit environment doesn't support traditional
   shell initialization files, making secret injection challenging
3. **External app friction**: Non-Bolt Foundry apps and scripts have no clean
   way to access secrets without understanding our internal architecture

This implementation will create a more robust configuration system that works
seamlessly across different environments and use cases.

## Goals

| Goal                        | Description                                                            | Success Criteria                                                       |
| --------------------------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Shell environment injection | Enable automatic injection of 1Password secrets into shell environment | External scripts can access secrets via standard environment variables |
| Replit compatibility        | Provide a solution that works within Replit's constraints              | Developers on Replit can access secrets without manual workarounds     |
| External app support        | Make configuration easily accessible to non-Bolt Foundry applications  | Third-party tools can read secrets via .env files or environment       |
| Developer experience        | Simplify the mental model for secret access                            | Clear, documented patterns for all use cases                           |
| Backward compatibility      | Maintain existing API surface                                          | Current code continues to work unchanged                               |

## Anti-Goals

| Anti-Goal                      | Reason                                                                 |
| ------------------------------ | ---------------------------------------------------------------------- |
| Replace 1Password as vault     | We want to enhance integration, not replace the secure storage backend |
| Create complex authentication  | Keep security model simple - rely on existing 1Password CLI auth       |
| Modify existing package APIs   | Preserve backward compatibility for current consumers                  |
| Build a generic secret manager | Focus on solving our specific use cases                                |

## Technical Approach

The solution involves creating multiple entry points for secret access:

1. **Shell initialization system**: For environments that support it,
   automatically inject secrets on shell startup via bashrc/profile scripts.
   This makes secrets available to all child processes.

2. **Manual injection CLI**: Provide a `bff secrets inject` command that exports
   secrets to the current shell session. This covers cases where automatic
   injection isn't possible.

3. **Replit-aware detection**: Detect when running in Replit and provide
   appropriate fallbacks, potentially using Replit's secret storage as a cache
   layer.

4. **External app bridge**: Enhanced `.env` file generation that external apps
   can source or read directly, with optional file watching for updates.

5. **Process wrapper**: A command wrapper (like `op run`) that injects secrets
   before executing external commands.

## Components

| Status | Component                    | Purpose                                                           |
| ------ | ---------------------------- | ----------------------------------------------------------------- |
| [ ]    | `init-secrets.sh`            | Shell initialization script for automatic secret injection        |
| [ ]    | `bff secrets inject`         | CLI command for manual secret export to current shell             |
| [ ]    | Replit detector              | Runtime detection of Replit environment with appropriate behavior |
| [ ]    | `.env` generator enhancement | Improved env file generation with watch mode                      |
| [ ]    | `bff with-secrets`           | Command wrapper that runs commands with injected secrets          |
| [ ]    | Integration tests            | Test coverage for all new injection methods                       |
| [ ]    | Migration guide              | Documentation for transitioning to new patterns                   |

## Technical Decisions

| Decision                    | Reasoning                                                | Alternatives Considered                 |
| --------------------------- | -------------------------------------------------------- | --------------------------------------- |
| Use shell initialization    | Standard pattern that works for most local development   | systemd environment.d (Linux-specific)  |
| Provide manual CLI fallback | Covers cases where shell init isn't available (Replit)   | Always require manual injection         |
| Keep 1Password as backend   | Maintains security model and existing infrastructure     | Migrate to different secret store       |
| Support .env files          | Universal format understood by most tools                | Custom configuration formats            |
| Add command wrapper         | Allows secret injection without modifying external tools | Require all tools to import our package |

## Next Steps

| Question                                                | How to Explore                                          |
| ------------------------------------------------------- | ------------------------------------------------------- |
| How does Replit handle shell initialization?            | Create test Repl and experiment with various init files |
| Can we detect successful 1Password CLI auth?            | Test `op whoami` and error handling                     |
| What's the performance impact of injecting all secrets? | Benchmark warm vs cold secret loading                   |
| Should we support partial secret sets?                  | Survey current usage patterns                           |
| How to handle secret rotation?                          | Research 1Password CLI capabilities                     |

## Implementation Order

1. **Research Phase**: Understand Replit constraints and 1Password CLI
   capabilities
2. **Core Shell Integration**: Build basic shell initialization script
3. **CLI Commands**: Add `bff secrets inject` and `bff with-secrets`
4. **Replit Support**: Implement detection and fallback mechanisms
5. **External App Bridge**: Enhance .env generation with watching
6. **Testing**: Comprehensive integration tests
7. **Documentation**: Usage guides and migration documentation

## Testing Strategy

- Unit tests for Replit detection logic
- Integration tests for shell initialization
- End-to-end tests with external scripts
- Performance benchmarks for secret loading
- Cross-platform testing (macOS, Linux, Replit)

## Success Metrics

- External scripts can access secrets without importing our package
- Replit developers have a documented, working solution
- No regression in existing functionality
- Performance impact < 100ms for typical secret sets
- Clear documentation reduces support questions
