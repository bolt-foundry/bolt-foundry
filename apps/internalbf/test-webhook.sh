#!/bin/bash

# Test webhook endpoint locally
# Usage: ./test-webhook.sh

echo "Testing GitHub webhook endpoint..."

# Test workflow run (successful deployment)
echo -e "\n1. Testing successful deployment notification:"
curl -X POST http://localhost:9999/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: workflow_run" \
  -H "X-GitHub-Delivery: test-$(date +%s)" \
  -d '{
    "action": "completed",
    "workflow_run": {
      "id": 12345,
      "name": "Deploy boltfoundry-com",
      "status": "completed",
      "conclusion": "success",
      "head_branch": "main",
      "head_sha": "abc123def456789",
      "html_url": "https://github.com/bolt-foundry/bolt-foundry/actions/runs/12345"
    },
    "repository": {
      "full_name": "bolt-foundry/bolt-foundry",
      "name": "bolt-foundry",
      "owner": { "login": "bolt-foundry" }
    }
  }'

# Test pull request merged
echo -e "\n\n2. Testing PR merged notification:"
curl -X POST http://localhost:9999/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request" \
  -H "X-GitHub-Delivery: test-$(date +%s)-2" \
  -d '{
    "action": "closed",
    "pull_request": {
      "number": 123,
      "title": "Add new feature",
      "state": "closed",
      "merged": true,
      "html_url": "https://github.com/bolt-foundry/bolt-foundry/pull/123",
      "user": { "login": "developer1" },
      "merged_by": { "login": "maintainer1" }
    },
    "repository": {
      "full_name": "bolt-foundry/bolt-foundry",
      "name": "bolt-foundry",
      "owner": { "login": "bolt-foundry" }
    }
  }'

# Test review requested
echo -e "\n\n3. Testing review request notification:"
curl -X POST http://localhost:9999/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: pull_request_review" \
  -H "X-GitHub-Delivery: test-$(date +%s)-3" \
  -d '{
    "action": "review_requested",
    "pull_request": {
      "number": 125,
      "title": "Fix bug in component",
      "state": "open",
      "html_url": "https://github.com/bolt-foundry/bolt-foundry/pull/125",
      "user": { "login": "developer3" }
    },
    "requested_reviewer": { "login": "reviewer1" },
    "repository": {
      "full_name": "bolt-foundry/bolt-foundry",
      "name": "bolt-foundry",
      "owner": { "login": "bolt-foundry" }
    }
  }'

# Test failed deployment
echo -e "\n\n4. Testing failed deployment notification:"
curl -X POST http://localhost:9999/webhooks/github \
  -H "Content-Type: application/json" \
  -H "X-GitHub-Event: workflow_run" \
  -H "X-GitHub-Delivery: test-$(date +%s)-4" \
  -d '{
    "action": "completed",
    "workflow_run": {
      "id": 12346,
      "name": "Deploy boltfoundry-com",
      "status": "completed",
      "conclusion": "failure",
      "head_branch": "main",
      "head_sha": "def456abc789012",
      "html_url": "https://github.com/bolt-foundry/bolt-foundry/actions/runs/12346"
    },
    "repository": {
      "full_name": "bolt-foundry/bolt-foundry",
      "name": "bolt-foundry",
      "owner": { "login": "bolt-foundry" }
    }
  }'

echo -e "\n\nWebhook tests completed!"