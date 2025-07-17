# Billing Implementation Guide

**Date:** 2025-07-17\
**Type:** Implementation Guide\
**Status:** Draft

## Overview

This guide covers implementing a minimum spend billing system with credit
rollover where users pay at least $30 monthly and excess usage becomes credits
for future periods.

## Business Model

### Pricing Structure

- **Monthly minimum:** $30 minimum spend commitment
- **Usage charges:** 20% markup fee only (metered billing)
- **Credit rollover:** Excess credits roll forward to next month
- **Payment processing:** Stripe subscriptions + metered billing
- **Usage pricing:** 20% markup fee on inference costs

### Key Principles

- Minimum spend model with credit rollover
- Stripe handles metered billing for usage charges
- Custom logic enforces $30 monthly minimum at billing period end
- Excess credits naturally accumulate via Stripe
- Users provide their own API keys (OpenAI, OpenRouter, etc.)
- We charge 20% markup fee only (users pay API providers directly)

## System Architecture

### Component Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Stripe      │    │   Application   │    │    Database     │
│ Metered Billing │◄──►│ Usage Reporting │◄──►│ Usage/API Keys  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Responsibilities

- **Stripe:** Metered billing, payment processing, credit balances, webhooks
- **Application:** Usage reporting, minimum spend enforcement, API key
  management
- **Database:** Usage events, API keys, subscription state

## Core Components

### Subscription Management

- Create subscriptions with $30 recurring fee via Stripe
- Handle subscription lifecycle (creation, updates, cancellation)
- Process webhook events for billing period changes
- Track subscription status and billing periods

### Metered Billing System

- Report usage charges to Stripe throughout the month
- Let Stripe handle credit balances and payment processing
- Enforce $30 minimum spend at billing period end via custom logic
- Allow credit rollover for excess amounts
- Leverage Stripe's native billing infrastructure

### Usage Tracking

- Record sample processing events
- Calculate inference costs from API provider responses
- Calculate 20% markup fee (not full cost)
- Report markup fee to Stripe via metered billing API
- Provide usage history and cost breakdowns
- Support different API providers (OpenAI, OpenRouter, etc.)

### API Key Management

- Users provide their own API keys
- Securely store credentials using GCP Secret Manager
- Use user keys for inference requests
- Track costs per API provider
- Handle API key rotation and updates

## Data Requirements

### Subscription Data

- User subscription status and billing periods
- Stripe subscription ID for webhook processing
- Current period start and end dates
- Payment status and billing period information

### Usage Data (Stored in Stripe)

- Current usage charges for billing period
- Credit balance from previous excess usage
- Usage history via Stripe reporting
- Automatic payment processing

### Local Usage Data

- Sample processing events and grading results
- Inference costs from API provider responses
- 20% markup fee calculations
- Usage timestamps and processing metadata
- API provider information and model used

### API Key Data

- User API keys stored in GCP Secret Manager
- Secret references stored in database (not actual keys)
- API provider configurations (OpenAI, OpenRouter, etc.)
- Usage limits and quotas per provider
- Key rotation history and status

## Key Workflows

### Subscription Creation

1. User signs up for monthly subscription
2. Stripe creates subscription with $30 recurring fee
3. System creates subscription record
4. Set billing period dates
5. User gets $30 credit and ready to accumulate usage charges

### Billing Period End

1. Stripe webhook fires at billing period end
2. Calculate total usage charges for period
3. If usage < $30, add minimum spend adjustment to invoice
4. If usage ≥ $30, let excess become credit balance
5. Invoice is finalized and processed

### Sample Processing and Billing

1. User submits sample for grading
2. System retrieves user's API key
3. Process sample using user's API key
4. Capture inference cost from API response
5. Calculate 20% markup fee (e.g., $1.00 cost = $0.20 fee)
6. Report markup fee to Stripe via metered billing API
7. Record processing event with cost breakdown
8. Return grading results and updated usage total

### Credit Exhaustion

1. User attempts service usage
2. Check current Stripe credit balance
3. If insufficient credits, block service access
4. Display balance warning with minimum spend info
5. Process continues when credits are available or new billing period starts

## API Design

### Subscription Endpoints

- Create subscription with Stripe integration
- Get current subscription status
- Update subscription settings
- Cancel subscription

### Billing Endpoints

- Get current usage total and credit balance from Stripe
- Get billing history and analytics
- Get upcoming invoice preview

### Usage Endpoints

- Submit samples for grading
- Get processing history with cost breakdowns
- Calculate estimated costs before processing

### API Key Endpoints

- Add/update API keys for providers
- List configured API providers
- Test API key validity
- Remove API keys

## Webhook Integration

### Stripe Events

- `invoice.created` - Check usage total and add minimum spend adjustment
- `invoice.payment_succeeded` - Confirm billing period completion
- `invoice.payment_failed` - Handle payment failures
- `customer.subscription.updated` - Update subscription status
- `customer.subscription.deleted` - Handle cancellations

### Webhook Processing

- Verify webhook signatures
- Process events idempotently
- Handle webhook failures gracefully
- Log all webhook events for audit

## Error Handling

### Common Scenarios

- Insufficient credits for sample processing
- API key failures or rate limits
- Payment failures and retries
- Webhook processing failures
- Minimum spend calculation errors
- Inference cost calculation errors

### User Experience

- Clear credit balance display from Stripe
- Usage tracking with minimum spend progress
- Graceful degradation when credits exhausted
- Easy subscription and API key management
- Transparent cost breakdowns (API cost paid directly + 20% markup fee)
- Credit rollover notifications and balance history

## Security Considerations

### Data Protection

- Encrypt sensitive billing information
- Store API keys in GCP Secret Manager (not database)
- Implement audit logging for all credit transactions
- Secure webhook endpoints with signature verification
- Follow PCI compliance for payment data

### Access Control

- User-specific credit and usage data
- Admin access for subscription management
- Role-based permissions for billing operations
- API authentication and authorization

## Monitoring Requirements

### Key Metrics

- Monthly recurring revenue (MRR)
- Credit utilization rates
- Usage patterns by service type
- Subscription churn and retention rates

### Alerting

- Webhook processing failures
- Credit balance discrepancies
- Payment failures
- Unusual usage patterns

## Testing Strategy

### Critical Test Cases

- Metered billing accuracy
- Minimum spend enforcement
- Webhook event processing
- Subscription lifecycle management
- Credit rollover functionality

### Load Testing

- Concurrent usage reporting to Stripe
- High-volume webhook processing
- Database performance under load
- API response times

## Deployment Considerations

### Infrastructure

- Database setup for usage events and API key references
- GCP Secret Manager for secure API key storage
- Webhook endpoint configuration
- Stripe metered billing integration
- Monitoring and alerting systems

### Go-Live Checklist

- Webhook endpoint tested and verified
- Metered billing system thoroughly tested
- User interface for balance and usage display
- Admin tools for subscription management
- Minimum spend enforcement tested

## Future Enhancements

### Enhanced Features

- Different minimum spend tiers
- Bulk usage discounts
- Advanced usage analytics

### Advanced Features

- Usage analytics and insights
- Predictive usage modeling
- Custom pricing tiers
- Enterprise features

## Success Criteria

- Accurate metered billing and minimum spend enforcement
- Reliable webhook processing
- Smooth user experience with credit rollover
- Zero billing discrepancies
- Successful billing period processing with proper adjustments

## Conclusion

This minimum spend model with credit rollover provides a simple, predictable
billing experience while leveraging Stripe's native metered billing
capabilities. The key is using Stripe for 95% of the billing logic while only
implementing custom minimum spend enforcement at billing period end.
