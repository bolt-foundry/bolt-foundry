# Kamal Deployment to Hetzner Implementation Memo

## Overview

Deploy `boltfoundry-com` marketing site to Hetzner using Kamal with a "worse is
better" minimal approach. Leverages existing nix/bft compile system to create
self-contained binary deployments.

## Architecture

- **Server**: Single Hetzner CX11 (1 vCPU, 2GB RAM)
- **IP**: Floating IP for easy server replacement
- **DNS**: Automated Cloudflare DNS record management via Terraform
- **Deployment**: Kamal with Docker container containing compiled binary
- **Build**: Existing nix + bft compile system

## Implementation Steps

---

### 1. Manual Setup Step (Required First)

**⚠️ This must be completed before any Terraform operations:**

1. **Create Hetzner Object Storage bucket:**
   - Go to Hetzner Cloud Console → Object Storage
   - Create bucket: `boltfoundry-terraform-state`
   - Note the endpoint URL (e.g., `https://fsn1.your-objectstorage.com`)

2. **Get S3 credentials:**
   - In Hetzner Object Storage, create S3 access keys
   - Add to GitHub secrets:
     - `AWS_ACCESS_KEY_ID`
     - `AWS_SECRET_ACCESS_KEY`

3. **Add other required GitHub secrets:**
   - `HETZNER_API_TOKEN` - Hetzner Cloud API access
   - `CLOUDFLARE_API_TOKEN` - Cloudflare API access
   - `CLOUDFLARE_ZONE_ID` - Zone ID for boltfoundry.com
   - `S3_ENDPOINT` - Your Object Storage endpoint URL
   - `SSH_PUBLIC_KEY` - Your SSH public key content

---

### 2. Terraform Infrastructure

Create `infra/terraform/hetzner/` with:

```hcl
# main.tf
terraform {
  required_providers {
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "~> 1.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
  
  backend "s3" {
    bucket                      = "boltfoundry-terraform-state"
    key                         = "boltfoundry-com/terraform.tfstate"
    region                      = "us-east-1"  # Required but ignored by Hetzner
    endpoint                    = var.s3_endpoint
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    force_path_style           = true
  }
}

variable "hcloud_token" {
  description = "Hetzner Cloud API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_api_token" {
  description = "Cloudflare API Token"
  type        = string
  sensitive   = true
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for boltfoundry.com"
  type        = string
}

variable "github_username" {
  description = "GitHub username for container registry"
  type        = string
}

variable "s3_endpoint" {
  description = "Hetzner Object Storage S3 endpoint URL"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH public key for server access"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the deployment"
  type        = string
  default     = "next.boltfoundry.com"
}

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# SSH key for server access
resource "hcloud_ssh_key" "deploy" {
  name       = "kamal-deploy"
  public_key = var.ssh_public_key
}

# Server
resource "hcloud_server" "web" {
  name        = "boltfoundry-com"
  image       = "ubuntu-22.04"
  server_type = "cx11"
  location    = "ash"   # Ashburn
  ssh_keys    = [hcloud_ssh_key.deploy.id]
  
  user_data = file("cloud-init.yml")
}

# Floating IP
resource "hcloud_floating_ip" "web" {
  type      = "ipv4"
  server_id = hcloud_server.web.id
  location  = "ash"
}

# Database volume (independent of server)
resource "hcloud_volume" "database" {
  name     = "boltfoundry-db"
  size     = 10  # 10GB for SQLite database
  location = "ash"
}

resource "hcloud_volume_attachment" "database" {
  volume_id = hcloud_volume.database.id
  server_id = hcloud_server.web.id
}

# Daily volume snapshots for backup
resource "hcloud_snapshot" "database_backup" {
  # Note: This creates a one-time snapshot
  # For automated daily snapshots, use Hetzner's snapshot automation
  # or implement via GitHub Actions cron job
  volume_id   = hcloud_volume.database.id
  description = "Database backup snapshot"
  labels = {
    purpose = "backup"
    app     = "boltfoundry-com"
  }
}

# Cloudflare DNS record
resource "cloudflare_record" "web" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain_name == "boltfoundry.com" ? "@" : replace(var.domain_name, ".boltfoundry.com", "")
  value   = hcloud_floating_ip.web.ip_address
  type    = "A"
  ttl     = 1  # Auto TTL
}

# Generate Kamal config with floating IP and domain
resource "local_file" "kamal_config" {
  content = templatefile("${path.module}/deploy.yml.tpl", {
    floating_ip     = hcloud_floating_ip.web.ip_address
    domain          = var.domain_name
    github_username = var.github_username
  })
  filename = "${path.module}/../../config/deploy.yml"
}

# Outputs
output "server_ip" {
  value = hcloud_floating_ip.web.ip_address
}

output "server_name" {
  value = hcloud_server.web.name
}

output "domain" {
  value = var.domain_name
}

output "volume_id" {
  value = hcloud_volume.database.id
}
```

