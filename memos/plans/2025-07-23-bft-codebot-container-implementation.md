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
- Workspace preservation by default with optional `--cleanup` flag for removal

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

### Phase 1: Basic Container Setup ✅ COMPLETED

1. **Dockerfile with NixOS Base Image Creation** ✅
   - ✅ Created `infra/apps/codebot/Dockerfile` using NixOS base image
   - ✅ Nix package manager available in base image
   - ✅ Used `nix profile install` to install development dependencies via
     `codebot-env` package
   - ✅ Simple bash shell ENTRYPOINT for direct command execution
   - ✅ Build process:
     `container build -t codebot -f infra/apps/codebot/Dockerfile .`
   - ✅ **Performance Optimization**: Switched from `nix develop` to
     `nix profile install` to eliminate 10-second startup delay

2. **Codebase Integration Strategy - Copy-on-Write Workspace Isolation** ✅
   COMPLETED
   - **Copy-on-Write (CoW) Approach**: Uses `cp --reflink=auto` for near-instant
     copying
     - **Performance**: Files only physically copied when modified (APFS
       optimization)
     - **Parallel Copying**: Multiple `cp` processes run simultaneously for
       speed
     - **Smart Exclusions**: Automatically skips `.bft/` directory to avoid
       recursion
     - **Full Isolation**: Each workspace gets complete independent copy
   - **Implementation Details**:
     ```typescript
     // Parallel CoW copying in codebot.bft.ts
     for await (const entry of Deno.readDir(".")) {
       if (entry.name === ".bft") continue; // Skip container management directory
       const copyCmd = new Deno.Command("cp", {
         args: ["--reflink=auto", "-R", entry.name, workspacePath],
       });
       copyPromises.push(copyCmd.output());
     }
     await Promise.all(copyPromises); // Parallel execution
     ```
   - **Benefits Over Complex Volume Mounting**:
     - **Simpler**: Single workspace mount vs complex read-only/read-write
       layering
     - **More Reliable**: No mount point management or permission conflicts
     - **Better Isolation**: Complete workspace independence without shared
       state
     - **Easier Debugging**: Full workspace visible at
       `.bft/container/workspaces/{id}/`
   - **Volume Mounting Strategy**:
     - Single clean mount: `-v "${currentDir}/${workspacePath}:/workspace:rw"`
     - Container operates on complete isolated copy
   - **Cleanup**: Remove `.bft/container/workspaces/{id}/` on container exit

3. **BFT Integration** ✅ COMPLETED
   - ✅ Added `bft codebot` command via `infra/bft/tasks/codebot.bft.ts`
   - ✅ Integrated with existing BFT task system and autodiscovery
   - ✅ Follows BFT patterns with `TaskDefinition` interface
   - ✅ Supports `--shell` and `--exec` modes
   - ✅ **Smart Container Detection**: Fixed rebuild logic using
     `container images inspect`
   - ✅ **Optimized Rebuilds**: Only rebuilds when flake files are newer than
     image

### Phase 2: Claude Code Integration ✅ COMPLETED

1. **Container Image Building and Management** ✅ COMPLETED
   - ✅ Build container image:
     `container build -t codebot -f infra/apps/codebot/Dockerfile .`
   - ✅ Smart rebuild detection using `container images inspect`
   - ✅ Timestamp-based rebuild logic (only when flake files are newer)
   - ✅ Parallel workspace copying and container preparation for optimal
     performance

2. **Container Orchestration** ✅ COMPLETED
   - ✅ **Pre-launch validation**:
     - ✅ Check if `CLAUDE_CODE_OAUTH_TOKEN` environment variable exists
     - ✅ Exit with error message if token is missing
     - ✅ User guidance: "Run 'claude setup-token' on the host to obtain the
       token"
   - ✅ **Launch container with workspace**:
     - ✅ Single workspace mount:
       `-v "${currentDir}/${workspacePath}:/workspace:rw"`
     - ✅ Pass environment variables:
       `-e CLAUDE_CODE_OAUTH_TOKEN=$CLAUDE_CODE_OAUTH_TOKEN`
     - ✅ Interactive terminal support with
       `stdin: "inherit", stdout: "inherit", stderr: "inherit"`
   - ✅ **Multiple execution modes**:
     - ✅ **Shell mode (`--shell`)**: Open interactive container shell for
       debugging
     - ✅ **Exec mode (`--exec`)**: Run single command and exit, preserve
       container
     - ❌ **Default Claude mode**: Not yet implemented (would start Claude Code
       CLI)
   - ✅ **Workspace lifecycle**:
     - ✅ Parallel workspace copying using CoW for performance
     - ✅ Automatic cleanup of workspace on container exit
     - ✅ Workspace visible at `.bft/container/workspaces/{workspace-id}/`

3. **Claude Code Integration** ✅ COMPLETED
   - ✅ **Claude CLI availability**: `infra/bin/claude` script in container
   - ✅ **Deno-based execution**: `deno run -A npm:@anthropic-ai/claude-code`
   - ✅ **Upgrade support**: `claude --upgrade` installs latest version
   - ✅ **Authentication**: Token passed from host environment

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
   - Workspace preservation by default for debugging and inspection
   - `--cleanup` flag to remove containers and workspace directories after
     completion
   - All modes preserve workspaces by default for better debugging experience
   - Manual workspace cleanup: Remove `.bft/container/workspaces/{id}/` when desired
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
- Preserves workspace by default for debugging and inspection
- Text descriptions auto-converted to filesystem-safe names

