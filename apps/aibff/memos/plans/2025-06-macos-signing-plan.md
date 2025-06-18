# macOS Code Signing and Notarization Implementation Plan

## Overview

This plan outlines the integration of macOS code signing and notarization capabilities directly into aibff as developer subcommands. This enables distribution of the aibff binary outside the Mac App Store without triggering Gatekeeper warnings, providing a smooth installation experience for users while maintaining the security requirements of modern macOS versions.

The implementation makes aibff self-contained for its own release process, allowing developers to build, sign, and notarize binaries using familiar tooling without external scripts or manual steps.

## Goals

| Goal | Description | Success Criteria |
| --- | --- | --- |
| Dev Command Integration | Add signing/notarization as aibff dev subcommands | `aibff dev sign` and `aibff dev notarize` commands work |
| Automated Signing | Sign binaries automatically in CI/CD | GitHub releases contain signed & notarized binaries |
| Local Developer Workflow | Enable local signing for testing | Developers can sign binaries with their certs |
| Notarization Support | Full notarization with stapling | Binaries pass `spctl -a -v` validation |
| Chainable Commands | Support command chaining | `aibff dev rebuild sign notarize` works |

## Anti-Goals

| Anti-Goal | Reason |
| --- | --- |
| Generic Signing Tool | Keep scope focused on aibff's own needs |
| Mac App Store Support | Different requirements and process |
| Auto-update Functionality | Separate concern, adds complexity |
| Windows Code Signing | Platform-specific implementation needed |
| Certificate Management | Rely on existing keychain/secrets |

## Technical Approach

The implementation extends aibff's command system with a new `dev` parent command containing subcommands for build operations. This approach keeps development tools organized while maintaining the simplicity of the main aibff commands.

Code signing will use the macOS `codesign` utility with hardened runtime enabled, while notarization will use Apple's `notarytool` for submission and status checking. Configuration will be environment-based to support both local development and CI/CD workflows.

The signing process will be integrated into the build workflow as an optional post-build step, allowing flexibility in when and how binaries are signed.

## Components

| Status | Component | Purpose |
| --- | --- | --- |
| [ ] | `commands/dev.ts` | Parent command handling subcommand routing |
| [ ] | `lib/macos-signing.ts` | Core signing and notarization utilities |
| [ ] | `macos-entitlements.plist` | Hardened runtime entitlements configuration |
| [ ] | Dev subcommands | rebuild, sign, notarize, validate commands |
| [ ] | Build integration | Optional signing in build.ts |
| [ ] | GitHub Actions updates | Automated release signing workflow |

## Technical Decisions

| Decision | Reasoning | Alternatives Considered |
| --- | --- | --- |
| Dev subcommands | Keeps dev tools organized, allows chaining | Separate top-level commands (too many) |
| Environment config | Standard practice, CI/CD friendly | Config files (security risk) |
| notarytool over altool | Apple's modern tool, better UX | altool (deprecated) |
| Post-build signing | Flexibility, separation of concerns | Integrated into compile (less flexible) |
| Hardened runtime | Required for notarization | No hardening (won't notarize) |

## Implementation Details

### Command Structure
```
aibff dev <subcommand> [options]

Subcommands:
  rebuild [--platform] [--arch] [--sign] [--notarize]
  sign [--identity <name>] [--entitlements <path>]
  notarize [--wait] [--apple-id <email>] [--team-id <id>]
  validate
```

### Environment Variables
- `AIBFF_SIGNING_IDENTITY` - Certificate name in keychain
- `AIBFF_NOTARIZE_APPLE_ID` - Apple ID for notarization
- `AIBFF_NOTARIZE_TEAM_ID` - Apple Developer Team ID
- `AIBFF_NOTARIZE_PASSWORD` - App-specific password

### Signing Flow
1. Build binary with `deno compile`
2. Sign with `codesign --deep --force --options runtime`
3. Create ZIP for notarization
4. Submit to Apple with `notarytool submit`
5. Wait for processing
6. Staple ticket with `notarytool staple`
7. Verify with `spctl -a -v`

## Prerequisites

Before implementation can be used:

1. **Developer ID Application Certificate**
   - Create at developer.apple.com
   - Install in macOS Keychain

2. **App-Specific Password**
   - Generate at appleid.apple.com
   - Store securely for notarization

3. **Apple Developer Team ID**
   - Find in Apple Developer account

## Next Steps

| Question | How to Explore |
| --- | --- |
| How to handle keychain access in CI? | Research GitHub Actions keychain setup |
| Should we cache notarization results? | Test notarization timing and limits |
| How to handle signing failures gracefully? | Implement retry logic and clear errors |
| What entitlements do we actually need? | Test minimal entitlements for CLI tool |
| How to test signed binaries in CI? | Set up macOS runner with validation |

## Testing Strategy

1. **Local Testing**
   - Sign with developer certificate
   - Validate with codesign and spctl
   - Test on different macOS versions

2. **CI Testing**
   - Import test certificate
   - Sign and validate in workflow
   - Test binary execution

3. **Integration Testing**
   - Full rebuild-sign-notarize flow
   - Cross-platform binary validation
   - User installation testing

## Success Metrics

- Zero Gatekeeper warnings on signed binaries
- Notarization completes in < 5 minutes
- Signing adds < 30 seconds to build time
- No manual steps in release process