```yaml
# cloud-init.yml
#cloud-config
packages:
  - docker.io
  - docker-compose

runcmd:
  - systemctl enable docker
  - systemctl start docker
  - usermod -aG docker root
  # Mount database volume
  - if ! blkid /dev/sdb; then mkfs.ext4 /dev/sdb; fi # Only format if not already formatted
  - mkdir -p /mnt/database
  - mount /dev/sdb /mnt/database
  - echo '/dev/sdb /mnt/database ext4 defaults 0 0' >> /etc/fstab
  - chown -R 1000:1000 /mnt/database # Match container user
```

### 3. Dockerfile

Create `apps/boltfoundry-com/Dockerfile`:

```dockerfile
FROM debian:12-slim

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the compiled binary
COPY build/boltfoundry-com /usr/local/bin/boltfoundry-com
RUN chmod +x /usr/local/bin/boltfoundry-com

# Non-root user for security
RUN useradd -r -s /bin/false app
USER app

EXPOSE 8000

CMD ["/usr/local/bin/boltfoundry-com"]
```

### 4. Kamal Configuration Template

Create `infra/terraform/hetzner/deploy.yml.tpl`:

```yaml
service: boltfoundry-com

image: boltfoundry-com

servers:
  web:
    - ${floating_ip}

# SSL via Let's Encrypt
ssl:
  email: support@boltfoundry.com

registry:
  # Use GitHub Container Registry for simplicity
  server: ghcr.io
  username: ${github_username}
  password:
    - GITHUB_TOKEN

env:
  clear:
    PORT: 8000
    DB_BACKEND_TYPE: sqlite
    SQLITE_DB_PATH: /data/bfdb.sqlite
    BF_ENV: production

aliases:
  console: app exec --interactive --reuse "bash"
  shell: app exec --interactive --reuse "bash"
  logs: app logs --follow

# Health check
healthcheck:
  path: /
  port: 8000
  max_attempts: 7

# Database volume (mounted from Hetzner volume)
volumes:
  - "/mnt/database:/data"

# Use floating IP directly, no load balancer needed
```

**Note**: Terraform will automatically generate `config/deploy.yml` from this
template with the actual floating IP.

### 5. Build & Deploy Scripts

Add to `.bft.ts` or `infra/bft/tasks/`:

