FROM debian:bookworm-slim

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the compiled binary
COPY build/boltfoundry-com /usr/local/bin/boltfoundry-com
RUN chmod +x /usr/local/bin/boltfoundry-com

# Non-root user for security
RUN useradd -m -s /bin/false app
USER app

EXPOSE 8000

CMD ["/usr/local/bin/boltfoundry-com"]