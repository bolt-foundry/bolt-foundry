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
  
  # .claude directory is mounted directly from host
  # Copy .claude.json from workspace if it exists
  if [ -f "/workspace/.claude.json" ]; then
    cp /workspace/.claude.json /home/codebot/.claude.json
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
EOF

ENTRYPOINT ["/bin/bash", "-l"]