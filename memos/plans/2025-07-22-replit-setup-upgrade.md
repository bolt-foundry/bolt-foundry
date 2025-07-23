# Implementation Memo: Simplified Replit Setup

**Date:** 2025-07-22\
**Author:** Claude Code\
**Status:** Draft\
**Priority:** High

## Executive Summary

This memo outlines a simplified approach to upgrading the Bolt Foundry
monorepo's Replit configuration. Instead of a comprehensive overhaul, we're
focusing on the essential need: setting up the run button to call
`bft dev boltfoundry-com`.

**Key Objective:**

- 🎯 **PRIMARY:** Configure Replit run button to execute
  `bft dev boltfoundry-com`
- 🧹 **SECONDARY:** Remove unnecessary complexity from current configuration
- ⚡ **TERTIARY:** Maintain existing Nix environment and essential features

## Simplified Implementation Strategy

### Phase 1: Essential Simplification (30 minutes)

#### 1.1 Simplify Primary Run Button

**Goal:** Make the main run button execute `bft dev boltfoundry-com`

Update `.replit` file to have a single, focused workflow:

```toml
[workflows]
runButton = "Run boltfoundry-com"

[[workflows.workflow]]
name = "Run boltfoundry-com"
mode = "sequential"
author = "simplified-setup"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "bft dev boltfoundry-com"
```

#### 1.2 Remove Complex Workflows

**Rationale:** Eliminate maintenance overhead and confusion

**Actions:**

- Remove all other workflow definitions (8+ complex workflows currently in
  .replit)
- Keep only the essential run command
- Configure ONLY ports for boltfoundry-com and Sapling

#### 1.3 Keep Essential Configuration

**What to Preserve:**

- Existing Nix environment (`replit.nix`) - works well as-is
- Language server configurations (Deno LSP, TypeScript LSP)
- Port mappings for boltfoundry-com and Sapling
- Cloud Run deployment configuration (remove in Phase 2)
- Environment variables and shell hooks
- SQLite database support (via Deno runtime)

## Minimal Configuration Template

The simplified `.replit` file should look like:

```toml
entrypoint = "README.md"

[nix]
channel = "stable-24_11"

[deployment]
deploymentTarget = "cloudrun"
build = ["./scripts/build.sh"]
run = ["sh", "-c", "WEB_PORT=9999 ./build/web"]

# Language Server Configuration (keep existing)
[languages.deno]
pattern = "**/*.{ts,js,tsx,jsx,json,jsonc,md,mdx}"
[languages.deno.languageServer]
start = ["deno", "lsp"]
[languages.deno.languageServer.initializationOptions]
enable = true
lint = true
config = "./deno.jsonc"

[languages.typescript]
pattern = "examples/**/*.{ts,tsx,js,jsx}"
[languages.typescript.languageServer]
start = ["typescript-language-server", "--stdio"]

# Simple workflow - just one button
[workflows]
runButton = "Run boltfoundry-com"

[[workflows.workflow]]
name = "Run boltfoundry-com"
mode = "sequential"
author = "simplified-setup"

[[workflows.workflow.tasks]]
task = "shell.exec"
args = "bft dev boltfoundry-com"

# Port configuration (boltfoundry-com + sapling)
[[ports]]
localPort = 8000
externalPort = 8000

[[ports]]
localPort = 8080
externalPort = 8080

[[ports]]
localPort = 8081
externalPort = 8081

# Sapling web interface
[[ports]]
localPort = 3011
externalPort = 3001

# Environment variables (keep existing)
[env]
HISTFILE = "$REPL_HOME/.cache/bash_history"
HISTCONTROL = "ignoredups"
HISTFILESIZE = "100000"
HISTSIZE = "10000"
INFRA_BIN_PATH = "$REPL_HOME/infra/bin"
PATH = "$INFRA_BIN_PATH:$PATH"
DENO_TRACE_PERMISSIONS="1"
DENO_NO_UPDATE_CHECK="1"

# Object storage (keep if used)
[objectStorage]
defaultBucketID = "replit-objstore-8028c9e1-a66e-4994-abdc-12c7efcd4d02"
```