```typescript
// infra/bft/tasks/deploy.bft.ts
import type { TaskDefinition } from "@bfmono/infra/bft/bft.ts";
import { getLogger } from "@bfmono/packages/logger/logger.ts";
import { runShellCommand } from "@bfmono/infra/bff/shellBase.ts";

const logger = getLogger(import.meta);

export async function deploy(args: Array<string>): Promise<number> {
  const action = args[0] || "all";
  const githubUser = Deno.env.get("GITHUB_REPOSITORY_OWNER") ||
    Deno.env.get("GITHUB_USER");

  if (!githubUser) {
    logger.error(
      "❌ GitHub username not found. Set GITHUB_REPOSITORY_OWNER or GITHUB_USER environment variable.",
    );
    return 1;
  }

  try {
    switch (action) {
      case "build":
        return await buildAndTag(githubUser);
      case "push":
        return await pushImage(githubUser);
      case "ship":
        return await shipDeployment();
      case "all":
        const buildResult = await buildAndTag(githubUser);
        if (buildResult !== 0) return buildResult;

        const pushResult = await pushImage(githubUser);
        if (pushResult !== 0) return pushResult;

        return await shipDeployment();
      default:
        logger.error(`❌ Unknown deploy action: ${action}`);
        logger.info("Available actions: build, push, ship, all");
        return 1;
    }
  } catch (error) {
    logger.error("❌ Deployment failed:", error);
    return 1;
  }
}

async function buildAndTag(githubUser: string): Promise<number> {
  logger.info("🔨 Building binary and Docker image...");

  // Build binary using existing system
  let result = await runShellCommand([
    "nix",
    "develop",
    "--impure",
    "--command",
    "bft",
    "compile",
    "boltfoundry-com",
  ]);
  if (result !== 0) return result;

  // Build Docker image
  result = await runShellCommand([
    "docker",
    "build",
    "-t",
    "boltfoundry-com:latest",
    "apps/boltfoundry-com/",
  ]);
  if (result !== 0) return result;

  // Get git hash for tagging
  const gitHashProcess = new Deno.Command("git", {
    args: ["rev-parse", "--short", "HEAD"],
    stdout: "piped",
  });
  const { stdout } = await gitHashProcess.output();
  const gitHash = new TextDecoder().decode(stdout).trim();

  // Tag for registry
  result = await runShellCommand([
    "docker",
    "tag",
    "boltfoundry-com:latest",
    `ghcr.io/${githubUser}/boltfoundry-com:${gitHash}`,
  ]);
  if (result !== 0) return result;

  result = await runShellCommand([
    "docker",
    "tag",
    "boltfoundry-com:latest",
    `ghcr.io/${githubUser}/boltfoundry-com:latest`,
  ]);

  if (result === 0) {
    logger.info("✅ Build and tag completed");
  }
  return result;
}

async function pushImage(githubUser: string): Promise<number> {
  logger.info("🚀 Pushing Docker image...");

  const result = await runShellCommand([
    "docker",
    "push",
    `ghcr.io/${githubUser}/boltfoundry-com:latest`,
  ]);

  if (result === 0) {
    logger.info("✅ Image pushed successfully");
  }
  return result;
}

async function shipDeployment(): Promise<number> {
  logger.info("🚢 Shipping deployment...");

  const result = await runShellCommand(["kamal", "deploy"]);

  if (result === 0) {
    logger.info("✅ Deployment shipped successfully");
  }
  return result;
}

export const bftDefinition = {
  description: "Deploy boltfoundry-com (build|push|ship|all)",
  fn: deploy,
  aiSafe: false, // Deployment requires manual approval
} satisfies TaskDefinition;

// When run directly as a script
if (import.meta.main) {
  const scriptArgs = Deno.args.slice(2); // Skip "run" and script name
  Deno.exit(await deploy(scriptArgs));
}
```

### 6. GitHub Actions Integration

#### Infrastructure Workflow

Add `.github/workflows/infrastructure-hetzner.yml`:

```yaml
name: Deploy Infrastructure (Hetzner)

on:
  workflow_dispatch:
  push:
    paths: ["infra/terraform/hetzner/**"]

jobs:
  terraform:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: infra/terraform/hetzner

    steps:
      - uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Setup Terraform
        uses: hashicorp/setup-terraform@v3

      - name: Terraform Init
        run: terraform init

      - name: Terraform Plan
        run: terraform plan -var="hcloud_token=${{ secrets.HETZNER_API_TOKEN }}" -var="cloudflare_api_token=${{ secrets.CLOUDFLARE_API_TOKEN }}" -var="cloudflare_zone_id=${{ secrets.CLOUDFLARE_ZONE_ID }}" -var="github_username=${{ github.repository_owner }}" -var="s3_endpoint=${{ secrets.S3_ENDPOINT }}" -var="ssh_public_key=${{ secrets.SSH_PUBLIC_KEY }}"

      - name: Terraform Apply
        if: github.ref == 'refs/heads/main'
        run: terraform apply -auto-approve -var="hcloud_token=${{ secrets.HETZNER_API_TOKEN }}" -var="cloudflare_api_token=${{ secrets.CLOUDFLARE_API_TOKEN }}" -var="cloudflare_zone_id=${{ secrets.CLOUDFLARE_ZONE_ID }}" -var="github_username=${{ github.repository_owner }}" -var="s3_endpoint=${{ secrets.S3_ENDPOINT }}" -var="ssh_public_key=${{ secrets.SSH_PUBLIC_KEY }}"

      - name: Commit generated Kamal config
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add ../../config/deploy.yml
          git diff --staged --quiet || git commit -m "Update Kamal config with infrastructure changes"
          git push
```

