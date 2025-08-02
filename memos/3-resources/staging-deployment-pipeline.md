# Staging Deployment Pipeline Implementation

## Overview

Implement a staging environment with automated deployment pipeline that gates
production releases. The system uses internalbf as the orchestrator to manage
the flow from staging validation to production deployment.

## Architecture

### Deployment Flow

```
Push to main → Deploy to staging → Run E2E tests → Notify internalbf → Deploy to production
                (boltfoundry.wtf)                    (orchestrator)     (boltfoundry.com)
```

### Components

1. **Staging Environment** (boltfoundry.wtf)
   - Separate Hetzner project (complete isolation)
   - Mirrors production infrastructure exactly
   - Own Terraform state in separate S3 bucket

2. **internalbf Orchestrator**
   - Receives deployment status notifications
   - Triggers production deployment via GitHub API
   - Handles failure notifications
   - Requires its own deployment environment

3. **GitHub Actions Workflows**
   - Staging deployment workflow
   - E2E test execution
   - Custom event notifications to internalbf
   - Production deployment (triggered by internalbf)

## Implementation Phases

### Phase 1: internalbf Environment Setup

Set up internalbf as a separate deployed service to orchestrate the pipeline.

**Requirements:**

- Deployment environment for internalbf (Hetzner/Replit/other?)
- API endpoints for receiving deployment notifications
- GitHub API integration for triggering workflows
- Authentication tokens for secure communication

**Endpoints needed:**

```
POST /deployment/staging/complete
{
  "event": "staging_deployment_complete",
  "status": "success|failure",
  "commit_sha": "...",
  "timestamp": "..."
}
```

**Environment variables:**

- `GITHUB_TOKEN` - For triggering production workflow
- `WEBHOOK_AUTH_TOKEN` - For validating incoming requests
- `NOTIFICATION_ENDPOINTS` - Where to send failure alerts

### Phase 2: Staging Infrastructure

Create complete staging environment in new Hetzner project.

**Terraform structure:**

```
infra/terraform/staging/
├── main.tf                 # Staging infrastructure
├── deploy.yml.tpl         # Kamal config template
├── cloud-init.yml         # Server setup
└── terraform.tfvars.example
```

**Key differences from production:**

- Domain: boltfoundry.wtf
- Hetzner project: "staging" (new project)
- S3 bucket: "bfterraform-staging"
- Server name: "boltfoundry-staging"
- All resources tagged with environment=staging

**Required new secrets:**

- `HETZNER_API_TOKEN_STAGING` - Staging project API token
- `AWS_ACCESS_KEY_ID_STAGING` - Staging S3 credentials
- `AWS_SECRET_ACCESS_KEY_STAGING` - Staging S3 credentials
- `INTERNALBF_WEBHOOK_TOKEN` - Auth token for notifications

### Phase 3: GitHub Actions Updates

Modify deployment workflows to support staging pipeline.

**New workflow: `.github/workflows/deploy-staging.yml`**

```yaml
name: Deploy to Staging

on:
  push:
    branches: [main]
    paths:
      - "apps/boltfoundry-com/**"
      - "infra/terraform/staging/**"

jobs:
  deploy:
  # ... build and deploy to staging ...

  test:
    needs: deploy
    # ... run E2E tests ...

  notify:
    needs: test
    if: always()
    steps:
      - name: Notify internalbf
        run: |
          curl -X POST https://internalbf.com/deployment/staging/complete \
            -H "Authorization: Bearer ${{ secrets.INTERNALBF_WEBHOOK_TOKEN }}" \
            -H "Content-Type: application/json" \
            -d '{
              "event": "staging_deployment_complete",
              "status": "${{ needs.test.result }}",
              "commit_sha": "${{ github.sha }}",
              "timestamp": "${{ steps.timestamp.outputs.time }}"
            }'
```

**Update production workflow:**

- Remove automatic trigger on push to main
- Add workflow_dispatch trigger for internalbf to call
- Add input parameters for commit SHA to deploy

### Phase 4: internalbf Production Trigger

Implement production deployment trigger in internalbf.

```typescript
// internalbf endpoint handler
async function handleStagingComplete(req: Request) {
  const { status, commit_sha } = await req.json();

  if (status === "success") {
    // Trigger production deployment
    await octokit.actions.createWorkflowDispatch({
      owner: "bolt-foundry",
      repo: "monorepo",
      workflow_id: "deploy-production.yml",
      ref: "main",
      inputs: {
        commit_sha,
        triggered_by: "internalbf-staging-success",
      },
    });
  } else {
    // Handle failure notifications
    await notifyFailure({
      environment: "staging",
      commit: commit_sha,
      details: "E2E tests failed",
    });
  }
}
```

## Benefits

1. **Risk Reduction**: Production never receives untested code
2. **Automated Testing**: E2E tests run on every deployment
3. **Infrastructure Testing**: Can test Terraform changes safely
4. **Rollback Confidence**: Staging validates changes first
5. **Observability**: internalbf provides central orchestration

## Open Questions

1. **internalbf Hosting**:
   - Deploy on Hetzner (another project)?
   - Use existing Replit?
   - Other platform?

2. **Monitoring**:
   - How to monitor internalbf health?
   - Alerting for orchestration failures?
   - Deployment status dashboard?

3. **Manual Overrides**:
   - Emergency production deployment bypass?
   - Manual staging → production promotion?
   - Rollback triggers?

## Success Criteria

- [ ] Zero failed production deployments due to code issues
- [ ] E2E tests catch breaking changes before production
- [ ] Full deployment takes < 15 minutes (staging + tests + production)
- [ ] Clear audit trail of all deployments via internalbf
- [ ] Easy rollback process when needed

## Next Steps

1. Decide on internalbf hosting approach
2. Create internalbf deployment pipeline
3. Implement notification endpoints
4. Set up staging Hetzner project
5. Create staging Terraform configuration
6. Update GitHub Actions workflows
7. Test full pipeline end-to-end
