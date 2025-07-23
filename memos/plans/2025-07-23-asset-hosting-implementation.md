# Asset Hosting Implementation Plan

**Date:** 2025-07-23\
**Status:** Planning\
**Priority:** High

## Overview

Implement a cloud-based asset hosting solution for Bolt Foundry that enables
developer-friendly asset uploads without checking files into the repository,
using Hetzner S3 storage served via bltcdn.com through Cloudflare CDN.

## Problem Statement

Currently, static assets (images, videos, etc.) for blog posts and website
content are managed haphazardly:

- Manual URL references with no consistent pattern
- No automated asset optimization or processing
- Future need for programmatically generated assets from e2e tests
- No CDN optimization for asset delivery
- Assets either missing or inconsistently managed

## Solution Architecture

### Core Components

1. **Hetzner S3 Bucket Storage**
   - Primary storage for all assets
   - Configured via existing Terraform infrastructure
   - Bucket naming: `bolt-foundry-assets`

2. **bltcdn.com CDN Domain**
   - Subdomain pointing to S3 bucket
   - Cloudflare proxy for global CDN + caching
   - SSL termination and DDoS protection

3. **Asset Upload CLI Tool**
   - `bft asset upload <file>` command
   - Automatic content hashing for deduplication
   - Returns CDN URL for use in code
   - Supports batch uploads

4. **Asset Reference System**
   - Simple URL strings in React components and markdown
   - No special syntax or abstractions
   - Works with existing Vite build system

### URL Structure

```
https://bltcdn.com/assets/{hash}/{filename}
```

Examples:

- `https://bltcdn.com/assets/abc123ef/hero-image.jpg`
- `https://bltcdn.com/assets/def456gh/demo-video.mp4`

## Implementation Plan

### Phase 1: Infrastructure Setup

1. **Extend Terraform Configuration**
   ```hcl
   # Add to existing infra/terraform/
   resource "hcloud_volume" "assets_storage" {
     name = "bolt-foundry-assets"
     size = 100  # Start with 100GB
   }

   # S3-compatible bucket configuration
   resource "hetzner_s3_bucket" "assets" {
     name = "bolt-foundry-assets"
     region = "hel1"  # Helsinki region
   }
   ```

2. **Configure bltcdn.com DNS**
   ```hcl
   resource "cloudflare_record" "bltcdn" {
     zone_id = var.cloudflare_zone_id
     name    = "bltcdn.com"
     content = hetzner_s3_bucket.assets.endpoint
     type    = "CNAME"
     proxied = true  # Enable Cloudflare CDN
   }
   ```

3. **S3 Access Configuration**
   - Generate API keys for programmatic access
   - Configure CORS for web uploads (future)
   - Set appropriate bucket policies

### Phase 2: Asset Upload Tool

1. **BFT Integration**
   ```typescript
   // infra/bft/tasks/asset-upload.bft.ts
   export default {
     name: "asset",
     description: "Asset management commands",
     subcommands: {
       upload: {
         description: "Upload asset to CDN",
         handler: async (args: string[]) => {
           // Implementation
         },
       },
     },
   };
   ```

2. **Upload Implementation**
   - File hashing using crypto.subtle.digest
   - S3 upload using aws-sdk compatible library
   - Progress indication for large files
   - Duplicate detection and URL return

3. **CLI Interface**
   ```bash
   # Basic upload
   bft asset upload hero-image.jpg
   # Returns: https://bltcdn.com/assets/abc123ef/hero-image.jpg

   # Batch upload
   bft asset upload *.jpg *.png
   ```

### Phase 3: Integration Points

1. **React Component Integration**
   ```tsx
   // Simple URL references - no special handling needed
   <img src="https://bltcdn.com/assets/abc123ef/hero-image.jpg" />;

   // Or with constants for better DX
   const ASSETS = {
     heroImage: "https://bltcdn.com/assets/abc123ef/hero-image.jpg",
   };
   ```

2. **Markdown Blog Integration**
   ```markdown
   ![Hero Image](https://bltcdn.com/assets/abc123ef/hero-image.jpg)

   <video src="https://bltcdn.com/assets/def456gh/demo-video.mp4" />
   ```

3. **E2E Test Integration** (Future)
   ```typescript
   // Generate screenshot during test
   const screenshot = await page.screenshot();
   const url = await uploadAsset(screenshot, "test-results/login-flow.png");
   // Use URL in test reports or documentation
   ```

### Phase 4: Build System Integration

1. **Asset Validation**
   - Check that referenced CDN URLs are accessible
   - Warn about missing assets during build

2. **Asset Optimization Pipeline** (Future)
   - Automatic image resizing/optimization on upload
   - WebP conversion for better performance
   - Video transcoding for multiple formats

## Technical Decisions

### Storage Strategy

