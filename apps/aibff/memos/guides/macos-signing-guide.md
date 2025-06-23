# macOS Code Signing and Notarization Guide

## Overview

This guide provides comprehensive documentation for signing and notarizing the
aibff macOS binary to eliminate Gatekeeper warnings and ensure smooth
distribution outside the Mac App Store. It covers both the GitHub Actions
automated workflow and the planned integration of signing capabilities directly
into aibff as developer subcommands.

## Goals

| Goal                     | Description                                             | Success Criteria                                        |
| ------------------------ | ------------------------------------------------------- | ------------------------------------------------------- |
| Code Signing             | Sign macOS binary with Developer ID certificate         | Binary passes `codesign -v` verification                |
| Notarization             | Submit signed binary to Apple for security verification | Binary passes `spctl -a -t exec` check                  |
| Automated Workflow       | Integrate signing into existing GitHub Actions          | No manual steps required for signed releases            |
| User Experience          | Eliminate Gatekeeper warnings on macOS                  | Users can run binary without security warnings          |
| Dev Command Integration  | Add signing/notarization as aibff dev subcommands       | `aibff dev sign` and `aibff dev notarize` commands work |
| Local Developer Workflow | Enable local signing for testing                        | Developers can sign binaries with their certificates    |

## Prerequisites

### Apple Developer Account Setup

1. **Developer ID Application Certificate**

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

