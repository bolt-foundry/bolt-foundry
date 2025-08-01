FROM debian:bookworm-slim

# Create a hosts file template that we'll use at runtime
RUN mkdir -p /etc/container-init && \
    echo "127.0.0.1        localhost localhost.localdomain" > /etc/container-init/hosts.template && \
    echo "::1              localhost localhost.localdomain" >> /etc/container-init/hosts.template


# Install all system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    # Base dependencies
    curl \
    ca-certificates \
    bash \
    git \
    sudo \
    xz-utils \
    dumb-init \
    wget \
    gnupg \
    # Development tools (moved from Nix)
    unzip \
    jq \
    nodejs \
    npm \
    python3 \
    python3-pip \
    ffmpeg \
    net-tools \
    ripgrep \
    fd-find \
    # Chrome dependencies (we'll install Chrome separately)
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgbm1 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libx11-6 \
    libxcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxkbcommon0 \
    libxrandr2 \
    libxss1 \
    libxtst6 \
    # International fonts
    fonts-ipafont-gothic \
    fonts-wqy-zenhei \
    fonts-thai-tlwg \
    fonts-khmeros \
    fonts-kacst \
    fonts-freefont-ttf \
    fonts-noto-color-emoji \
    fontconfig \
    && rm -rf /var/lib/apt/lists/* \
    && fc-cache -f -v

# Install Chrome/Chromium based on architecture
# Note: Google Chrome is only available for amd64, so we use Chromium on arm64
RUN if [ "$(dpkg --print-architecture)" = "amd64" ]; then \
        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
        && echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list \
        && apt-get update \
        && apt-get install -y google-chrome-stable \
        && rm -rf /var/lib/apt/lists/* \
        && ln -s /usr/bin/google-chrome-stable /usr/bin/chromium; \
    else \
        apt-get update \
        && apt-get install -y chromium chromium-driver \
        && rm -rf /var/lib/apt/lists/* \
        && ln -s /usr/bin/chromium /usr/bin/google-chrome-stable; \
    fi

# Install Nix using Determinate Nix installer with better error handling
RUN set -ex && \
    # Create required directories
    mkdir -p /nix /etc/nix && \
    # Download the installer first to debug potential issues
    curl --proto '=https' --tlsv1.2 -sSf -L https://install.determinate.systems/nix -o /tmp/install-nix.sh && \
    # Make it executable
    chmod +x /tmp/install-nix.sh && \
    # Show first few lines for debugging
    head -n 20 /tmp/install-nix.sh && \
    # Run the installer with error handling
    /tmp/install-nix.sh install linux \
        --extra-conf "sandbox = false" \
        --init none \
        --no-confirm || \
    { echo "Nix installation failed. Trying alternative approach..."; \
      # Alternative: Try the official Nix installer
      curl -L https://nixos.org/nix/install | sh -s -- --daemon --yes || \
      { echo "Both Nix installers failed. Exiting."; exit 1; }; \
    } && \
    # Clean up
    rm -f /tmp/install-nix.sh

# Set up PATH to include Nix
ENV PATH="${PATH}:/nix/var/nix/profiles/default/bin"

# Copy flake files for caching
COPY flake.nix flake.lock /@bfmono/
WORKDIR /@bfmono

# Install development tools from flake (includes gh, deno, sapling, etc.)
RUN nix profile install .#codebot-env --accept-flake-config

# Install Claude CLI globally
RUN npm install -g @anthropic-ai/claude-code

# Verify Chrome/Chromium installation
RUN (google-chrome --version || chromium --version) || echo "WARNING: Chrome/Chromium may not be properly configured"

# Copy Puppeteer test helper script
COPY infra/apps/codebot/puppeteer-test-helper.sh /usr/local/bin/puppeteer-test
RUN chmod +x /usr/local/bin/puppeteer-test

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
# Add host.codebot.local entry for accessing host machine\n\
if ! grep -q "host.codebot.local" /etc/hosts 2>/dev/null; then\n\
    echo "192.168.64.1     host.codebot.local" | sudo -n tee -a /etc/hosts > /dev/null 2>&1\n\
fi\n\
\n\
# Start container bridge in background if not running a specific command\n\
if [ $# -eq 0 ] || [ "$1" = "-l" ]; then\n\
    # Only start bridge for interactive sessions\n\
    if [ -f "/@bfmono/infra/apps/codebot/container-bridge.ts" ]; then\n\
        # Set WORKSPACE_ID from hostname\n\
        export WORKSPACE_ID="${HOSTNAME}"\n\
        # Start container bridge in background\n\
        cd /@bfmono && deno run --allow-net --allow-run --allow-env --allow-read infra/apps/codebot/container-bridge.ts > /tmp/container-bridge.log 2>&1 &\n\
        echo "Container bridge started in background (PID: $!)"\n\
    fi\n\
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

# Create temp directory for Chrome with proper permissions
RUN mkdir -p /home/codebot/tmp && \
    chown -R codebot:codebot /home/codebot/tmp

# Switch to codebot user and set up .bashrc
USER codebot
WORKDIR /home/codebot

# Set memory management environment variables
ENV PUPPETEER_DISABLE_DEV_SHM_USAGE=true
ENV TMPDIR=/home/codebot/tmp
ENV CHROME_DEVEL_SANDBOX=/opt/google/chrome/chrome-sandbox

# Create .bash_profile with initialization
COPY <<EOF /home/codebot/.bash_profile
# Claude Code environment initialization
if [ "\$CODEBOT_INITIALIZED" != "1" ]; then
  export CODEBOT_INITIALIZED=1
  
  # .claude directory is mounted directly from host
  # Copy .claude.json from @bfmono/tmp if it exists
  if [ -f "/@bfmono/tmp/.claude.json" ]; then
    cp /@bfmono/tmp/.claude.json /home/codebot/.claude.json
  fi
  
  # Configure Sapling identity for codebot
  sl config --user ui.username "bft codebot <codebot@boltfoundry.com>"
  sl config --user isl.changedFilesDisplayType "tree"
  
  # Get bf-codebot GitHub token from secrets
  BF_CODEBOT_TOKEN=\$(bft secrets get BF_CODEBOT_GITHUB_TOKEN 2>/dev/null || echo "")
  
  # Configure GitHub authentication for bf-codebot
  if [ -n "\$BF_CODEBOT_TOKEN" ]; then
    # Configure git identity as bf-codebot
    git config --global user.name "bf-codebot"
    git config --global user.email "bf-codebot@users.noreply.github.com"
    
    # Configure git to use the bf-codebot token for GitHub
    git config --global credential.helper '!f() { echo "username=bf-codebot"; echo "password=\$BF_CODEBOT_TOKEN"; }; f'
    git config --global url."https://bf-codebot:\${BF_CODEBOT_TOKEN}@github.com/".insteadOf "https://github.com/"
  elif [ -n "\$GITHUB_TOKEN" ]; then
    # Fallback to existing GITHUB_TOKEN approach for backward compatibility
    git config --global credential.helper '!f() { echo "username=x-access-token"; echo "password=\$GITHUB_TOKEN"; }; f'
    git config --global url."https://x-access-token:\${GITHUB_TOKEN}@github.com/".insteadOf "https://github.com/"
  fi
  
  # Change to @bfmono directory
  if [ -d "/@bfmono" ]; then
    cd /@bfmono
  fi
fi

# Add Nix to PATH
export PATH="/nix/var/nix/profiles/default/bin:\$PATH"

# Set Puppeteer executable path for e2e tests (use Chrome/Chromium based on what's available)
if [ -x "/usr/bin/google-chrome-stable" ]; then
  export PUPPETEER_EXECUTABLE_PATH="/usr/bin/google-chrome-stable"
elif [ -x "/usr/bin/chromium" ]; then
  export PUPPETEER_EXECUTABLE_PATH="/usr/bin/chromium"
fi
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
export PUPPETEER_DISABLE_DEV_SHM_USAGE=true

# Source shared environment setup
if [ -f "/@bfmono/infra/env-setup.sh" ]; then
  source /@bfmono/infra/env-setup.sh
fi
EOF

# Health check to ensure Chrome/Chromium is available
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD (google-chrome --version || chromium --version) || exit 1

ENTRYPOINT ["dumb-init", "--", "/usr/local/bin/docker-entrypoint.sh"]
