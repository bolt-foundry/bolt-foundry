# Automated Deployment Workflow Implementation Plan

## Overview

This plan outlines the implementation of an automated deployment workflow that replaces the current manual process of running `bff land` and clicking "Deploy" in Replit. The new system will enable GitHub Actions to trigger deployments through a secure internal BF service (running on its own Replit), which will handle SSH connections to the main monorepo Replit and execute deployment commands automatically.

The implementation is split into three phases to reduce complexity and enable incremental validation.

## Goals

| Goal | Description | Success Criteria |
| ---- | ----------- | ---------------- |
| Automate deployments | Replace manual `bff land` + deploy click process | GitHub push triggers automatic deployment to Replit |
| Secure communication | Protect deployment pipeline from unauthorized access | Authentication tokens validate all requests |
| Start simple | Get basic automation working before adding features | Phase 1 successfully runs `bff land` via webhook |

## Anti-Goals

| Anti-Goal | Reason |
| --------- | ------ |
| Complex orchestration | Keep initial version simple and focused on core workflow |
| Multi-environment support | Start with single Replit deployment target |
| Rollback automation | Manual intervention remains available for issues |
| Custom UI/dashboard | Use existing tools and logs for monitoring |
| Perfect error handling | Phase 1 focuses on happy path, iterate on edge cases |

## Technical Approach

The deployment pipeline follows a simple webhook architecture where GitHub Actions notify internal BF to run `bff land`. Later phases add authentication, error handling, and the Replit deployment API.

All automated operations will use a dedicated "bff bot" user (support@boltfoundry.com) with appropriate SSH and 1Password access, ensuring clear separation between human and automated actions.

## Implementation Phases

### Phase 1: Basic Automation (MVP)

**Goal**: GitHub webhook triggers `bff land` via SSH from internal BF Replit to main monorepo Replit

| Status | Component | Purpose |
| ------ | --------- | ------- |
| [ ] | Internal BF Replit setup | New Replit running simple web service |
| [ ] | GitHub Actions workflow | Send webhook on push to main |
| [ ] | Internal BF endpoint (no auth) | Receive webhook and SSH to main Replit |
| [ ] | SSH connection | Connect from internal BF to monorepo Replit |
| [ ] | Basic logging | Use existing logger infrastructure |

**Simplifications**:
- No authentication (rely on obscure URL initially)
- No Replit deployment API (still manual deploy click)
- Simple success/failure response
- Hardcoded SSH credentials/connection for now

### Phase 2: Security & Better Practices

**Goal**: Add authentication and improve reliability

| Status | Component | Purpose |
| ------ | --------- | ------- |
| [ ] | Bearer token authentication | Secure the webhook endpoint |
| [ ] | SSH key management | Integrate with 1Password for credential storage |
| [ ] | Enhanced logging | Add deployment metadata to logs |
| [ ] | Error handling | Graceful failures with clear messages |
| [ ] | Deployment status tracking | Know when `bff land` completes |

### Phase 3: Full Automation

**Goal**: Complete automation including Replit deployment API

| Status | Component | Purpose |
| ------ | --------- | ------- |
| [ ] | Replit GraphQL client | Trigger deployment after `bff land` |
| [ ] | Status tracking | Monitor deployment progress |
| [ ] | Error notifications | Alert on failures |
| [ ] | Concurrent request handling | Queue or reject overlapping deploys |

## Technical Decisions

| Decision | Reasoning | Alternatives Considered |
| -------- | --------- | ----------------------- |
| Start with simple webhook | Reduce initial complexity, prove concept | Full authentication from start |
| Phased implementation | Lower risk, faster initial delivery | Build everything at once |
| Use Sapling (sl) for updates | Consistent with existing bff land workflow | Git commands, fresh clones |
| Replit-to-Replit SSH | Both services run on Replit infrastructure | External hosting, API-only approach |
| Dedicated bot user | Clear audit trail, limited permissions | Using personal accounts |

## Phase 1 Implementation Details

### GitHub Actions Workflow (Phase 1)

```yaml
name: Deploy to Internal BF
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger deployment
        run: |
          curl -X POST https://internalbf.com/deploy-webhook-${{ secrets.WEBHOOK_KEY }} \
            -H "Content-Type: application/json" \
            -d '{
              "commit_sha": "${{ github.sha }}",
              "branch": "${{ github.ref_name }}"
            }'
```

### Internal BF Endpoint (Phase 1)

```typescript
// Simple webhook handler - Phase 1 (runs on internal BF Replit)
app.post('/deploy-webhook-:key', async (req, res) => {
  console.log(`Deployment triggered: ${req.body.commit_sha}`);
  
  try {
    // SSH to main monorepo Replit and run deployment commands
    const sshCommand = `
      cd /home/runner/bolt-foundry-monorepo && 
      sl pull && 
      sl goto ${req.body.branch} && 
      bff land
    `;
    
    // SSH format: ssh -i ~/.ssh/replit -p 22 {repl-id}@{repl-id}-{suffix}.kirk.replit.dev
    // Connection details stored in environment variables
    const result = await exec(
      `ssh -i ~/.ssh/replit -p 22 ${process.env.MONOREPO_SSH_CONNECTION} "${sshCommand}"`
    );
    
    console.log('Deploy succeeded:', result);
    res.json({ status: 'success' });
  } catch (error) {
    console.error('Deploy failed:', error);
    res.status(500).json({ status: 'failed', error: error.message });
  }
});
```

## Next Steps by Phase

### Phase 1 Questions
| Question | How to Explore |
| -------- | -------------- |
| How to set up bff bot user in Replit? | Create support@boltfoundry.com account with SSH access |
| How to configure 1Password for bot user? | Set up service account or shared vault access |
| How to grant bot appropriate permissions? | Configure minimal required access for deployment |

### Phase 2 Questions
| Question | How to Explore |
| -------- | -------------- |
| How to integrate with get-configuration-var package? | Review package API and usage patterns |

### Phase 3 Questions
| Question | How to Explore |
| -------- | -------------- |
| What's the Replit GraphQL schema? | Explore Replit dashboard network requests |
| How to handle concurrent deploys? | Simple lock file or request queue |

## Success Criteria by Phase

### Phase 1 Success
- GitHub push triggers webhook to internal BF
- Internal BF runs `bff land` successfully
- Basic logs show deployment attempts
- Manual Replit deploy still required

### Phase 2 Success
- Webhook requires authentication token
- `bff land` runs in actual Replit environment via SSH
- Structured logs capture all deployment steps
- Manual Replit deploy still required

### Phase 3 Success
- Full automation from push to deployed
- No manual steps required
- Clear error messages on failures
- Deployment status tracked end-to-end