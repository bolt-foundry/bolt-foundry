# Codebot Dockerfile Migration: Alpine to Ubuntu

## Changes Made

1. **Base Image**: Changed from `alpine:latest` to `ubuntu:24.04`
   - Ubuntu 24.04 LTS provides long-term support and stability
   - Uses glibc instead of musl libc, ensuring compatibility with Deno-compiled
     binaries

2. **Package Installation**:
   - Changed from `apk add` to `apt-get install`
   - Added additional packages: `git`, `sudo`, `xz-utils` for better development
     support
   - Added cleanup of apt cache to reduce image size

3. **User Creation**:
   - Changed from `adduser -D` (Alpine) to `useradd -m` (Ubuntu)
   - Both create a home directory and set bash as the shell

## Benefits

1. **Binary Compatibility**: Deno-compiled binaries will work without glibc/musl
   issues
2. **Better Tool Support**: More packages and tools available in Ubuntu
   repositories
3. **E2E Testing**: Chromium and other testing tools will work out of the box
4. **Debugging**: Better debugging tools and libraries available

## Testing Plan

1. Build new Docker image
2. Test basic functionality (file operations, git, etc.)
3. Run e2e tests to verify they work correctly
4. Check image size difference

## Notes

- Ubuntu 24.04 image is larger than Alpine (~75MB vs ~5MB base)
- The trade-off is worth it for development/testing compatibility
- Can optimize image size later if needed (multi-stage builds, minimal Ubuntu
  variant)