#### Database Backup Workflow

Add `.github/workflows/backup-database.yml`:

```yaml
name: Backup Database

on:
  schedule:
    - cron: "0 2 * * *" # Daily at 2 AM UTC
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Create volume snapshot
        run: |
          curl -X POST \
            -H "Authorization: Bearer ${{ secrets.HETZNER_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "description": "Automated daily backup - $(date +%Y-%m-%d)",
              "labels": {
                "automated": "true",
                "date": "$(date +%Y-%m-%d)"
              }
            }' \
            "https://api.hetzner.cloud/v1/volumes/$(terraform output -raw volume_id)/actions/create_snapshot"
```

#### App Deployment Workflow

Add `.github/workflows/deploy-boltfoundry-com.yml`:

```yaml
name: Deploy boltfoundry-com

on:
  push:
    branches: [main]
    paths: ["apps/boltfoundry-com/**"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: DeterminateSystems/nix-installer-action@main
      - uses: DeterminateSystems/flakehub-cache-action@main

      - name: Build binary
        run: nix develop --impure --command bft compile boltfoundry-com

      - name: Build and push Docker image
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ghcr.io -u ${{ github.actor }} --password-stdin
          docker build -t ghcr.io/${{ github.repository_owner }}/boltfoundry-com:${{ github.sha }} apps/boltfoundry-com/
          docker push ghcr.io/${{ github.repository_owner }}/boltfoundry-com:${{ github.sha }}

      - name: Deploy with Kamal
        run: |
          gem install kamal
          kamal deploy
        env:
          KAMAL_REGISTRY_PASSWORD: ${{ secrets.GITHUB_TOKEN }}
```

## Quick Reference

### Deployment Commands

- [ ] `bft deploy all` for full deployment pipeline
- [ ] Push to main branch triggers auto-deployment
- [ ] Monitor with `kamal app logs`

### Implementation Checklist

- [ ] Complete manual setup step (Object Storage + GitHub secrets)
- [ ] Create the infrastructure workflow and Terraform files
- [ ] Push to main or manually trigger infrastructure workflow
- [ ] Workflow creates server + floating IP + DNS record + commits generated
      Kamal config
- [ ] Domain (next.boltfoundry.com) automatically points to server
- [ ] Deploy application with `bft deploy all`
- [ ] Verify site loads at https://next.boltfoundry.com

### When Ready for Production

- [ ] Import existing `boltfoundry.com` A record:
      `terraform import cloudflare_record.web <zone_id>/<record_id>`
- [ ] Update domain variable to `boltfoundry.com` in GitHub Actions or Terraform
- [ ] Run `terraform apply` to switch DNS to new server
- [ ] Verify site loads at https://boltfoundry.com

## Benefits of This Approach

1. **Simple**: Single server, single binary, minimal configuration
2. **Cheap**: Very low monthly cost
3. **Leverages existing tooling**: Uses nix/bft compile system
4. **Self-contained**: Binary includes all assets
5. **Easy rollbacks**: Kamal handles deployments and rollbacks
6. **Infrastructure as code**: Terraform manages server/IP

## Future Enhancements

- Multiple servers behind Hetzner load balancer
- Blue/green deployments with multiple floating IPs
- SSL certificate automation with Let's Encrypt
- Monitoring with Prometheus/Grafana
- Database deployment for dynamic content

## Appendix

### Required Files to Create

**Terraform Configuration:**

```
infra/terraform/hetzner/
├── main.tf                    # Infrastructure definitions
├── deploy.yml.tpl            # Kamal config template
└── cloud-init.yml            # Server setup script
```

**Docker Configuration:**

```
apps/boltfoundry-com/
└── Dockerfile                # Container definition
```

**BFT Task:**

```
infra/bft/tasks/
└── deploy.bft.ts             # Deployment commands
```

**GitHub Actions:**

```
.github/workflows/
├── infrastructure-hetzner.yml    # Infrastructure automation
├── backup-database.yml           # Daily backups
└── deploy-boltfoundry-com.yml     # App deployment
```

**Generated Files (by Terraform):**

```
config/
└── deploy.yml                # Kamal configuration (auto-generated)
```

### Required GitHub Secrets

Add these secrets in your GitHub repository settings:

