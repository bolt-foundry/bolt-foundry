# Kamal Deployment to Hetzner Infrastructure
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
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket                      = "bfterraform"
    key                         = "boltfoundry-com/terraform.tfstate"
    region                      = "us-east-1"  # Required but ignored by Hetzner
    # endpoint configured via endpoint parameter in terraform init
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_requesting_account_id  = true
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


variable "ssh_public_key" {
  description = "SSH public key for server access"
  type        = string
}

variable "domain_name" {
  description = "Domain name for the deployment"
  type        = string
  default     = "boltfoundry.com"
}

variable "hyperdx_api_key" {
  description = "HyperDX API key for logging"
  type        = string
  sensitive   = true
}

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

provider "hcloud" {
  token = var.hcloud_token
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# AWS provider for S3 (Hetzner Object Storage)
provider "aws" {
  access_key = var.s3_access_key
  secret_key = var.s3_secret_key
  region     = "hel1"  # Helsinki region to match endpoint
  
  endpoints {
    s3 = "https://hel1.your-objectstorage.com"  # Helsinki region endpoint
  }
  
  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_region_validation      = true
  skip_requesting_account_id  = true
  s3_use_path_style          = true
}

# SSH key for server access
resource "hcloud_ssh_key" "deploy" {
  name       = "kamal-deploy"
  public_key = var.ssh_public_key
}

# Floating IP (created first, unassigned)
resource "hcloud_floating_ip" "web" {
  type      = "ipv4"
  home_location = "ash"
}

# Server
resource "hcloud_server" "web" {
  name        = "boltfoundry-com"
  image       = "ubuntu-22.04"
  server_type = "cpx11"
  location    = "ash"
  ssh_keys    = [hcloud_ssh_key.deploy.id]
  
  user_data = templatefile("${path.module}/cloud-init.yml", {
    floating_ip = hcloud_floating_ip.web.ip_address
  })
}

# Assign floating IP to server
resource "hcloud_floating_ip_assignment" "web" {
  floating_ip_id = hcloud_floating_ip.web.id
  server_id      = hcloud_server.web.id
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

# Daily server snapshots for backup  
resource "hcloud_snapshot" "server_backup" {
  # Note: This creates a one-time server snapshot
  # For automated daily snapshots, use Hetzner's snapshot automation
  # or implement via GitHub Actions cron job
  server_id   = hcloud_server.web.id
  description = "Server backup snapshot"
  labels = {
    purpose = "backup"
    app     = "boltfoundry-com"
  }
}

# Cloudflare DNS record with proxy enabled for SSL and DDoS protection
resource "cloudflare_record" "web" {
  zone_id = var.cloudflare_zone_id
  name    = var.domain_name == "boltfoundry.com" ? "@" : replace(var.domain_name, ".boltfoundry.com", "")
  value   = hcloud_floating_ip.web.ip_address
  type    = "A"
  ttl     = 1  # Auto TTL
  proxied = true  # Enable Cloudflare proxy for SSL termination and protection
}

# S3 bucket for asset storage
resource "aws_s3_bucket" "assets" {
  bucket = "bolt-foundry-assets"
}

# Note: Hetzner Object Storage doesn't support AWS-style bucket policies and CORS
# These can be configured via Hetzner's console if needed

# Cloudflare DNS record for CDN domain
resource "cloudflare_record" "bltcdn" {
  zone_id = var.cloudflare_zone_id
  name    = "bltcdn"
  value   = "${aws_s3_bucket.assets.id}.hel1.your-objectstorage.com"
  type    = "CNAME"
  ttl     = 1  # Auto TTL
  proxied = true  # Enable Cloudflare CDN
}

# Generate Kamal config with floating IP and domain
resource "local_file" "kamal_config" {
  content = templatefile("${path.module}/deploy.yml.tpl", {
    floating_ip      = hcloud_floating_ip.web.ip_address
    domain           = var.domain_name
    github_username  = var.github_username
    hyperdx_api_key  = var.hyperdx_api_key
  })
  filename = "${path.module}/../../../config/deploy.yml"
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

output "s3_bucket_name" {
  value = aws_s3_bucket.assets.id
}

output "s3_bucket_domain_name" {
  value = aws_s3_bucket.assets.bucket_domain_name
}

output "bltcdn_domain" {
  value = "bltcdn.com"
}