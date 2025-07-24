FROM nixos/nix:latest
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf

# Copy just the flake files for layer caching
COPY flake.nix flake.lock /workspace/
WORKDIR /workspace

ENV NIX_BIN_PATH=/nix/var/nix/profiles/default/bin

# Build and install the NixOS configuration's /etc files (contains profile.d scripts)
RUN NIXPKGS_ALLOW_UNFREE=1 nix build .#nixosConfigurations.codebot-container.config.system.build.etc --accept-flake-config --impure && \
    cp -r result/etc/* /etc/ && \
    rm result

# Install the environment packages for compatibility
RUN nix profile install .#codebot-env --accept-flake-config

ENTRYPOINT ["/bin/sh", "-c", "if [ $# -eq 0 ]; then exec \"$NIX_BIN_PATH/bash\" -l; else exec $NIX_BIN_PATH/bash -lc \"$*\"; fi", "--"]