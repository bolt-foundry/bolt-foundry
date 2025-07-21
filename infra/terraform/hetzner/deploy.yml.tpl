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