# macOS Code Signing and Notarization Implementation Plan

## Overview

This plan implements code signing and notarization for the aibff macOS binary to
eliminate Gatekeeper warnings and provide Apple security verification through
the existing GitHub Actions release workflow.

## Goals

| Goal               | Description                                             | Success Criteria                               |
| ------------------ | ------------------------------------------------------- | ---------------------------------------------- |
| Code Signing       | Sign macOS binary with Developer ID certificate         | Binary passes `codesign -v` verification       |
| Notarization       | Submit signed binary to Apple for security verification | Binary passes `spctl -a -t exec` check         |
| Automated Workflow | Integrate signing into existing GitHub Actions          | No manual steps required for signed releases   |
| User Experience    | Eliminate Gatekeeper warnings on macOS                  | Users can run binary without security warnings |

## Anti-Goals

| Anti-Goal                  | Reason                                                |
| -------------------------- | ----------------------------------------------------- |
| Signing other platforms    | Only macOS requires this type of signing              |
| App Store distribution     | Binary is distributed directly, not through App Store |
| Multiple certificate types | Only need Developer ID Application certificate        |
| Self-hosted runners        | Keep using GitHub-hosted runners for simplicity       |

## Prerequisites

### Apple Developer Account Setup

1. **Certificate Creation:**

   **Step 1: Create Certificate Signing Request (CSR)**
   - Open Keychain Access on macOS
   - Menu: Keychain Access > Certificate Assistant > Request a Certificate from
     a Certificate Authority
   - Enter your email address (same as Apple ID)
   - Enter "aibff macOS signing" as Common Name
   - Select "Saved to disk" and "Let me specify key pair information"
   - Click Continue, save as `aibff-signing.certSigningRequest`
   - Key Size: 2048 bits, Algorithm: RSA

   **Step 2: Generate Certificate in Apple Developer Portal**
   - Login to [developer.apple.com](https://developer.apple.com)
   - Navigate to Certificates, Identifiers & Profiles
   - Click "+" to create new certificate
   - Select "Developer ID Application" under "Software"
   - Upload the CSR file created in Step 1
   - Download the generated certificate (.cer file)

   **Step 3: Install and Export Certificate**
   - Double-click the downloaded .cer file to install in Keychain Access
   - In Keychain Access, find the "Developer ID Application" certificate
   - Right-click > Export "Developer ID Application: [Your Name]"
   - Save as .p12 file with a strong password
   - Record this password for GitHub secrets

2. **App-Specific Password:**
   - Generate app-specific password at appleid.apple.com
   - Use for notarization API authentication

3. **Team ID:**
   - Located in Apple Developer portal membership section
   - Required for notarization

### GitHub Secrets Setup

Add these repository secrets:

| Secret Name                  | Description                     | Example                        |
| ---------------------------- | ------------------------------- | ------------------------------ |
| `APPLE_CERTIFICATE_BASE64`   | Base64 encoded .p12 certificate | `base64 -i cert.p12 \| pbcopy` |
| `APPLE_CERTIFICATE_PASSWORD` | Certificate password            | `MySecurePassword123`          |
| `APPLE_ID`                   | Apple ID email                  | `developer@company.com`        |
| `APPLE_APP_PASSWORD`         | App-specific password           | `abcd-efgh-ijkl-mnop`          |
| `APPLE_TEAM_ID`              | Apple Developer Team ID         | `ABCD123EFG`                   |

## Technical Implementation

> **Updated for Deno 2.x Code Signing Compatibility**
>
> Deno 2.x includes code signing compatibility (fixed in Deno 1.46 PR #24604).
> While this resolves binary corruption issues, manual codesign commands are
> still required as Deno doesn't automatically detect certificates from
> keychain.

### 1. Workflow Modifications

Update `.github/workflows/publish-aibff-release.yml`:

#### Update macOS Build Job for Signing

```yaml
build-and-sign-macos:
  name: Build and Sign macOS Binary
  runs-on: macos-latest
  steps:
    # ... existing checkout and setup steps ...
    - name: Import Code Signing Certificate
      env:
        APPLE_CERTIFICATE_BASE64: ${{ secrets.APPLE_CERTIFICATE_BASE64 }}
        APPLE_CERTIFICATE_PASSWORD: ${{ secrets.APPLE_CERTIFICATE_PASSWORD }}
      run: |
        # Create temporary keychain for certificate
        security create-keychain -p "" build.keychain
        security set-keychain-settings -lut 21600 build.keychain
        security unlock-keychain -p "" build.keychain
        security list-keychains -d user -s build.keychain login.keychain

        # Import certificate
        echo $APPLE_CERTIFICATE_BASE64 | base64 --decode > certificate.p12
        security import certificate.p12 -k build.keychain -P $APPLE_CERTIFICATE_PASSWORD -T /usr/bin/codesign
        security set-key-partition-list -S apple-tool:,apple:,codesign: -s -k "" build.keychain

        # Clean up certificate file
        rm certificate.p12

    - name: Build macOS Binary
      run: |
        # Build unsigned binary first
        nix develop --impure --command deno run --allow-all apps/aibff/main.ts rebuild --platform darwin --arch aarch64

    - name: Sign macOS Binary
      run: |
        # Sign the binary with Developer ID certificate
        codesign --force --options runtime --sign "Developer ID Application" build/bin/aibff-darwin-aarch64

        # Verify signature
        codesign -v build/bin/aibff-darwin-aarch64
        codesign -dv build/bin/aibff-darwin-aarch64

    - name: Notarize macOS Binary
      env:
        APPLE_ID: ${{ secrets.APPLE_ID }}
        APPLE_APP_PASSWORD: ${{ secrets.APPLE_APP_PASSWORD }}
        APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
      run: |
        # Create archive for notarization
        ditto -c -k --keepParent build/bin/aibff-darwin-aarch64 aibff-darwin-aarch64.zip

        # Submit for notarization
        xcrun notarytool submit aibff-darwin-aarch64.zip \
          --apple-id $APPLE_ID \
          --password $APPLE_APP_PASSWORD \
          --team-id $APPLE_TEAM_ID \
          --wait

        # Staple notarization ticket
        xcrun stapler staple build/bin/aibff-darwin-aarch64

        # Verify notarization
        spctl -a -t exec build/bin/aibff-darwin-aarch64

        # Clean up
        rm aibff-darwin-aarch64.zip
```

#### Update Job Dependencies

```yaml
create-release:
  needs: [build-and-release, build-and-sign-macos]
```

### 2. Entitlements File

Create `apps/aibff/entitlements.plist` for hardened runtime requirements:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.disable-library-validation</key>
    <true/>
</dict>
</plist>
```

### 3. Archive Process Updates

Update archive creation to use signed binary:

```yaml
- name: Create macOS Archive
  run: |
    cd build/bin
    tar -czf aibff-darwin-aarch64.tar.gz --transform 's/aibff-darwin-aarch64/aibff/' aibff-darwin-aarch64
    sha256sum aibff-darwin-aarch64.tar.gz > aibff-darwin-aarch64.tar.gz.sha256
```

## Testing Strategy

### 1. Local Testing

```bash
# Verify signature
codesign -v --verbose=4 aibff-darwin-aarch64

# Check notarization
spctl -a -t exec -v aibff-darwin-aarch64

# Test execution
./aibff-darwin-aarch64 --version
```

### 2. CI Testing

- Add workflow step to verify signed binary
- Test binary execution after signing
- Validate archive integrity

### 3. Release Testing

- Download release artifact
- Extract and run binary
- Verify no Gatekeeper warnings

## Error Handling

### Common Issues and Solutions

| Issue                  | Cause                  | Solution                              |
| ---------------------- | ---------------------- | ------------------------------------- |
| Certificate not found  | Wrong certificate name | Check `security find-identity -v`     |
| Notarization rejected  | Missing entitlements   | Add hardened runtime entitlements     |
| Keychain access denied | Partition list not set | Run `security set-key-partition-list` |
| Notarization timeout   | Apple service issues   | Retry with exponential backoff        |

### Monitoring

- Add status checks for signing steps
- Log certificate details (without secrets)
- Capture notarization request IDs for tracking

## Security Considerations

### Certificate Protection

- Use temporary keychain for signing
- Delete certificate after use
- Rotate app-specific passwords regularly

### Secret Management

- Store certificates as base64 to avoid binary data issues
- Use repository secrets, not environment variables
- Limit secret access to necessary workflows

## Documentation Updates

### Installation Instructions

Update README.md to highlight signed binaries:

````markdown
## macOS Installation

The macOS binary is signed and notarized by Apple:

```bash
# Download and extract
curl -L https://github.com/.../aibff-darwin-aarch64.tar.gz | tar xz

# Run without Gatekeeper warnings
./aibff --version
```
````

### Release Notes Template

Add signing information to release notes:

```markdown
## Security

- macOS binary is signed with Developer ID certificate
- Notarized by Apple for additional security verification
- No Gatekeeper warnings on macOS 10.15+
```

## Timeline

| Phase              | Tasks                                         |
| ------------------ | --------------------------------------------- |
| **Setup**          | Export certificates, configure secrets        |
| **Implementation** | Modify workflow, add signing and entitlements |
| **Testing**        | Local and CI testing, troubleshooting         |
| **Documentation**  | Update README, release notes                  |
| **Deployment**     | Test full release process                     |

## Success Criteria

- [ ] macOS binary passes `codesign -v` verification
- [ ] Binary passes `spctl -a -t exec` check
- [ ] No Gatekeeper warnings when running binary
- [ ] Signing integrated into existing GitHub Actions workflow
- [ ] Documentation updated with signing information
- [ ] Full release process tested successfully

## Future Enhancements

1. **Automated certificate renewal alerts**
2. **Signing for development builds**
3. **Universal binary support (x86_64 + ARM64)**
4. **Installer package signing**
5. **Investigate Deno compile flags for custom signing options**

## Resources

- [Apple Code Signing Documentation](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [GitHub Actions macOS Signing Examples](https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-apple-app-store)
- [notarytool Command Reference](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow)
- [Deno Code Signing PR #24604](https://github.com/denoland/deno/pull/24604) -
  Built-in signing implementation
- [Deno Compile Documentation](https://docs.deno.com/runtime/reference/cli/compile/)