2. **App-Specific Password**
   - Generate at [appleid.apple.com](https://appleid.apple.com)
   - Sign in and go to "App-Specific Passwords"
   - Click "Generate Password"
   - Name it "aibff notarization"
   - Save the generated password securely

3. **Apple Developer Team ID**
   - Located in Apple Developer portal membership section
   - Usually a 10-character alphanumeric string (e.g., ABCD123EFG)

## Implementation Approaches

### Approach 1: GitHub Actions Workflow (Current)

This approach is immediately available and integrates into the existing release
workflow.

#### GitHub Secrets Setup

Add these repository secrets:

| Secret Name                  | Description                     | How to Generate                          |
| ---------------------------- | ------------------------------- | ---------------------------------------- |
| `APPLE_CERTIFICATE_BASE64`   | Base64 encoded .p12 certificate | `base64 -i certificate.p12 \| pbcopy`    |
| `APPLE_CERTIFICATE_PASSWORD` | Certificate export password     | Password used when exporting .p12        |
| `APPLE_ID`                   | Apple ID email                  | Your Apple Developer account email       |
| `APPLE_APP_PASSWORD`         | App-specific password           | Generated at appleid.apple.com           |
| `APPLE_TEAM_ID`              | Apple Developer Team ID         | Found in Apple Developer membership page |

#### Workflow Implementation

Update `.github/workflows/publish-aibff-release.yml`:

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
        # Sign the binary with Developer ID certificate and entitlements
        codesign --force --options runtime --entitlements apps/aibff/entitlements.plist --sign "Developer ID Application" build/bin/aibff-darwin-aarch64

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

### Approach 2: aibff Dev Commands (Planned)

This approach integrates signing directly into aibff for a self-contained
release process.

#### Command Structure

```
aibff dev <subcommand> [options]

Subcommands:
  rebuild [--platform] [--arch] [--sign] [--notarize]
  sign [--identity <name>] [--entitlements <path>]
  notarize [--wait] [--apple-id <email>] [--team-id <id>]
  validate
```

#### Environment Variables

- `AIBFF_SIGNING_IDENTITY` - Certificate name in keychain
- `AIBFF_NOTARIZE_APPLE_ID` - Apple ID for notarization
- `AIBFF_NOTARIZE_TEAM_ID` - Apple Developer Team ID
- `AIBFF_NOTARIZE_PASSWORD` - App-specific password

#### Usage Examples

```bash
# Full rebuild with signing and notarization
aibff dev rebuild --platform darwin --arch aarch64 --sign --notarize

# Sign existing binary
aibff dev sign --identity "Developer ID Application: Your Name"

# Notarize and wait for completion
aibff dev notarize --wait

# Chain commands
aibff dev rebuild sign notarize
```

## Entitlements Configuration

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

These entitlements are required for Deno binaries due to V8's JIT compilation
and dynamic code execution.

## Signing Process Flow

1. **Build Binary**
   ```bash
   deno compile --output build/bin/aibff-darwin-aarch64 apps/aibff/main.ts
   ```

2. **Code Sign with Hardened Runtime**
   ```bash
   codesign --deep --force --options runtime \
     --entitlements apps/aibff/entitlements.plist \
     --sign "Developer ID Application" \
     build/bin/aibff-darwin-aarch64
   ```

3. **Create Archive for Notarization**
   ```bash
   ditto -c -k --keepParent build/bin/aibff-darwin-aarch64 aibff-darwin-aarch64.zip
   ```

4. **Submit to Apple**
   ```bash
   xcrun notarytool submit aibff-darwin-aarch64.zip \
     --apple-id $APPLE_ID \
     --password $APPLE_APP_PASSWORD \
     --team-id $APPLE_TEAM_ID \
     --wait
   ```

5. **Staple Notarization Ticket**
   ```bash
   xcrun stapler staple build/bin/aibff-darwin-aarch64
   ```

6. **Verify**
   ```bash
   spctl -a -t exec -v build/bin/aibff-darwin-aarch64
   ```

## Testing and Validation

### Local Testing

```bash
# Verify code signature
codesign -v --verbose=4 aibff-darwin-aarch64

# Check notarization status
spctl -a -t exec -v aibff-darwin-aarch64

# Test execution
./aibff-darwin-aarch64 --version

# List signing identities
security find-identity -v -p codesigning
```

### CI Testing

- Verify signed binary in workflow
- Test binary execution after signing
- Validate archive integrity
- Check for certificate expiration

### User Testing

1. Download release artifact
2. Extract archive: `tar -xzf aibff-darwin-aarch64.tar.gz`
3. Run binary: `./aibff --version`
4. Verify no Gatekeeper warnings appear

## Troubleshooting

### Common Issues and Solutions

| Issue                     | Cause                     | Solution                              |
| ------------------------- | ------------------------- | ------------------------------------- |
| Certificate not found     | Wrong certificate name    | Check `security find-identity -v`     |
| Notarization rejected     | Missing entitlements      | Add required entitlements to plist    |
| Keychain access denied    | Partition list not set    | Run `security set-key-partition-list` |
| Notarization timeout      | Apple service issues      | Retry with exponential backoff        |
| Binary corrupt after sign | Old Deno version          | Ensure Deno 2.x (fixed in 1.46+)      |
| Stapler fails             | Binary in use             | Ensure binary isn't running           |
| spctl verification fails  | Notarization not complete | Wait for notarization before stapling |

### Debugging Commands

```bash
# View certificate details
security find-certificate -a -p -c "Developer ID Application"

# Check notarization history
xcrun notarytool history --apple-id $APPLE_ID --team-id $APPLE_TEAM_ID

# Get notarization log
xcrun notarytool log <submission-id> --apple-id $APPLE_ID --team-id $APPLE_TEAM_ID

# View binary entitlements
codesign -d --entitlements - build/bin/aibff-darwin-aarch64
```

## Security Considerations

### Certificate Protection

- Use temporary keychain in CI (deleted after use)
- Never commit certificates or passwords
- Rotate app-specific passwords regularly
- Monitor certificate expiration dates

### Secret Management

- Store certificates as base64 to avoid binary issues
- Use repository secrets, not environment variables
- Limit secret access to release workflows only
- Consider using GitHub Environments for additional protection

### Build Integrity

- Sign immediately after building
- Verify signatures before uploading
- Include SHA256 checksums with releases
- Consider reproducible builds

## Monitoring and Maintenance

### Certificate Expiration

Developer ID certificates expire after 5 years. Set reminders:

- 6 months before: Plan renewal
- 3 months before: Create new certificate
- 1 month before: Test new certificate
- After renewal: Update GitHub secrets

### Notarization Monitoring

- Track notarization times in CI logs
- Monitor for Apple service outages
- Keep notarization logs for troubleshooting
- Review Apple's notarization requirements regularly

## Future Enhancements

1. **Automated certificate renewal alerts**
2. **Universal binary support (x86_64 + ARM64)**
3. **Installer package (.pkg) signing**
4. **Development build signing for testing**
5. **Notarization status webhooks**
6. **Cross-compilation signing support**

## Resources

- [Apple Code Signing Guide](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [notarytool Documentation](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution/customizing_the_notarization_workflow)
- [Deno Code Signing Compatibility](https://github.com/denoland/deno/pull/24604)
- [GitHub Actions macOS Code Signing](https://docs.github.com/en/actions/deployment/deploying-to-your-cloud-provider/deploying-to-apple-app-store)
- [Hardened Runtime Entitlements](https://developer.apple.com/documentation/bundleresources/entitlements)
