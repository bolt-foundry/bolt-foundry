# GCP Secrets & Configuration Implementation Plan - Version 0.1

## Version Goals

Establish a foundation for securely managing both sensitive (secrets) and
non-sensitive configuration variables (sitevars) in GCP using Terraform, with
simple developer tooling. Sitevars will provide a mechanism for managing feature
flags, application settings, and other non-sensitive configuration that can be
changed without code deployments.

## Components and Implementation Details

### 1. GCP Project Setup (Complexity: Simple)

- Create basic Terraform configuration files
- Configure Google provider with appropriate authentication
- Enable required APIs (Secret Manager and Runtime Config)
- Set up GCS backend for Terraform state management

### 2. Secrets Manager Configuration (Complexity: Moderate)

- Define Secret Manager resources for sensitive information
- Create initial secret resources (without values)
- Configure IAM policies for secure access
- Implement basic encryption settings

### 4. BFF CLI Integration (Complexity: Moderate)

- Create commands for managing secrets:
  - `secrets:list`: List all secrets
  - `secrets:get`: Retrieve a secret value
  - `secrets:set`: Store a new secret value
- Create commands for managing sitevars:
  - `sitevar:list`: List all configuration variables
  - `sitevar:get`: Retrieve a configuration value
  - `sitevar:set`: Update a configuration value
- Ensure all commands use GCP_PROJECT_ID from environment

### 5. CI/CD Integration (Complexity: Simple)

- Add Terraform validation to CI pipeline
- Document manual apply process for initial deployment
- Create simple documentation for reviewing Terraform plans

## Directory Structure

Initial simplified structure:

```
infra/gcp/
├── main.tf                # Main Terraform configuration
├── variables.tf           # Input variables
├── outputs.tf             # Useful outputs
├── versions.tf            # Terraform version constraints
├── backend.tf             # State management configuration
├── secrets.tf             # Secrets Manager resources
├── runtime_config.tf      # Runtime Configuration resources
├── terraform.tfvars       # Project-specific variables
└── README.md              # Documentation
```

## Testing Strategy

- Validate Terraform configurations with `terraform validate`
- Verify secret creation and retrieval with BFF commands
- Test sitevar updates and access
- Validate access controls with different users
- Measure secret access latency for application integration

## Success Criteria for v0.1

1. Terraform can successfully deploy to GCP
2. Secrets can be securely stored and retrieved via BFF commands
3. Sitevars can be configured and accessed
4. Basic documentation is available for developers
5. Security controls prevent unauthorized access to secrets

## Future Enhancements (v0.2+)

- Environment-specific configurations (dev/staging/prod)
- Secret rotation mechanisms
- Advanced access controls
- Client-side caching for sitevars
