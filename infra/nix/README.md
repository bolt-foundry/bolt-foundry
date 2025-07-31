# Testing Bleeding Edge Apple Container Releases

This guide explains how to test new Apple container tool releases before they're
available in nixpkgs.

## Quick Start

To use container 0.3.0 (already configured):

```bash
# Refresh your nix environment to get container 0.3.0
nix develop --refresh

# Verify installation
which container
container --version

# Test with bft codebot
bft codebot --force-rebuild
```

## How It Works

We've set up a nix package that downloads and installs pre-built container
releases directly from GitHub. The system is designed to be flexible and easy to
update.

### File Structure

```
infra/nix/
├── README.md                        # This documentation
├── QUICK-REFERENCE.md               # Quick command reference
├── container-tool.nix               # Default container 0.3.0 package
├── container-tool-flexible.nix      # Flexible multi-version package
└── ../scripts/
    └── update-container-version.sh  # Helper to add new versions
```

## Adding New Container Versions

When a new container release is available (e.g., 0.3.1):

### Step 1: Get the Version Hash

```bash
# Run the update script with the new version number
./infra/scripts/update-container-version.sh 0.3.1
```

This will output something like:

```
Version: 0.3.1
SHA256: sha256-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Add this to infra/nix/container-tool-flexible.nix:
    "0.3.1" = "sha256-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
```

### Step 2: Update the Flexible Package

Edit `container-tool-flexible.nix` (in this directory) and add the new version
to the `versionHashes` map:

```nix
versionHashes = {
  "0.3.0" = "sha256-D3oAhATmZhGA6mehw6UEAY5Xwu8jjvTNqNcPKBUWxuY=";
  "0.3.1" = "sha256-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";  # Add this line
};
```

### Step 3: Test the New Version

```bash
# Test with the new version using environment variable
CONTAINER_VERSION=0.3.1 nix develop --refresh

# Verify it's using the new version
container --version
```

## Testing Different Versions

You can switch between container versions without modifying any files:

```bash
# Use default version (0.3.0)
nix develop

# Use a specific version (must be in versionHashes)
CONTAINER_VERSION=0.3.1 nix develop --refresh

# Go back to default
unset CONTAINER_VERSION
nix develop
```

## Making a Version the Default

To make a new version the default for everyone:

1. Update `container-tool.nix` (in this directory) with the new version:
   ```nix
   version = "0.3.1";  # Changed from 0.3.0
   ```

2. Make sure the hash is correct in that file

3. Commit the change

## Troubleshooting

### "Unknown container version" Error

If you see this error, it means the version hash hasn't been added to
`container-tool-flexible.nix`. Follow the "Adding New Container Versions" steps
above.

### Container Command Not Found

Make sure you're in the nix develop shell:

```bash
nix develop --refresh
which container  # Should show a nix store path
```

### Old Version Still Being Used

The nix environment might be cached. Force a refresh:

```bash
nix develop --refresh --impure
```

### Hash Mismatch Error

If you get a hash mismatch error, the download might have failed or the file
might be corrupted. Re-run the update script to get the correct hash.

## Implementation Details

The system works by:

1. Downloading the official `.pkg` installer from GitHub releases
2. Extracting the binary using `xar` and `cpio`
3. Installing it into the nix store
4. Making it available in your development environment

The flexible system allows testing multiple versions through the
`CONTAINER_VERSION` environment variable, while the default package ensures
everyone gets a stable version.

## Best Practices

1. **Test First**: Always test new versions with `CONTAINER_VERSION` before
   making them default
2. **Document Changes**: When updating the default version, mention it in your
   commit message
3. **Keep Old Versions**: Don't remove old version hashes - they're useful for
   debugging
4. **Verify Functionality**: After installing a new version, test core
   functionality with `bft codebot`

## Example Workflow

Here's a complete example of testing container 0.3.1 when it's released:

```bash
# 1. Add the new version
./infra/scripts/update-container-version.sh 0.3.1

# 2. Edit infra/nix/container-tool-flexible.nix and add the hash

# 3. Test the new version
CONTAINER_VERSION=0.3.1 nix develop --refresh

# 4. Verify it works
container --version
bft codebot --force-rebuild

# 5. If everything works, optionally make it default by updating container-tool.nix
```
