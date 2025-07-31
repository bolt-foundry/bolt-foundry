FROM debian:bookworm-slim

# Create a hosts file template that we'll use at runtime
RUN mkdir -p /etc/container-init && \
    echo "127.0.0.1        localhost localhost.localdomain" > /etc/container-init/hosts.template && \
    echo "::1              localhost localhost.localdomain" >> /etc/container-init/hosts.template


# Install dependencies for Nix installer and general development
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    bash \
    git \
    sudo \
    xz-utils \
    && rm -rf /var/lib/apt/lists/*

# Install Nix using Determinate Nix installer
RUN curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix | sh -s -- install linux \
    --extra-conf "sandbox = false" \
    --init none \
    --no-confirm

# Set up PATH to include Nix
ENV PATH="${PATH}:/nix/var/nix/profiles/default/bin"

# Copy flake files for caching
COPY flake.nix flake.lock /workspace/
WORKDIR /workspace

# Install our environment
RUN nix profile install .#codebot-env --accept-flake-config

# Create entrypoint script that ensures /etc/hosts exists (must be done as root)
RUN printf '#!/bin/bash\n\
# Check if /etc/hosts exists, create it if missing\n\
if [ ! -f /etc/hosts ]; then\n\
    echo "Warning: /etc/hosts missing, creating from template..."\n\
    # Use sudo to create /etc/hosts since we run as codebot user\n\
    if [ -f /etc/container-init/hosts.template ]; then\n\
        sudo -n cp /etc/container-init/hosts.template /etc/hosts 2>/dev/null\n\
    else\n\
        # Fallback if template is also missing\n\
        echo "127.0.0.1        localhost localhost.localdomain" | sudo -n tee /etc/hosts > /dev/null 2>&1\n\
        echo "::1              localhost localhost.localdomain" | sudo -n tee -a /etc/hosts > /dev/null 2>&1\n\
    fi\n\
fi\n\
\n\
# Add hostname.codebot.local entry if not already present\n\
if [ -n "$HOSTNAME" ] && ! grep -q "$HOSTNAME.codebot.local" /etc/hosts 2>/dev/null; then\n\
    echo "127.0.0.1        $HOSTNAME.codebot.local $HOSTNAME" | sudo -n tee -a /etc/hosts > /dev/null 2>&1\n\
fi\n\
\n\
# Execute bash with login shell\n\
exec /bin/bash -l "$@"\n' > /usr/local/bin/docker-entrypoint.sh && \
    chmod +x /usr/local/bin/docker-entrypoint.sh

# Configure sudo for codebot user to allow /etc/hosts management without password
RUN echo "codebot ALL=(ALL) NOPASSWD: /bin/cp * /etc/hosts, /usr/bin/tee /etc/hosts, /usr/bin/tee -a /etc/hosts" >> /etc/sudoers.d/codebot && \
    chmod 0440 /etc/sudoers.d/codebot

# Create non-root user (Debian uses useradd)
RUN useradd -m -s /bin/bash codebot

# Switch to codebot user and set up .bashrc
USER codebot
WORKDIR /home/codebot

# Create .bash_profile with initialization
COPY <<EOF /home/codebot/.bash_profile
# Claude Code environment initialization
if [ "\$CODEBOT_INITIALIZED" != "1" ]; then
  export CODEBOT_INITIALIZED=1
  
  # .claude directory is mounted directly from host
  # Copy .claude.json from workspace/tmp if it exists
  if [ -f "/workspace/tmp/.claude.json" ]; then
    cp /workspace/tmp/.claude.json /home/codebot/.claude.json
  fi
  
  # Configure Sapling identity for codebot
  sl config --user ui.username "bft codebot <codebot@boltfoundry.com>"
  sl config --user isl.changedFilesDisplayType "tree"
  
  # Configure GitHub authentication via GITHUB_TOKEN environment variable
  if [ -n "\$GITHUB_TOKEN" ]; then
    # Configure git to use the token for GitHub
    git config --global credential.helper '!f() { echo "username=x-access-token"; echo "password=\$GITHUB_TOKEN"; }; f'
    git config --global url."https://x-access-token:\${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
  fi
  
  # Change to workspace directory
  if [ -d "/workspace" ]; then
    cd /workspace
  fi
fi

# Add Nix to PATH
export PATH="/nix/var/nix/profiles/default/bin:\$PATH"

# Set Puppeteer executable path for e2e tests
export PUPPETEER_EXECUTABLE_PATH="/nix/var/nix/profiles/default/bin/chromium"

# Source shared environment setup
if [ -f "/workspace/infra/env-setup.sh" ]; then
  source /workspace/infra/env-setup.sh
fi
EOF

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
