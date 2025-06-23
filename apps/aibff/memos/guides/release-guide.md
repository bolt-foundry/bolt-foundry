# aibff Release Guide

This guide documents the complete release process for aibff binaries.

## Overview

The aibff release process uses GitHub Actions to build and distribute
platform-specific binaries. There are two types of releases:

1. **Development Releases** - Automatically created when code changes are merged
2. **Stable Releases** - Manually triggered for production-ready versions

## Prerequisites

- Write access to the repository
- Ability to trigger GitHub Actions workflows

## Development Releases (Automatic)

Development releases happen automatically when changes to `apps/aibff/**` are
merged to the main branch. These releases:

- Are tagged as pre-releases on GitHub
- Include the git commit hash in the version (e.g., `0.1.0-dev-abc123`)
- Are built for all supported platforms
- Can be used for testing and early feedback

No manual intervention is required for dev releases.

## Stable Release Process

### 1. Determine Version Number

Since `version.ts` always contains the development version (e.g., `0.1.0-dev`),
you'll need to decide on the stable version number based on:

- Current development version in `version.ts`
- Scope of changes since last stable release
- Semantic versioning rules (MAJOR.MINOR.PATCH)

### 2. Trigger the Release Workflow

No code changes are needed for stable releases:

1. Go to [GitHub Actions](../../.github/workflows/publish-aibff-release.yml)
2. Click on "Publish aibff Release" workflow
3. Click "Run workflow"
4. Enter the version number (e.g., `0.1.0`)
5. Check "Is this a prerelease?" if applicable
6. Click "Run workflow"

The workflow will:

- Build binaries for all supported platforms
- Create platform-specific archives with checksums
- Create a GitHub release with download links

### 3. Post-Release Steps

After creating a stable release:

1. **Update version.ts for next development cycle**:
   ```bash
   # If you just released 0.1.0, update to:
   # export const VERSION = "0.2.0-dev";
   ```

2. **Commit the version bump**:
   ```bash
   sl commit -m "Bump version to 0.2.0-dev"
   ```

This ensures the codebase is ready for the next development cycle.

### 4. Verify the Release

1. Check the [Releases page](https://github.com/YOUR_REPO/releases)
2. Verify all platform binaries are attached
3. Test download links and checksums
4. Verify installation instructions in release notes

## Local Development

### Building Locally

```bash
# Build for current platform
bff aibff:build

# Build for specific platform
bff aibff:build --platform linux --arch x86_64
bff aibff:build --platform windows --arch x86_64
bff aibff:build --platform darwin --arch aarch64
```

Built binaries are placed in `build/bin/`.

### Testing Binaries

```bash
# Test the binary
build/bin/aibff --version
build/bin/aibff --help

# Run evaluation
build/bin/aibff eval grader.deck.md samples.jsonl
```

## Supported Platforms

| Platform | Architecture | Binary Name              | Notes                    |
| -------- | ------------ | ------------------------ | ------------------------ |
| Linux    | x64          | aibff-linux-x86_64       | Built on Ubuntu          |
| Windows  | x64          | aibff-windows-x86_64.exe | Cross-compiled           |
| macOS    | ARM64        | aibff-darwin-aarch64     | Apple Silicon (M1/M2/M3) |

## Version Management Strategy

The project uses a dual versioning approach:

### Source Code Version

- Always shows development version in `version.ts` (e.g., `0.1.0-dev`)
- Updated manually after stable releases to next dev version
- Never contains stable version numbers

### Release Versions

- **Dev releases**: `0.1.0-dev-{git-hash}` (automatic)
- **Stable releases**: `0.1.0` (manual)
- Git tags and GitHub releases are the source of truth

### Version Numbering

Follow semantic versioning:

- `MAJOR.MINOR.PATCH` for stable releases (e.g., `1.0.0`)
- `MAJOR.MINOR.PATCH-PRERELEASE` for manual prereleases (e.g., `1.0.0-beta1`)

## Troubleshooting

### Build Failures

If the GitHub Action fails:

1. Check the workflow logs for specific errors
2. Ensure `node_modules` is npm-managed (not Deno-managed)
3. Verify all dependencies are installed with `npm ci`

### Binary Size Issues

Normal binary sizes:

- Linux: ~65-70 MB
- Windows: ~65-70 MB
- macOS: ~65-70 MB

If binaries are significantly larger, check for:

- Unnecessary npm dependencies
- Large static assets

## Future Enhancements

The following features are planned but not yet implemented:

1. **macOS Code Signing** - See [macOS Signing Guide](./macos-signing-guide.md)
2. **Automated Version Bumping** - Auto-increment patch versions
3. **Release Changelogs** - Generate from commit messages
4. **Binary Size Optimization** - Further reduce binary sizes

## Related Documentation

- [Build and Release Plan](../plans/2025-06-build-release-plan.md)
- [macOS Signing Guide](./macos-signing-guide.md)
- [Stable Release Workflow](../../../../.github/workflows/publish-aibff-release.yml)
- [Dev Release Workflow](../../../../.github/workflows/publish-aibff-dev.yml)