### Phase 2: Remove Deployment Configuration (Future)

**Goal:** Remove Cloud Run deployment configuration to further simplify setup

**Actions:**

- Remove `[deployment]` section from `.replit`
- Remove `scripts/build.sh` dependency
- Remove deployment-related object storage if not needed for development

**Rationale:** Focus purely on development environment, handle deployment
separately

## Additional Required Task: Create BFT Land Command

**Issue:** The `land` functionality is still in BFF (`land.bff.ts`) but needs to
be available as `bft land`

**Current BFF land command does:**

- Pulls latest code from Sapling (`sl pull`)
- Goes to remote/main with clean state (`sl goto remote/main --clean`)
- Installs dependencies (`deno install`)
- Builds BFF (`bff build`)
- Generates Claude commands (`bft claudify`)
- Creates git commit with Sapling changes
- Handles .replit.local.toml merging
- Cleans up .env.local files

**Action Required:** Port `land.bff.ts` to `land.bft.ts` with updated commands:

- Change `bff build` → `bft build`
- Ensure all functionality works with BFT workflow
- Test the full land process with BFT

## What Gets Removed

### Phase 1 Removals

**Database Configuration:**

- PostgreSQL 16 module (switching to SQLite-only)

**Complex Workflows to Remove:**

- "BFF build and run" workflow
- "Run for development" parallel workflow
- "Run dev tools" workflow
- "Restart language server" workflow
- "Start next.js sample" workflow
- "Run E2E Tests" workflow
- "Run E2E Tests Only" workflow
- "Run internalbf.com" workflow
- "Run Collector" workflow
- Separator workflow

**Port Mappings to Remove:**

- Remove ALL existing port mappings (15+ currently configured)
- Keep ONLY the ports that `bft dev boltfoundry-com` uses (ports 8000,
  8080, 8081)
- Keep Sapling web interface port (3011 → 3001)
- Remove ports for: 3000, 3002, 3003, 3004, 3006, 3007, 5000, 5003, 5005, 5007,
  8001, 8888, 9999

### Phase 2 Removals (Future)

**Deployment Configuration:**

- Cloud Run deployment section
- Build script dependency
- Deployment-related object storage (if not needed for development)

## Benefits of Simplified Approach

**Immediate Benefits:**

- ✅ Eliminates confusion about which button to press
- ✅ Reduces maintenance overhead
- ✅ Focuses on the primary use case
- ✅ Faster implementation (30 minutes vs weeks)

**Maintained Capabilities:**

- ✅ Full development environment preserved
- ✅ Secret management continues to work
- ✅ Cloud Run deployment unchanged
- ✅ Language servers and intellisense preserved

## Implementation Steps

1. **Backup current `.replit`** - Save copy as `.replit.backup`
2. **Update workflows section** - Replace with single `bft dev boltfoundry-com`
   workflow
3. **Clean up port mappings** - Remove unused ports
4. **Test run button** - Verify `bft dev boltfoundry-com` executes correctly
5. **Update deployment** - Ensure build process still works

## Validation Checklist

- [ ] Run button executes `bft dev boltfoundry-com`
- [ ] Development server starts successfully
- [ ] Ports are accessible from Replit interface
- [ ] Language servers work (autocomplete, error detection)
- [ ] Deployment process unchanged
- [ ] Secret injection continues to work

## Future Considerations

**If Additional Workflows Needed Later:**

- Can easily add specific workflows on-demand
- Document how to temporarily add workflows for specific tasks

**Monitoring:**

- Track usage patterns to see if simplified setup meets needs
- Gather feedback on missing functionality
- Consider adding back specific workflows if there's clear demand

## Conclusion

This simplified approach focuses on the essential need while eliminating
complexity. It takes 30 minutes to implement versus weeks for a comprehensive
overhaul, and delivers immediate value by making the primary development
workflow obvious and reliable.
