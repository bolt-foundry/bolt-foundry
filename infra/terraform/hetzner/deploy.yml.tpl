service: boltfoundry-com

image: boltfoundry-com

servers:
  web:
    - ${floating_ip}

# Builder configuration for Kamal 2.x
builder:
  arch:
    - amd64
  dockerfile: apps/boltfoundry-com/Dockerfile

# Kamal 2.x proxy configuration with SSL and healthcheck
proxy:
  ssl: true
  host: ${domain}
  app_port: 8000
  healthcheck:
    path: /
    interval: 10
    timeout: 5

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

# HyperDX logging configuration
logging:
  driver: fluentd
  options:
    fluentd-address: tls://in-otel.hyperdx.io:24225
    labels: '__HDX_API_KEY,service.name'

# Docker labels for HyperDX
labels:
  __HDX_API_KEY: ${hyperdx_api_key}
  service.name: boltfoundry-com

aliases:
  console: app exec --interactive --reuse "bash"
  shell: app exec --interactive --reuse "bash"
  logs: app logs --follow

# Database volume (mounted from Hetzner volume)
volumes:
  - "/mnt/database:/data"

# Use floating IP directly, no load balancer needed