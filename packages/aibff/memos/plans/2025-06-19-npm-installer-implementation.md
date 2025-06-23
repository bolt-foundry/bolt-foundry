# AIBFF NPM Installer Implementation Plan

## Overview

The packages/aibff directory serves as an npm installer package that enables users to install and run the aibff CLI tool through standard npm/npx workflows. Rather than requiring users to manually download binaries or build from source, this package provides a seamless installation experience that downloads platform-specific pre-built binaries from GitHub releases during the npm install process.

This approach allows users to install aibff globally with `npm install -g aibff` or run it directly with `npx aibff`, making the tool accessible to a broader audience who are familiar with npm-based tooling.

## Goals

| Goal | Description | Success Criteria |
| ---- | ----------- | ---------------- |
| NPM Installation | Enable installation via npm/npx | Users can run `npm install -g aibff` or `npx aibff` |
| Platform Support | Download correct binary for user's platform | Works on Linux x64 and macOS arm64 |
| Seamless Experience | Install process "just works" | No manual steps required after npm install |
| Version Management | Match npm package version to GitHub release | `npm install aibff@1.2.3` downloads binary from `aibff-v1.2.3` release |
| Error Handling | Graceful failure with helpful messages | Clear errors for unsupported platforms or network issues |

## Anti-Goals

| Anti-Goal | Reason |
| --------- | ------ |
| Building from source | Requires Deno runtime and increases install complexity |
| Bundling all binaries | Would make npm package unnecessarily large (100MB+) |
| Complex dependency management | Keep it simple - just download and run |
| Platform auto-detection fallbacks | Better to fail clearly than guess wrong |

## Technical Approach

The installer package follows a post-install script pattern commonly used for binary distribution through npm. When a user installs the package, npm runs our post-install script which:

1. Detects the user's platform and architecture
2. Reads the version from package.json
3. Queries GitHub releases API for the specific release matching the npm package version (tag: `aibff-v{version}`)
4. Downloads the appropriate platform-specific binary
5. Places it in the bin/ directory with proper permissions
6. Provides a Node.js wrapper script that executes the binary from bin/

This approach balances simplicity, reliability, and user experience. The package remains small (only containing scripts), while still providing native binary performance.

## Components

| Status | Component | Purpose |
| ------ | --------- | ------- |
| [x] | install.js | Post-install script that downloads platform-specific binary |
| [x] | bin/aibff | Node.js wrapper script that executes the downloaded binary |
| [x] | package.json | NPM package configuration with metadata and scripts |
| [x] | README.md | User-facing documentation for installation and usage |
| [ ] | .npmignore | Control which files are published to npm |
| [ ] | memos/plans/ | This implementation plan and versioning strategy |

## Technical Decisions

| Decision | Reasoning | Alternatives Considered |
| -------- | --------- | ---------------------- |
| Post-install download | Keeps package small, version-specific binary | Bundle all binaries (too large), build from source (complex) |
| GitHub releases hosting | Free, reliable, integrates with our CI | S3, CDN, or bundled binaries |
| Platform-specific naming | Clear binary identification, standard pattern | Single binary name (ambiguous), version in name (complex) |
| Node.js wrapper script | Handles cross-platform execution, passes args | Direct binary execution (doesn't work with npm bin) |
| Manual binary download | Simple, explicit, easy to debug | Using npm binary packages (more complex) |

## Next Steps

| Question | How to Explore |
| -------- | -------------- |
| Version synchronization? | Package.json version must match GitHub release tag for downloads to work |
| CI/CD automation? | What triggers new releases and npm publishes? |
| Fallback mirrors? | Should we support alternative download locations? |
| Development workflow? | How do developers test installer changes locally? |
| Pre-release support? | Consider auto-publishing prereleases with git hash (e.g., 0.0.1-abc123) |
| Offline installation? | Should we document offline installation process? |

## Implementation Details

### Binary Naming Convention

Platform-specific binaries follow the pattern: `aibff-{platform}-{arch}`
- macOS ARM64: `aibff-darwin-aarch64`
- Linux x64: `aibff-linux-x86_64`
- Windows x64: `aibff-windows-x86_64.exe`

### Error Scenarios

1. **Unsupported Platform**: Clear message listing supported platforms
2. **Network Failure**: Suggest checking connection and proxy settings
3. **GitHub API Rate Limit**: Advise waiting or using authenticated requests
4. **Binary Execution Failure**: Suggest manual download with direct link
5. **Version Not Found**: List available versions and suggest using a different version

### Integration with BFF

The package integrates with the existing BFF build system:
- `bff aibff:build` - Build binary for current platform
- `bff aibff:build:all` - Build binaries for all platforms
- Both commands are marked as AI-safe for automated workflows

### Publishing Workflow

The project uses a GitHub Actions manual workflow (`publish-aibff-release.yml`) for creating releases:

1. **Manual Trigger**: Developer triggers the workflow with a version input
2. **Version Update**: Workflow updates `apps/aibff/version.ts` with the new version
3. **Binary Build**: Builds all platform binaries with platform-specific naming
4. **GitHub Release**: Creates release with tag `aibff-v{version}` and uploads binaries

**NPM Publishing** (currently manual):
1. After GitHub release is created, update `packages/aibff/package.json` version to match
2. Run `npm publish` from packages/aibff directory
3. This ensures version sync: `npm install aibff@1.2.3` can find `aibff-v1.2.3` GitHub release

**Prerelease Strategy** (future enhancement):
1. Every commit to main triggers automatic prerelease
2. Version format: `{base-version}-{git-hash}` (e.g., `0.0.1-abc123`)
3. Published to npm with `@next` tag: `npm install aibff@next`
4. Binaries stored as GitHub Actions artifacts (not full releases)
5. Installer downloads from Actions artifacts for prerelease versions

Note: Prerelease support will be implemented as a separate workflow after stable releases are working.

## Success Metrics

- Installation completes in under 30 seconds on typical connection
- Zero manual steps required for supported platforms
- Clear error messages for all failure scenarios
- Works with both npm and yarn package managers
- Supports standard npm features (specific versions, local install, etc.)