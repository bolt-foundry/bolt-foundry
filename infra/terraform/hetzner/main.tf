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
  
  user_data = file("${path.module}/cloud-init.yml")
}

# Floating IP
resource "hcloud_floating_ip" "web" {
  type      = "ipv4"
  server_id = hcloud_server.web.id
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