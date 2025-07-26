FROM alpine:latest

# Install minimal runtime dependencies
RUN apk add --no-cache ca-certificates

# Copy the compiled binary
COPY build/boltfoundry-com /usr/local/bin/boltfoundry-com
RUN chmod +x /usr/local/bin/boltfoundry-com

# Non-root user for security
RUN adduser -D -s /bin/false app
USER app

EXPOSE 8000

CMD ["/usr/local/bin/boltfoundry-com"]