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

### Technology Choice: Apple Container with Dockerfile

**Decision**: Use Apple's native `container` command with Dockerfile for
building

**Rationale**:

- Apple's container command supports building from Dockerfiles via
  `container build`
- Works around the direct container usage bug while still using native tooling
- NixOS base image in Dockerfile provides reproducible builds
- Native Swift implementation optimized for Apple Silicon
- Full OCI compliance for compatibility

**Tradeoffs**:

- ✅ Native macOS integration with better performance
- ✅ Works with Dockerfiles to bypass direct container bug
- ✅ Leverages existing Nix infrastructure via Dockerfile
- ✅ Better resource efficiency on Apple Silicon
- ❌ Limited to macOS 26+ (beta only)
- ❌ Less mature than Docker ecosystem

## Implementation Plan

### Phase 1: Basic Container Setup

1. **Dockerfile with NixOS Base Image Creation**
   - Create `infra/apps/codebot/Dockerfile` using NixOS base image
   - Install Nix package manager in container
   - Use Nix to install development shell dependencies (Deno, Sapling, Claude
     Code CLI)
   - No ENTRYPOINT - BFT will pass commands directly
   - Build process: `container build -t bft-codebot infra/apps/codebot/`

2. **Codebase Integration Strategy**
   - Copy current working directory to workspace before container starts:
     - Simple recursive copy: `cp -r . .bft/container/workspaces/{id}/`
     - Preserves current state including uncommitted changes
   - Each container gets independent workspace directory:
     - Named containers: `.bft/container/workspaces/{name}/`
     - Anonymous containers: `.bft/container/workspaces/{random-id}/`
     - Mount as `-v "$(pwd)/.bft/container/workspaces/{id}:/workspace:rw"`
   - Simple permission model (accepting trade-offs):
     - Container has full read-write access
     - Host can read and technically write (but shouldn't)
     - Rely on user discipline to treat as read-only
     - No complex permission management needed
   - Use Nix-built base image with development environment dependencies
   - Handle .gitignore/.saplingignore/.flakeignore patterns appropriately
   - `.bft/container/` is gitignored to prevent committing container state
   - Enables host tools (VSCode, editors) for code browsing
   - Each container remains isolated with its own workspace

3. **BFT Integration**
   - Add `bft codebot` command to existing BFT task system
   - Integrate with current `.bft.ts` and task deck infrastructure
   - Follow existing BFT patterns and conventions

### Phase 2: Claude Code Integration

1. **Container Image Building and Management**
   - Build container image: `container build -t bft-codebot infra/apps/codebot/`
   - Use Apple's container image management
   - Tag images with versions for tracking
   - Clean up old images periodically

2. **Container Orchestration**
   - Pre-launch validation:
     - Check if `CLAUDE_CODE_OAUTH_TOKEN` environment variable exists
     - Exit with error message if token is missing
     - First-time setup: User runs `claude setup-token` on host to obtain token
   - Launch container with mounted volumes:
     - `-v "$(pwd)/.bft/container/workspaces/{id}:/workspace:rw"` for workspace
     - `-v "$HOME/.ssh:/root/.ssh:ro"` for SSH keys
     - `-v "$HOME/.config/gh:/root/.config/gh:ro"` for GitHub CLI
     - `-v "$HOME/Library/Preferences/sapling:/root/Library/Preferences/sapling:ro"`
       for Sapling config
   - Pass environment variables:
     - `-e CLAUDE_CODE_OAUTH_TOKEN=$CLAUDE_CODE_OAUTH_TOKEN`
     - `-e TERM=$TERM` for proper terminal support
     - `-e GH_REPO=bolt-foundry/bolt-foundry` for GitHub CLI default repo
   - Set working directory: `-w /workspace`
   - Workspace already copied to host directory before container start
   - BFT passes command directly to container (no Dockerfile ENTRYPOINT)
   - Support multiple execution modes:
     - **Default**: Start Claude Code CLI with command:
       `claude --dangerously-skip-permissions [description]` where
       `[description]` is the session description if provided
     - **Shell mode (`--shell`)**: Open interactive shell for debugging
     - **Exec mode (`--exec`)**: Run single command and exit, preserve container
   - Pass through terminal I/O for interactive sessions

### Phase 3: Version Control Integration

1. **Sapling Setup**
   - Sapling should work automatically with mounted configs
   - User identity comes from host's
     `~/Library/Preferences/sapling/sapling.conf`
   - GitHub authentication via mounted `~/.config/gh/` directory
   - SSH authentication via mounted `~/.ssh/` keys

2. **Change Management**
   - Enable Claude Code to commit changes within container
   - Support pushing changes to GitHub via sapling
   - Maintain commit attribution and metadata

### Phase 4: Cleanup and Management

1. **Lifecycle Management**
   - Automatic container cleanup on completion (default)
   - `--keep` flag to preserve containers and workspace directories for
     debugging
   - `--exec` mode automatically preserves containers for future commands
   - Workspace cleanup: Remove `.bft/container/workspaces/{id}/` on container
     removal
   - Workspace listing: `ls .bft/container/workspaces/`
   - Resource monitoring and cleanup policies

2. **Error Handling**
   - Graceful handling of container failures
   - Proper cleanup on interruption or errors
   - Logging and debugging capabilities

## Command Interface

### Basic Usage

```bash
bft codebot                           # Anonymous session with random ID
bft codebot "Let's work on rlhf"      # Named session: lets-work-on-rlhf
bft codebot "Fix authentication bug"  # Named session: fix-authentication-bug
```

- Creates isolated container with independent workspace directory
- Workspace visible at `.bft/container/workspaces/{id}/` for host browsing
- Launches Claude Code CLI interactively with `--dangerously-skip-permissions`
  flag
- Session description passed as initial prompt to Claude (if provided)
- Automatically cleans up container and workspace on exit
- Text descriptions auto-converted to filesystem-safe names

### Advanced Options

```bash
bft codebot --keep           # Preserve container after completion
bft codebot --name <name>    # Explicit name override
bft codebot --shell          # Open interactive shell instead of Claude Code
bft codebot --exec <cmd>     # Run single command and exit, but keep container running
bft codebot --help           # Show usage information
```

### Execution Mode Examples

```bash
# Interactive shell access for debugging
bft codebot --shell "Debug container"

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
- Nix package manager with flakes support (for development)
- Claude Code CLI available (will authenticate within container)

### Dependencies

- Existing BFT task runner infrastructure
- Nix flakes infrastructure and FlakeHub integration
- Current development shell configuration in `flake.nix`
- Proper authentication setup for GitHub/sapling integration
- `CLAUDE_CODE_OAUTH_TOKEN` environment variable must be set

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

### Unit Tests

- Container creation and teardown
- Codebase copying functionality
- BFT integration points

Example test structure for `infra/apps/codebot/codebot.test.ts`:

```typescript
import { assertEquals } from "@std/assert";
import { exec } from "@bfmono/packages/exec";

Deno.test("bft codebot - creates workspace directory", async () => {
  const workspaceId = "test-" + crypto.randomUUID();
  const workspacePath = `.bft/container/workspaces/${workspaceId}`;

  // Clean up before test
  await Deno.remove(workspacePath, { recursive: true }).catch(() => {});

  // Run codebot setup (without actually starting container)
  const result = await exec("bft", [
    "codebot",
    "--dry-run",
    "--name",
    workspaceId,
  ]);

  // Verify workspace was created
  const stat = await Deno.stat(workspacePath);
  assertEquals(stat.isDirectory, true);

  // Clean up
  await Deno.remove(workspacePath, { recursive: true });
});

Deno.test("bft codebot - mounts volumes correctly", async () => {
  // Test that volume mount commands are generated correctly
  const result = await exec("bft", ["codebot", "--dry-run", "--show-mounts"]);

  // Verify all expected mounts are present
  assert(result.stdout.includes("-v $(pwd)/.bft/container/workspaces/"));
  assert(result.stdout.includes("-v $HOME/.ssh:/root/.ssh:ro"));
  assert(result.stdout.includes("-e CLAUDE_CODE_OAUTH_TOKEN="));
});
```

### Integration Tests

- End-to-end workflow validation
- Sapling integration testing
- Multiple container scenarios

Integration test example:

```typescript
Deno.test("bft codebot - full container lifecycle", async (t) => {
  const workspaceId = "integration-test-" + Date.now();

  await t.step("create and start container", async () => {
    // Start container in background
    const proc = new Deno.Command("bft", {
      args: ["codebot", "--name", workspaceId, "--exec", "echo 'test'"],
      stdout: "piped",
    }).spawn();

    const output = await proc.output();
    assertEquals(output.success, true);
  });

  await t.step("verify workspace exists", async () => {
    const workspacePath = `.bft/container/workspaces/${workspaceId}`;
    const stat = await Deno.stat(workspacePath);
    assertEquals(stat.isDirectory, true);

    // Check that source was copied
    const denoJson = await Deno.stat(`${workspacePath}/deno.json`);
    assertEquals(denoJson.isFile, true);
  });

  await t.step("cleanup", async () => {
    await exec("container", ["rm", "-f", `bft-codebot-${workspaceId}`]);
    await Deno.remove(`.bft/container/workspaces/${workspaceId}`, {
      recursive: true,
    });
  });
});
```

### Manual Testing

- Real-world usage scenarios
- Performance and resource monitoring
- Error condition handling

## Files to Modify/Create

### New Files

- `infra/apps/codebot/` - Main implementation directory
- `infra/bft/tasks/codebot.bft.deck.md` - BFT task wrapper
- `infra/apps/codebot/Dockerfile` - NixOS-based Docker image definition

### Modified Files

- Update BFT help system to include codebot command
- Integration with existing task loading infrastructure
- Add `.bft/container/` to `.gitignore` to exclude container workspaces

## Implementation Phases

### Phase 1: Basic Container Setup ✅

- Dockerfile with NixOS base image for container creation
- Build using Apple's `container build` command from Dockerfile
- Reproducible development environment with all required dependencies via Nix
- BFT integration following existing task patterns

### Phase 2: Claude Code Integration

- Container image loading and management
- Container orchestration and lifecycle management
- Interactive terminal I/O passthrough
- Credential management via environment variable:
  - User runs `claude setup-token` once on host to get OAuth token
  - Store token in shell profile or environment:
    `export CLAUDE_CODE_OAUTH_TOKEN=...`
  - Pass to containers via `-e CLAUDE_CODE_OAUTH_TOKEN=$CLAUDE_CODE_OAUTH_TOKEN`

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