- **Hetzner S3**: Cost-effective, same provider as existing infrastructure
- **Content Hashing**: Automatic deduplication, cache-friendly URLs
- **Flat Structure**: Simple `/assets/{hash}/{filename}` pattern

### CDN Strategy

- **Cloudflare Proxy**: Leverage existing setup, global edge caching
- **Cache Headers**: Long-lived caching (1 year) since content is hash-addressed
- **Compression**: Automatic gzip/brotli compression via Cloudflare

### Developer Experience

- **Simple CLI**: Single command to upload and get URL
- **No Special Syntax**: Plain URLs work everywhere
- **Backward Compatible**: Existing static assets continue to work

## Migration Strategy

1. **Bulk Upload**: Upload all existing assets from `/static/` directory to CDN
2. **Update References**: Replace local static URLs with CDN URLs throughout
   codebase
3. **Remove from Repo**: Delete static assets from repository once CDN migration
   is complete

## Next Steps

1. Set up Hetzner S3 bucket in Terraform
2. Configure bltcdn.com DNS with Cloudflare
3. Implement basic `bft asset upload` command
4. Bulk upload all existing `/static/` assets as initial test
5. Update codebase references to use CDN URLs
6. Remove static assets from repository

## Files to Create/Modify

- `infra/terraform/assets.tf` - S3 bucket and DNS configuration
- `infra/bft/tasks/asset-upload.bft.ts` - CLI tool implementation
- `packages/asset-client/` - S3 upload library (if needed)
- `docs/guides/asset-management.md` - Developer documentation

---

**Dependencies:** Hetzner S3 API access, Cloudflare API access

## Appendix: Implementation Files

### A. Terraform Configuration (`infra/terraform/hetzner/main.tf`)

Added S3 variables, AWS provider, and resources:

```hcl
# Added variables
variable "s3_access_key" {
  description = "S3 access key for asset storage"
  type        = string
  sensitive   = true
}

variable "s3_secret_key" {
  description = "S3 secret key for asset storage"  
  type        = string
  sensitive   = true
}

# Added AWS provider for S3
provider "aws" {
  access_key = var.s3_access_key
  secret_key = var.s3_secret_key
  region     = "us-east-1"  # Required but ignored by Hetzner
  
  endpoints {
    s3 = "https://hel1.your-objectstorage.com"  # Helsinki region endpoint
  }
  
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_requesting_account_id  = true
  s3_use_path_style          = true
}

# S3 bucket for asset storage
resource "aws_s3_bucket" "assets" {
  bucket = "bolt-foundry-assets"
}

# S3 bucket public access configuration
resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 bucket policy for public read access
resource "aws_s3_bucket_policy" "assets" {
  bucket = aws_s3_bucket.assets.id
  depends_on = [aws_s3_bucket_public_access_block.assets]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.assets.arn}/*"
      }
    ]
  })
}

# S3 bucket CORS configuration
resource "aws_s3_bucket_cors_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }
}

# Cloudflare DNS record for CDN domain
resource "cloudflare_record" "bltcdn" {
  zone_id = var.cloudflare_zone_id
  name    = "bltcdn.com"
  value   = "${aws_s3_bucket.assets.id}.hel1.your-objectstorage.com"
  type    = "CNAME"
  ttl     = 1  # Auto TTL
  proxied = true  # Enable Cloudflare CDN
}

# Added outputs
output "s3_bucket_name" {
  value = aws_s3_bucket.assets.id
}

output "s3_bucket_domain_name" {
  value = aws_s3_bucket.assets.bucket_domain_name
}

output "bltcdn_domain" {
  value = "bltcdn.com"
}
```

### B. BFT Asset Upload Task (`infra/bft/tasks/asset-upload.bft.ts`)

Complete implementation with S3 upload functionality:

```typescript
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { ui } from "@bfmono/packages/cli-ui/cli-ui.ts";
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { parseArgs } from "@std/cli";
import { basename } from "@std/path";
import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

const logger = getLogger(import.meta);

export async function assetUploadCommand(
  options: Array<string>,
): Promise<number> {
  logger.info("Starting asset upload...");

  // Handle help
  if (options.includes("--help") || options.includes("-h")) {
    ui.output(`Usage: bft asset-upload <file...> [options]
    
Upload assets to CDN and return URLs.

Options:
  --help, -h     Show this help message
  --verbose, -v  Show detailed output
  
