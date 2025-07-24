FROM nixos/nix:latest

# Enable experimental nix features
RUN echo "experimental-features = nix-command flakes" >> /etc/nix/nix.conf

# Copy flake files for optimal caching (rebuild only when nix dependencies change)
COPY flake.nix flake.lock /workspace/
WORKDIR /workspace  

# Pre-build the expensive nix environment and install tools (cached until flake files change)
RUN nix develop .#everything --command echo "Environment cached"

# Create a wrapper script that sets up the nix environment
RUN mkdir -p /usr/local/bin && \
    echo '#!/bin/sh' > /usr/local/bin/with-nix && \
    echo 'cd /workspace' >> /usr/local/bin/with-nix && \
    echo 'exec nix develop .#everything --command "$@"' >> /usr/local/bin/with-nix && \
    chmod +x /usr/local/bin/with-nix

# Default command - drop into nix environment  
CMD ["with-nix", "bash"]