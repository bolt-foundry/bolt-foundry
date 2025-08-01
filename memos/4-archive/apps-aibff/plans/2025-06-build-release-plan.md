# aibff Build and Release Plan

## Overview

This plan outlines the implementation of a robust build and release system for
the aibff binary. The system will integrate with the existing Bolt Foundry
infrastructure while providing standalone binary distribution via GitHub
releases.

## Goals

| Goal                  | Description                                    | Success Criteria                              |
| --------------------- | ---------------------------------------------- | --------------------------------------------- |
| BFF Integration       | Integrate aibff build into the bff task runner | `bff aibff:build` command works               |
| Multi-platform Builds | Support x64 Linux and arm64 macOS              | Binaries work on target platforms             |
| Automated Releases    | GitHub Actions workflow for releases           | One-click releases with version tags          |
| Version Management    | Track and display version information          | `aibff --version` shows correct version       |
| Binary Distribution   | Distribute via GitHub releases                 | Users can download platform-specific binaries |

## Architecture

### Build System Integration

The build system will have three layers:

1. **Core Build Script** (`bin/build.ts`)
   - Platform-aware compilation
   - Dependency extraction and optimization
   - Binary size optimization

2. **BFF Command** (`infra/bff/friends/aibff.bff.ts`)
   - Integrates with monorepo build pipeline
   - Provides consistent interface
   - Marked as AI-safe

3. **GitHub Actions** (`.github/workflows/publish-aibff-release.yml`)
   - Multi-platform matrix builds
   - Automated version updates
   - GitHub release creation

### Version Management

Version tracking will use:

- `version.ts` - Exported constant updated during releases
- Git tags - `aibff-v{version}` format
- GitHub releases - Binary distribution point

## Implementation Details

### 1. BFF Integration Command

Location: `infra/bff/friends/aibff.bff.ts`

```typescript
register(
  "aibff:build",
  "Build aibff binary",
  async () => {
    // Run the build script
    // Handle platform detection
    // Report build status
  },
  [],
  true,
); // AI-safe
```

### 2. Enhanced Build Script

Updates to `apps/aibff/bin/build.ts`:

- Platform detection and conditional compilation
- Version injection during build
- Build metadata (timestamp, commit hash)
- Output to platform-specific filenames

### 3. GitHub Actions Workflow

Key features:

- Matrix strategy for multiple platforms
- Nix environment for consistency
- Artifact upload for each platform
- GitHub release creation with all binaries

### 4. Release Process

1. Developer triggers workflow with version
2. Action builds for all platforms
3. Creates GitHub release with binaries
4. Tags repository
5. Updates version in codebase

## Platform Support

| Platform | Architecture | Binary Name        | Tested On    |
| -------- | ------------ | ------------------ | ------------ |
| Linux    | x64          | aibff-linux-x64    | Ubuntu 22.04 |
| macOS    | arm64        | aibff-darwin-arm64 | macOS 14     |

Future platforms can be added by extending the build matrix.

## File Structure

```
apps/aibff/
├── bin/
│   ├── build.ts          # Enhanced build script
│   ├── prepare-release.ts # Release preparation
│   └── create-release-notes.ts # Generate changelogs
├── version.ts            # Version constant
└── memos/plans/
    └── 2025-06-build-release-plan.md # This file

infra/bff/friends/
└── aibff.bff.ts         # BFF integration

.github/workflows/
└── publish-aibff-release.yml # Release workflow
```

## Security Considerations

- No secrets in binaries
- API keys via environment variables
- Signed releases (future)
- Checksum verification

## Testing Strategy

1. Local build testing on each platform
2. CI build verification
3. Binary smoke tests in workflow
4. Manual testing before release

## Rollout Plan

| Phase | Description                       | Timeline |
| ----- | --------------------------------- | -------- |
| 1     | BFF integration and build updates | Day 1    |
| 2     | GitHub Actions workflow           | Day 2    |
| 3     | First test release                | Day 3    |
| 4     | Documentation and refinement      | Day 4    |

## Success Metrics

- Binary size < 100MB
- Build time < 5 minutes
- Zero-config installation
- Works offline after download

## Open Questions

1. Should we sign binaries for security?
2. Do we need Windows support initially?
3. Should we add auto-update functionality?
4. Do we want to track download metrics?

## Next Steps

1. Implement BFF integration command
2. Update build script for multi-platform
3. Create GitHub Actions workflow
4. Test end-to-end release process
5. Document installation instructions
