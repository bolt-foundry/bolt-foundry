FROM ubuntu:latest

# Install curl and ca-certificates for the Nix installer
RUN apt update -y && apt install -y curl ca-certificates && rm -rf /var/lib/apt/lists/*

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

# Create non-root user (Ubuntu has useradd by default)
RUN useradd -m -s /bin/bash claude

# Switch to claude user and set up .bashrc
USER claude
WORKDIR /home/claude

# Create .bashrc with initialization
COPY <<EOF /home/claude/.bashrc
# Claude Code environment initialization
if [ "\$CODEBOT_INITIALIZED" != "1" ]; then
  export CODEBOT_INITIALIZED=1
  
  # Set up Claude config files if they exist in workspace/tmp
  if [ -f "/workspace/tmp/claude.json" ]; then
    ln -sf /workspace/tmp/claude.json /home/claude/.claude.json
  fi
  
  if [ -d "/workspace/tmp/claude" ]; then
    ln -sf /workspace/tmp/claude /home/claude/.claude
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