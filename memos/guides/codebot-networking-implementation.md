# Codebot Networking Exploration Summary

## What We Explored ✅

### Core Infrastructure (Prototyped)

- **Reverse Proxy** (`reverse-proxy.ts`) - HTTP proxy that routes
  `*.codebot.local` to container ports
- **DNS Service** (`start-dns.ts` + `dnsmasq.conf`) - Resolves `*.codebot.local`
  to localhost
- **Container Discovery** - File watcher monitors
  `.bft/container/comm/*/status.json` for dynamic routing
- **Simpsons Naming** - Ready to replace numeric IDs with guest star names

### Manual Verification ✅

```bash
# This worked during exploration:
curl -H "Host: test-dustin-hoffman.codebot.local" http://localhost:8999/health
# Returns: OK
```

The networking prototypes were **functional during exploration**.

## Current Pain Points ❌

### Testing Complexity

- E2E tests have process lifecycle issues in test environment
- Proxy works manually but dies in test runner (likely Deno.serve behavior
  difference)
- DNS requires elevated privileges, complicates CI/testing
- Test infrastructure consuming more time than feature development

### Implementation Overhead

- Multiple moving parts (DNS + proxy + file watching)
- Process management complexity
- System-level dependencies (dnsmasq)

## Potential Implementation Options (For Future Reference)

### Option 1: Proxy-Only (Recommended)

**Ship the reverse proxy without DNS resolution**

**Pros:**

- ✅ Core functionality works perfectly
- ✅ No elevated privileges needed
- ✅ Simple process management
- ✅ Easy to test and deploy
- ✅ Users get friendly URLs: `workspace-name.codebot.local`

**Cons:**

- ⚠️ Users need to add DNS entry manually or use `localhost:port`

**Implementation:**

```bash
# Users can either:
# 1. Access directly: localhost:8123
# 2. Add to /etc/hosts: 127.0.0.1 workspace-name.codebot.local
# 3. Use the proxy: curl -H "Host: workspace-name.codebot.local" localhost:8080
```

### Option 2: Hosts File Management

**Auto-manage /etc/hosts entries instead of DNS service**

**Pros:**

- ✅ No background services
- ✅ Simple file operations
- ✅ Works with all tools/browsers

**Cons:**

- ⚠️ Requires sudo for /etc/hosts modification
- ⚠️ OS-specific implementation

### Option 3: Browser Extension/Bookmarklet

**Client-side solution for URL prettification**

**Pros:**

- ✅ Zero server-side complexity
- ✅ Works in browsers
- ✅ Easy distribution

**Cons:**

- ⚠️ Browser-only (no curl/CLI tools)
- ⚠️ Requires user installation

## Potential Path Forward (If We Decide to Implement)

### Phase 1: Ship Proxy-Only (If Needed)

1. **Complete `codebot.bft.ts` integration:**
   - Replace numeric IDs with Simpsons names
   - Add dynamic port mapping (`-p 0:8000`)
   - Auto-start reverse proxy
   - Show `.codebot.local` URLs in status

2. **Provide multiple access methods:**
   ```
   Workspace: dustin-hoffman

   Direct:  http://localhost:52845
   Proxy:   http://dustin-hoffman.codebot.local:8080
   cURL:    curl -H "Host: dustin-hoffman.codebot.local" localhost:8080
   ```

3. **Document setup options** for users who want full DNS resolution

### Phase 2: Optional DNS (If Needed Later)

- Provide DNS service as opt-in enhancement
- Focus on making it bulletproof before shipping
- Consider hosts file management as alternative

## Key Decision: Simple > Perfect

**Working proxy with manual DNS setup** is infinitely better than **perfect
system that's hard to maintain/test**.

Users get:

- ✅ Pretty workspace names (dustin-hoffman vs workspace-1234567)
- ✅ Multiple access methods
- ✅ Reliable service
- ✅ Easy troubleshooting

## Summary

This was an exploration of codebot networking options. The prototypes proved the technical concepts work, but revealed complexity in testing and deployment. 

**Current Status**: No implementation planned. This memo serves as reference for the exploration work done and potential approaches if networking features are needed in the future.
