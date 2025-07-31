# Container Tool Quick Reference

## Test Container 0.3.0 (Current Default)

```bash
nix develop --refresh
container --version
bft codebot --force-rebuild
```

## Add a New Version

```bash
# 1. Get hash for new version
./infra/scripts/update-container-version.sh 0.3.1

# 2. Add to infra/nix/container-tool-flexible.nix:
#    "0.3.1" = "sha256-XXXXX...";

# 3. Test it
CONTAINER_VERSION=0.3.1 nix develop --refresh
```

## Switch Between Versions

```bash
# Use specific version
CONTAINER_VERSION=0.3.1 nix develop --refresh

# Back to default
unset CONTAINER_VERSION
nix develop
```

## Files to Know

- `container-tool.nix` - Default version config (in this directory)
- `container-tool-flexible.nix` - Multi-version support (in this directory)
- `../scripts/update-container-version.sh` - Hash generator

## Common Commands

```bash
# Check current version
container --version

# Where is container installed?
which container

# Force rebuild codebot with new container
bft codebot --force-rebuild

# Clean nix cache if needed
nix develop --refresh --impure
```
