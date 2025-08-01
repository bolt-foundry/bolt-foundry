# Asset Upload Authentication Guide

This guide explains how to set up and manage authentication for the
`bft asset-upload` command.

## Overview

The asset upload command supports optional shared secret authentication to
protect your asset storage from unauthorized uploads. When enabled, users must
provide a valid secret to upload files.

## Setting Up Authentication

### 1. Add Secret to Environment Variables

First, add the required secret to your `.env.server.example` file (already done
in the default setup):

```bash
# Asset Storage
S3_ACCESS_KEY=your_s3_access_key
S3_SECRET_KEY=your_s3_secret_key
ASSET_UPLOAD_REQUIRED_SECRET=your_upload_secret_key
```

### 2. Sync Secrets Using bft

Use the `bft secrets` command to sync your environment variables from 1Password:

```bash
# Sync all secrets (creates .env.client and .env.server)
bft secrets sync

# Or sync only server secrets
bft secrets sync --server-only
```

If you don't have 1Password set up, the command will create empty `.env.server`
file that you can manually edit.

### 3. Set the Required Secret

Edit your `.env.server` file and set the `ASSET_UPLOAD_REQUIRED_SECRET` to your
desired secret value:

```bash
ASSET_UPLOAD_REQUIRED_SECRET=my-secure-upload-key-123
```

## Using Authentication

Once authentication is configured, users must provide the secret when uploading
assets:

### Via Command Line Flag

```bash
bft asset-upload image.jpg --secret my-secure-upload-key-123
```

### Via Environment Variable

```bash
ASSET_UPLOAD_SECRET=my-secure-upload-key-123 bft asset-upload document.pdf
```

### In Scripts or CI/CD

For automated workflows, set the `ASSET_UPLOAD_SECRET` environment variable:

```bash
export ASSET_UPLOAD_SECRET=my-secure-upload-key-123
bft asset-upload screenshot.png
```

## Disabling Authentication

To disable authentication, simply remove or comment out the
`ASSET_UPLOAD_REQUIRED_SECRET` from your `.env.server` file. The command will
then work without requiring any secret.

## Security Best Practices

1. **Use Strong Secrets**: Generate a secure random string for your upload
   secret
2. **Rotate Regularly**: Change the secret periodically for better security
3. **Environment-Specific**: Use different secrets for development, staging, and
   production
4. **Never Commit Secrets**: Ensure `.env.server` is in your `.gitignore` (it
   should be by default)
5. **Use 1Password**: For team environments, store secrets in 1Password and use
   `bft secrets sync`

## Troubleshooting

### "Invalid or missing shared secret" Error

This error occurs when:

- `ASSET_UPLOAD_REQUIRED_SECRET` is set but no secret was provided
- The provided secret doesn't match the required secret

Solution: Ensure you're providing the correct secret via `--secret` flag or
`ASSET_UPLOAD_SECRET` environment variable.

### Missing S3 Credentials

Even with correct authentication, uploads will fail without proper S3
credentials. Ensure these are set:

- `S3_ACCESS_KEY`
- `S3_SECRET_KEY`

Use `bft secrets sync` to populate these from 1Password.
