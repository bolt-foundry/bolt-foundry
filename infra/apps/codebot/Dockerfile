FROM alpine:latest

# Install curl and ca-certificates for the Nix installer
RUN apk add --no-cache curl ca-certificates bash

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

# Create non-root user (Alpine uses adduser)
RUN adduser -D -s /bin/bash codebot

# Switch to codebot user and set up .bashrc
USER codebot
WORKDIR /home/codebot

# Create .bash_profile with initialization
COPY <<EOF /home/codebot/.bash_profile
# Claude Code environment initialization
if [ "\$CODEBOT_INITIALIZED" != "1" ]; then
  export CODEBOT_INITIALIZED=1
  
  # Set up Claude config files if they exist in workspace/tmp
  if [ -f "/workspace/tmp/claude.json" ]; then
    ln -sf /workspace/tmp/claude.json /home/codebot/.claude.json
  fi
  
  if [ -d "/workspace/tmp/claude" ]; then
    ln -sf /workspace/tmp/claude /home/codebot/.claude
  fi
  
  # Set up GitHub CLI config if it exists in workspace/tmp
  if [ -d "/workspace/tmp/gh" ]; then
    mkdir -p /home/codebot/.config
    ln -sf /workspace/tmp/gh /home/codebot/.config/gh
  fi
  
  # Change to workspace directory
  if [ -d "/workspace" ]; then
    cd /workspace
  fi
fi

# Add Nix to PATH
export PATH="/nix/var/nix/profiles/default/bin:\$PATH"
EOF

ENTRYPOINT ["/bin/bash", "-l"]