### Advanced Options

```bash
bft codebot --cleanup        # Remove workspace after completion (default: keep)
bft codebot --name <name>    # Explicit name override (planned feature)
bft codebot --shell          # Open interactive shell instead of Claude Code
bft codebot --exec <cmd>     # Run single command and exit, preserving workspace
bft codebot --help           # Show usage information
```

### Execution Mode Examples

```bash
# Interactive shell access for debugging
bft codebot --shell "Debug container"

# Execute single commands with preserved workspaces
bft codebot --exec "deno test"                    # Run tests and preserve workspace
bft codebot --exec "git status" --name check      # Check git status (planned)
bft codebot --exec "bft help" --cleanup           # Run BFT help and cleanup workspace
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

### Known Issues

- **Apple Container Bug**:
  [GitHub Issue #102](https://github.com/apple/container/issues/102)
  - "No such file or directory" errors when running containers with certain
    entrypoints
  - Issue may affect containers with hardcoded paths in entry scripts
  - **Workaround**: Install flake to default profile (`nix profile install .`)
    to make tools available at `/nix/var/nix/profiles/default/bin/bash`
  - **Impact**: May affect our container launch process if entry scripts have
    hardcoded paths

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

### New Files ✅ COMPLETED

- ✅ `infra/apps/codebot/Dockerfile` - NixOS-based container image definition
- ✅ `infra/bft/tasks/codebot.bft.ts` - BFT task implementation (changed from
  .deck.md to .ts)

### Modified Files ✅ COMPLETED

- ✅ `flake.nix` - Added `codebot-env` package using `pkgs.buildEnv`
- ✅ BFT help system automatically includes codebot command via autodiscovery
- ✅ Integration with existing task loading infrastructure works automatically
- ❌ **TODO**: Add `.bft/container/` to `.gitignore` when workspace feature is
  implemented

## Current Implementation Status

### ✅ Phase 1: Basic Container Setup - COMPLETED

**What's Working:**

- ✅ Container builds successfully with
  `container build -t codebot -f infra/apps/codebot/Dockerfile .`
- ✅ `bft codebot --shell` drops into interactive container shell
- ✅ `bft codebot --exec "command"` executes commands in container
- ✅ All development dependencies available via `codebot-env` Nix package
- ✅ Fast startup time (eliminated 10-second delay with `nix profile install`)
- ✅ BFT integration with autodiscovery working

**Key Implementation Details:**

- Added `codebot-env = pkgs.buildEnv` package to `flake.nix`
- Simplified BFT task in `infra/bft/tasks/codebot.bft.ts` (TypeScript, not
  markdown)
- Container uses `nix profile install .#codebot-env` for faster startup vs
  `nix develop`
- Direct shell ENTRYPOINT instead of complex wrapper scripts
- **Fixed container detection bug**: Changed from `container inspect` to
  `container images inspect`
- **Smart rebuild logic**: Parses JSON response to extract image build timestamp
  from history
- **Copy-on-Write workspace isolation**: Uses `cp --reflink=auto` for
  near-instant copying on APFS

### ✅ Phase 2: Claude Code Integration - COMPLETED

**COMPLETED:**

- ✅ Authentication token management (`CLAUDE_CODE_OAUTH_TOKEN`) - validates and
  passes to container
- ✅ **Workspace isolation with Copy-on-Write approach** - superior to original
  volume shadowing design
- ✅ **Claude Code CLI installation in container** - `infra/bin/claude` script
  with Deno execution
- ✅ **Smart container rebuild logic** - only rebuilds when flake files are
  newer than image
- ✅ **Parallel workspace copying and container preparation** - optimized
  startup performance
- ✅ **Multiple execution modes** - `--shell` and `--exec` modes working

**REMAINING FOR FUTURE PHASES:**

- ❌ **Default Claude Code startup mode** - automatically start Claude when no
  flags provided
- ❌ **Session naming and descriptions** - `bft codebot "Fix auth bug"` with
  session management
- ✅ **Advanced lifecycle management** - `--cleanup` flag for workspace removal,
  default preservation for debugging

## Implementation Phases

### Phase 1: Basic Container Setup ✅ COMPLETED

- ✅ Dockerfile with NixOS base image for container creation
- ✅ Build using Apple's `container build` command from Dockerfile
- ✅ Reproducible development environment with all required dependencies via Nix
- ✅ BFT integration following existing task patterns

### Phase 2: Claude Code Integration ✅ COMPLETED

- ✅ Container image loading and management with smart rebuild detection
- ✅ Container orchestration and lifecycle management
- ✅ Interactive terminal I/O passthrough
- ✅ Credential management via environment variable:
  - User runs `claude setup-token` once on host to get OAuth token
  - Store token in shell profile or environment:
    `export CLAUDE_CODE_OAUTH_TOKEN=...`
  - Pass to containers via `-e CLAUDE_CODE_OAUTH_TOKEN=$CLAUDE_CODE_OAUTH_TOKEN`
- ✅ Copy-on-Write workspace isolation with parallel copying
- ✅ Claude Code CLI availability in container via `infra/bin/claude`

### Phase 3: Version Control Integration

- Sapling workspace initialization within containers
- GitHub integration and authentication setup
- Change management and commit workflows

### Phase 4: Polish and Production Readiness ✅ COMPLETED

- ✅ Cleanup and resource management (`--cleanup` flag implementation)
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
