# BFT Codebot Container Implementation

**Date**: 2025-07-23\
**Author**: AI Assistant\
**Status**: Draft

## Overview

Implementation of `bft codebot` command that creates isolated containers for
running Claude Code instances in parallel without file conflicts.

## Problem Statement

Multiple Claude Code instances running on the same machine can conflict when
modifying the same files, leading to confusion or broken code. We need isolated
environments where each Claude Code session operates on its own copy of the
codebase.

## Solution Architecture

### Core Concept

- `bft codebot` spins up a container with a fresh copy of the current codebase
- Each container runs its own Claude Code instance in isolation
- Uses sapling within the container to commit and push changes to GitHub
- Automatic cleanup with optional `--keep` flag for debugging

### Technology Choice: macOS 26 Container Command

**Decision**: Use Apple's native `container` command for initial prototype

**Rationale**:

- Better resource efficiency and native macOS integration
- Enhanced security with VM-level isolation per container
- Prototype can validate concept before broader deployment
- Author can be guinea pig on macOS 26 beta before stable release

**Tradeoffs**:

- ✅ Native integration, better performance
- ✅ Enhanced security model
- ❌ Limited to macOS 26+ (beta only)
- ❌ Less proven ecosystem than Docker

## Implementation Plan

### Phase 1: Basic Container Setup

1. **Nix-based Container Image Creation**
   - Extend existing `flake.nix` to output OCI-compliant container image
   - Include development shell dependencies (Deno, Sapling, Claude Code CLI)
   - Leverage existing Nix infrastructure and FlakeHub caching

2. **Codebase Integration Strategy**
   - Copy current working directory state into container at runtime
   - Use Nix-built base image with development environment dependencies
   - Handle .gitignore/.saplingignore/.flakeignore patterns appropriately
   - One-way periodic sync from container to host temp directory for monitoring
     - Sync frequency: Every second if changes detected
     - Anonymous: `/tmp/bft-codebot-{random-id}/`
     - Text descriptions: Auto-sanitized to filesystem-safe names (lowercase,
       spaces→hyphens, alphanumeric only)
     - Explicit names: `/tmp/bft-codebot-{name}/` with `--name` flag
     - Enables host tools (VSCode, editors) for read-only code browsing
     - Container remains source of truth, prevents conflicts

3. **BFT Integration**
   - Add `bft codebot` command to existing BFT task system
   - Integrate with current `.bft.ts` and task deck infrastructure
   - Follow existing BFT patterns and conventions

### Phase 2: Claude Code Integration

1. **Container Image Loading**
   - Build container image: `nix build .#codebot-container`
   - Load into container runtime:
     `container load < $(nix build .#codebot-container --print-out-paths)`
   - Manage image references and cleanup

2. **Container Orchestration**
   - Launch container with copied codebase using volume mounts
   - Support multiple execution modes:
     - **Default**: Start Claude Code CLI within container environment
     - **Shell mode (`--bash`)**: Open interactive bash shell for debugging
     - **Exec mode (`--exec`)**: Run single command and exit, preserve container
   - Pass through terminal I/O for interactive sessions

3. **Credential Management**
   - Mount authentication files via read-only volumes:
     `-v "$HOME/.anthropic:/root/.anthropic:ro"`
   - Handle SSH keys securely: `-v "$HOME/.ssh:/root/.ssh:ro"`
   - Use volume mounts instead of copying for security

### Phase 3: Version Control Integration

1. **Sapling Setup**
   - Initialize sapling workspace within container
   - Configure remote repositories and authentication
   - Handle branch creation and management

2. **Change Management**
   - Enable Claude Code to commit changes within container
   - Support pushing changes to GitHub via sapling
   - Maintain commit attribution and metadata

### Phase 4: Cleanup and Management

1. **Lifecycle Management**
   - Automatic container cleanup on completion (default)
   - `--keep` flag to preserve containers for debugging
   - `--exec` mode automatically preserves containers for future commands
   - Resource monitoring and cleanup policies

2. **Error Handling**
   - Graceful handling of container failures
   - Proper cleanup on interruption or errors
   - Logging and debugging capabilities

## Command Interface

### Basic Usage

```bash
bft codebot                           # Anonymous session with random ID
bft codebot "Let's work on rlhf"      # Named session: /tmp/bft-codebot-work-on-rlhf/
bft codebot "Fix authentication bug"  # Named session: /tmp/bft-codebot-fix-authentication-bug/
```

- Creates isolated container with current codebase
- Launches Claude Code CLI interactively
- Automatically cleans up container on exit
- Text descriptions auto-converted to filesystem-safe names

### Advanced Options