Examples:
  bft asset-upload image.jpg
  bft asset-upload *.png
  bft asset-upload hero.jpg banner.png video.mp4`);
    return 0;
  }

  const args = parseArgs(options, {
    boolean: ["verbose", "v"],
    alias: { v: "verbose" },
    "--": true,
  });

  const verbose = args.verbose || args.v;
  const files = args._ as string[];

  if (files.length === 0) {
    ui.error("No files specified. Use --help for usage information.");
    return 1;
  }

  try {
    // Process each file
    for (const filePath of files) {
      await uploadAsset(filePath, verbose);
    }
    return 0;
  } catch (error) {
    logger.error("Asset upload failed:", error);
    ui.error(`Upload failed: ${error.message}`);
    return 1;
  }
}

async function uploadAsset(filePath: string, verbose: boolean): Promise<void> {
  if (verbose) {
    ui.output(`Processing: ${filePath}`);
  }

  // Check if file exists
  try {
    await Deno.stat(filePath);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      ui.error(`File not found: ${filePath}`);
      throw error;
    }
    throw error;
  }

  // Read file and calculate hash
  const fileData = await Deno.readFile(filePath);
  const hashBuffer = await crypto.subtle.digest("SHA-256", fileData);
  const hashArray = new Uint8Array(hashBuffer);
  const hash = Array.from(hashArray).map((b) => b.toString(16).padStart(2, "0"))
    .join("").slice(0, 8); // Use first 8 chars for shorter URLs

  const fileName = basename(filePath);
  const cdnUrl = `https://bltcdn.com/assets/${hash}/${fileName}`;

  if (verbose) {
    ui.output(`  Hash: ${hash}`);
    ui.output(`  Size: ${fileData.length} bytes`);
  }

  // Check if asset already exists
  const exists = await checkAssetExists(hash, fileName);
  if (exists) {
    if (verbose) {
      ui.output(`  Already exists, skipping upload`);
    }
  } else {
    if (verbose) {
      ui.output(`  Uploading to S3...`);
    }
    await uploadToS3(hash, fileName, fileData);
    if (verbose) {
      ui.output(`  Upload complete`);
    }
  }

  ui.output(cdnUrl);
}

// Initialize S3 client
function createS3Client(): S3Client {
  const accessKey = Deno.env.get("S3_ACCESS_KEY");
  const secretKey = Deno.env.get("S3_SECRET_KEY");

  if (!accessKey || !secretKey) {
    throw new Error(
      "S3 credentials not found. Set S3_ACCESS_KEY and S3_SECRET_KEY environment variables.",
    );
  }

  return new S3Client({
    region: "hel1", // Helsinki region
    endpoint: "https://hel1.your-objectstorage.com",
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });
}

async function checkAssetExists(
  hash: string,
  fileName: string,
): Promise<boolean> {
  try {
    const s3Client = createS3Client();
    const key = `assets/${hash}/${fileName}`;

    await s3Client.send(
      new HeadObjectCommand({
        Bucket: "bolt-foundry-assets",
        Key: key,
      }),
    );

    return true; // Object exists
  } catch (error) {
    if (error.name === "NotFound" || error.$metadata?.httpStatusCode === 404) {
      return false; // Object doesn't exist
    }
    // Re-throw other errors
    throw error;
  }
}

async function uploadToS3(
  hash: string,
  fileName: string,
  data: Uint8Array,
): Promise<void> {
  const s3Client = createS3Client();
  const key = `assets/${hash}/${fileName}`;

  // Determine content type based on file extension
  const ext = fileName.split(".").pop()?.toLowerCase();
  const mimeTypes: Record<string, string> = {
    "jpg": "image/jpeg",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "gif": "image/gif",
    "webp": "image/webp",
    "svg": "image/svg+xml",
    "mp4": "video/mp4",
    "webm": "video/webm",
    "pdf": "application/pdf",
    "txt": "text/plain",
    "md": "text/markdown",
  };
  const contentType = mimeTypes[ext || ""] || "application/octet-stream";

  await s3Client.send(
    new PutObjectCommand({
      Bucket: "bolt-foundry-assets",
      Key: key,
      Body: data,
      ContentType: contentType,
      // Set cache headers for long-term caching (content-addressed)
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

// Export the task definition for autodiscovery
export const bftDefinition = {
  description: "Upload assets to CDN and return URLs",
  fn: assetUploadCommand,
  aiSafe: true, // Safe for AI to use - uploads assets but doesn't modify existing code
} satisfies TaskDefinition;
```

### C. Dependency Configuration (`deno.jsonc`)

Added AWS S3 client dependency:

```json
{
  "imports": {
    "@aws-sdk/client-s3": "npm:@aws-sdk/client-s3@^3.850.0"
    // ... other imports
  }
}
```

### D. GitHub Actions Integration

The infrastructure will be deployed automatically via existing workflows:

- `.github/workflows/infrastructure-hetzner.yml` - Runs `terraform apply` on
  infrastructure changes
- `.github/workflows/deploy-boltfoundry-com.yml` - Ensures infrastructure is
  current during deployments

### E. Environment Variables Required

```bash
# For S3 access (obtain from Hetzner Cloud Console after bucket creation)
S3_ACCESS_KEY=your-hetzner-s3-access-key
S3_SECRET_KEY=your-hetzner-s3-secret-key
```
