FROM nixos/nix:latest
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf

# Copy just the flake files for layer caching
COPY flake.nix flake.lock /workspace/
WORKDIR /workspace

ENV NIX_BIN_PATH=/nix/var/nix/profiles/default/bin
RUN nix profile install .#codebot-env --accept-flake-config

ENTRYPOINT ["/bin/sh", "-c", "exec \"$NIX_BIN_PATH/bash\" -l"]