```bash
bft codebot --keep           # Preserve container after completion
bft codebot --name <name>    # Explicit name override
bft codebot --bash           # Open bash shell instead of Claude Code
bft codebot --exec <cmd>     # Run single command and exit, but keep container running
bft codebot --help           # Show usage information
```

### Execution Mode Examples

```bash
# Interactive shell access for debugging
bft codebot --bash "Debug container"

# Execute single commands with persistent containers
bft codebot --exec "deno test"                    # Run tests and exit
bft codebot --exec "git status" --name check      # Check git status
bft codebot --exec "bft help" --keep              # Run BFT help and preserve container
```

### Future Considerations

```bash
bft codebot --from <ref>    # Start from specific commit/branch
bft codebot --docker        # Fallback to Docker if available
```

## Technical Requirements

### Prerequisites

- macOS 26 "Tahoe" beta or later
- Apple's `container` command installed and system services started
  (`container system start`)
- Sapling SCM configured for the repository
- Nix package manager with flakes support

### Dependencies

- Existing BFT task runner infrastructure
- Nix flakes infrastructure and FlakeHub integration
- Current development shell configuration in `flake.nix`
- Proper authentication setup for GitHub/sapling integration

### Performance Considerations

- Fast container startup (target <2 seconds with Apple's native container)
- Minimal resource overhead per container
- Efficient codebase copying at runtime
- Leverage Apple Silicon optimization for sub-second startup times

## Security Considerations

- **Credential Management**: Secure handling of Git/Sapling credentials within
  containers
- **File Permissions**: Proper permission mapping between host and container
- **Network Access**: Controlled network access for GitHub integration
- **Resource Limits**: Prevent resource exhaustion from multiple containers

## Testing Strategy

### Continuous Integration

- **Container Build Validation**: Existing GitHub Actions CI automatically
  validates Nix-based container builds
- **Multi-Platform Testing**: CI runs on Ubuntu, with Nix providing consistent
  environment
- **Automated Testing**: All container builds tested on every PR via
  `.github/workflows/ci.yml`
- **Registry Integration**: Built containers can be pushed to GitHub Container
  Registry (ghcr.io)

### Unit Tests

- Container creation and teardown
- Codebase copying functionality
- BFT integration points

### Integration Tests

- End-to-end workflow validation
- Sapling integration testing
- Multiple container scenarios

### Manual Testing

- Real-world usage scenarios
- Performance and resource monitoring
- Error condition handling

## Rollout Plan

### Phase 1: Author-Only Prototype (Current)

- Build and test on macOS 26 beta
- Validate core functionality and user experience
- Iterate on implementation based on usage

### Phase 2: Stable Release Preparation

- Wait for macOS 26 stable release
- Add Docker fallback for broader compatibility
- Documentation and onboarding materials

### Phase 3: Team Rollout

- Deploy to team members with updated macOS
- Collect feedback and usage patterns
- Optimize based on real-world usage

## Success Metrics

- **Functionality**: Successful isolation of Claude Code instances
- **Performance**: Container startup time <2 seconds (leveraging Apple's native
  container performance)
- **Reliability**: <1% failure rate in container operations
- **Usability**: Intuitive command interface requiring minimal configuration

## Open Questions

1. **Codebase State**: Should containers start from current working directory
   state or clean checkout?
   - **Decision Needed**: Determine default behavior and potential flag options

2. **Container Networking**: How should multiple containers communicate if
   needed?
   - **Future Consideration**: May not be needed for initial implementation

3. **Resource Limits**: What limits should be placed on container resource
   usage?
   - **Implementation Detail**: Monitor and adjust based on usage patterns

## Files to Modify/Create

### New Files

- `infra/bft/tasks/codebot.ts` - Main implementation
- `infra/bft/tasks/codebot.bft.deck.md` - Task documentation
- Container output configuration in `flake.nix` for OCI image generation

### Modified Files

- Update BFT help system to include codebot command
- Integration with existing task loading infrastructure

## Implementation Phases

### Phase 1: Basic Container Setup ✅

- Nix-based OCI container image generation using existing flake infrastructure
- Reproducible development environment with all required dependencies
- BFT integration following existing task patterns
- **CI Integration**: Container image building validated automatically via
  GitHub Actions

### Phase 2: Claude Code Integration

- Container image loading and management
- Container orchestration and lifecycle management
- Interactive terminal I/O passthrough
- Credential mounting via read-only volumes for authentication

### Phase 3: Version Control Integration

- Sapling workspace initialization within containers
- GitHub integration and authentication setup
- Change management and commit workflows

### Phase 4: Polish and Production Readiness

- Cleanup and resource management (`--keep` flag implementation)
- Error handling and graceful failure recovery
- Testing, documentation, and user experience refinement

---

## Appendix: Documentation and Resources

### Apple macOS 26 Container Command

#### Official Apple Documentation

- **Apple Container Tool GitHub Repository**: https://github.com/apple/container
  - Official Swift-based container tool optimized for Apple silicon
- **Tutorial Guide**:
  https://github.com/apple/container/blob/main/docs/tutorial.md
  - Step-by-step walkthrough for building, running, and publishing containers
- **Technical Overview**:
  https://github.com/apple/container/blob/main/docs/technical-overview.md
  - Architecture details and technical implementation
- **macOS Tahoe 26 Release Notes**:
  https://developer.apple.com/documentation/macos-release-notes/macos-26-release-notes
  - Official release information about container features in macOS 26
- **Container API Documentation**:
  https://apple.github.io/container/documentation/
  - Complete API documentation for the container tool

#### Community Resources

- **Installation Guide**:
  https://4sysops.com/archives/install-apple-container-cli-running-containers-natively-on-macos-15-sequoia-and-macos-26-tahoe/
  - Detailed installation steps for macOS 15 and 26
- **Getting Started Tutorial**:
  https://swapnasagarpradhan.medium.com/getting-started-with-apples-container-cli-on-macos-a-native-alternative-to-docker-fc303e08f5cd
  - Comprehensive guide for using Apple's container CLI as Docker alternative

### Claude Code CLI

#### Official Anthropic Documentation

- **Claude Code Overview**:
  https://docs.anthropic.com/en/docs/claude-code/overview
  - Main documentation hub with installation and getting started
- **CLI Reference**:
  https://docs.anthropic.com/en/docs/claude-code/cli-reference
  - Complete command-line interface reference
- **Setup Guide**: https://docs.anthropic.com/en/docs/claude-code/setup
  - Detailed installation and configuration instructions
- **SDK Documentation**: https://docs.anthropic.com/en/docs/claude-code/sdk
  - Programmatic integration guide and Claude Code SDK

#### Community Resources

- **Claude Code Main Repository**: https://github.com/anthropics/claude-code
  - Official repository with source code and documentation
- **Awesome Claude Code**: https://github.com/hesreallyhim/awesome-claude-code
  - Curated collection of commands, workflows, and CLAUDE.md files
- **Complete Usage Guide**:
  https://www.siddharthbharath.com/claude-code-the-complete-guide/
  - Comprehensive tutorial covering all aspects of Claude Code

### Sapling SCM

#### Official Sapling Documentation

- **Sapling SCM Documentation**: https://sapling-scm.com/docs/introduction/
  - Central documentation hub with comprehensive guides
- **GitHub Integration Guide**: https://sapling-scm.com/docs/git/github/
  - Complete guide for GitHub integration and pull request workflows
- **Commands Reference**: https://sapling-scm.com/docs/category/commands/
  - Complete list of 48+ Sapling commands with detailed documentation
- **Pull Request Command**: https://sapling-scm.com/docs/commands/pr/
  - Detailed documentation for `sl pr` command and GitHub workflows

#### Related Resources

- **Sapling Main Repository**: https://github.com/facebook/sapling
  - Official repository with source code and latest updates
- **Meta Engineering Blog**:
  https://engineering.fb.com/2022/11/15/open-source/sapling-source-control-scalable/
  - Official announcement and technical deep-dive from Meta

### BFT (Bolt Foundry Tool) Task Runner

#### Local Codebase Files

- **Main BFT Entry Point**: `infra/bft/bin/bft.ts`
  - Command-line executable with dynamic task discovery
- **Core Task System**: `infra/bft/bft.ts`
  - Task definition interfaces and registry system
- **Example Task Implementations**:
  - `infra/bft/tasks/echo.bft.ts` - Basic echo task example
  - `infra/bft/tasks/test.bft.ts` - Test runner with filtering
  - `infra/bft/tasks/sl.bft.ts` - Enhanced Sapling commands with validation
  - `infra/bft/tasks/deck.bft.ts` - AI deck execution system

#### Task Implementation Patterns

- **TypeScript Tasks**: Export `bftDefinition` object with `TaskDefinition`
  interface
- **Deck Tasks**: Markdown files with TOML frontmatter for AI-driven commands
- **AI Safety System**: `aiSafe` flag and `requestApproval` mechanism for
  dangerous operations
- **Context System**: TOML files for defining AI conversation contexts

#### Development Dependencies

- `@bfmono/packages/cli-ui/cli-ui.ts` - UI utilities for consistent output
- `@bfmono/packages/logger/logger.ts` - Logging infrastructure
- `@bfmono/infra/bff/shellBase.ts` - Shell command execution utilitiesc