| Secret Name             | Description                      | Where to get it                                    |
| ----------------------- | -------------------------------- | -------------------------------------------------- |
| `HETZNER_API_TOKEN`     | Hetzner Cloud API access         | Hetzner Cloud Console → Security → API Tokens      |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API access            | Cloudflare Dashboard → My Profile → API Tokens     |
| `CLOUDFLARE_ZONE_ID`    | Zone ID for boltfoundry.com      | Cloudflare Dashboard → Domain → Overview → Zone ID |
| `AWS_ACCESS_KEY_ID`     | S3 credentials for state storage | Hetzner Object Storage → Access Keys               |
| `AWS_SECRET_ACCESS_KEY` | S3 secret for state storage      | Hetzner Object Storage → Access Keys               |
| `S3_ENDPOINT`           | Object Storage endpoint URL      | Hetzner Object Storage → Bucket Details            |
| `SSH_PUBLIC_KEY`        | SSH public key for server access | Contents of your ~/.ssh/id_rsa.pub file            |

### Hetzner Cloud Resources

**Created by Terraform:**

- 1x CX11 server (1 vCPU, 2GB RAM) in Ashburn
- 1x Floating IP (IPv4)
- 1x Volume (10GB) for SQLite database
- 1x SSH Key for server access
- Daily volume snapshots

**Manual setup required:**

- 1x Object Storage bucket for Terraform state

### Useful Commands

**BFT Deployment:**

```bash
# Full deployment pipeline
bft deploy all

# Individual steps
bft deploy build    # Build binary and Docker image
bft deploy push     # Push image to registry
bft deploy ship     # Deploy to server
```

**Kamal Management:**

```bash
# Deploy application
kamal deploy

# Check application logs
kamal app logs

# Access container shell
kamal app exec --interactive "bash"

# Rollback deployment
kamal rollback
```

**Terraform Operations:**

```bash
# Initialize (first time only)
cd infra/terraform/hetzner
terraform init

# Plan changes
terraform plan -var-file="terraform.tfvars"

# Apply changes
terraform apply -var-file="terraform.tfvars"

# View outputs
terraform output
```

### Key Documentation Links

**Core Technologies:**

- [Kamal Documentation](https://kamal-deploy.org/)
- [Hetzner Cloud API](https://docs.hetzner.cloud/)
- [Terraform Hetzner Provider](https://registry.terraform.io/providers/hetznercloud/hcloud/latest/docs)
- [Cloudflare Terraform Provider](https://registry.terraform.io/providers/cloudflare/cloudflare/latest/docs)

**Hetzner Services:**

- [Cloud Console](https://console.hetzner.cloud/)
- [Object Storage Guide](https://docs.hetzner.com/cloud/object-storage/)
- [Volume Management](https://docs.hetzner.com/cloud/volumes/)
- [Floating IPs](https://docs.hetzner.com/cloud/floating-ips/)

**GitHub Actions:**

- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

### Environment Variables Reference

**Local Development:**

```bash
export GITHUB_USER="your-github-username"
export GITHUB_TOKEN="ghp_your_token_here"
```

**Production (set in Kamal config):**

- `PORT=8000` - Application port
- `DB_BACKEND_TYPE=sqlite` - Database backend
- `SQLITE_DB_PATH=/data/bfdb.sqlite` - Database file location
- `BF_ENV=production` - Environment name

### Troubleshooting

**Common Issues:**

1. **Terraform state conflicts:**
   - Ensure Object Storage bucket exists before first run
   - Check AWS credentials are correctly set

2. **Docker build failures:**
   - Verify `GITHUB_USER` environment variable is set
   - Check GitHub token has package permissions

3. **Kamal deployment issues:**
   - Verify server is accessible via SSH
   - Check Docker is running on server
   - Ensure volume is properly mounted

4. **Database connectivity:**
   - Verify volume is mounted at `/data`
   - Check SQLite file permissions
   - Ensure directory exists and is writable

**Helpful debugging commands:**

```bash
# Check server status
terraform output server_ip
ssh root@<server_ip> "docker ps"

# Check volume mounting
ssh root@<server_ip> "df -h"
ssh root@<server_ip> "ls -la /data"

# View application logs
kamal app logs --follow

# Check database file
ssh root@<server_ip> "ls -la /data/bfdb.sqlite"
```
