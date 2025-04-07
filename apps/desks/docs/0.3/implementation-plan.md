# Desks Implementation Plan - Version 0.3

**Version:** 0.3 **Date:** 2023-09-20

## Version Summary

Version 0.3 focuses on enhancing the Desks feature with "knock requests"
functionality, allowing users to request to join ongoing desk sessions, similar
to knocking on a door in real life.

## Changes From Previous Version

Version 0.2 established the core Desks functionality including participant
management and real-time status updates. Version 0.3 builds on this by:

1. Adding knock request functionality for desk access
2. Implementing notifications for request management
3. Enhancing UI to support the knock workflow

## Technical Goals

- Implement knock request database models and logic
- Create UI for sending and responding to knock requests
- Extend GraphQL schema with knock request operations
- Add real-time notifications for knock requests

## Components and Implementation

### 1. Knock Request Database Models (Moderate)

**File**: `apps/desks/bfdb/DeskKnockRequest.ts`

**Purpose**: Define database models for storing and managing knock requests

**Technical Specifications**:

- Create BfNode class for DeskKnockRequest
- Implement methods for creating, updating, and resolving requests
- Design appropriate validation for request state transitions
- Include timestamps for request lifecycle management

**Model Implementation**:

```typescript
// Basic structure, not actual implementation code
class DeskKnockRequest extends BfNodeBase {
  static readonly TYPE = "DeskKnockRequest";

  static async createKnockRequest(
    context: GraphQLContext,
    fromParticipantId: string,
    toParticipantId: string,
    message?: string,
  ): Promise<DeskKnockRequest> {
    // Implementation details
  }

  async updateStatus(
    context: GraphQLContext,
    status: KnockRequestStatus,
  ): Promise<void> {
    // Implementation details
  }
}

enum KnockRequestStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED",
  EXPIRED = "EXPIRED",
  CANCELED = "CANCELED",
}
```

### 2. GraphQL Schema Extensions for Knock Requests (Moderate)

**File**: `apps/desks/graphql/KnockRequestTypes.ts`

**Purpose**: Define GraphQL types and operations for knock requests

**Technical Specifications**:

- Add GraphQL types for KnockRequest and related enums
- Create mutations for creating and responding to knock requests
- Implement subscriptions for real-time notifications
- Include proper error handling for edge cases

**Schema Extensions**:

```graphql
type KnockRequest {
  id: ID!
  fromParticipant: DeskParticipant!
  toParticipant: DeskParticipant!
  status: KnockRequestStatus!
  message: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum KnockRequestStatus {
  PENDING
  ACCEPTED
  DECLINED
  EXPIRED
  CANCELED
}

type Mutation {
  createKnockRequest(input: CreateKnockRequestInput!): CreateKnockRequestPayload!
  updateKnockRequestStatus(input: UpdateKnockRequestStatusInput!): UpdateKnockRequestStatusPayload!
}

type Subscription {
  knockRequestReceived: KnockRequest!
  knockRequestUpdated: KnockRequest!
}
```

### 3. Knock Request UI Components (Challenging)

**File**: `apps/desks/components/KnockRequest.tsx`

**Purpose**: Create UI components for sending and responding to knock requests

**Technical Specifications**:

- Build form for sending knock requests with optional message
- Create notification component for displaying incoming requests
- Implement accept/decline action buttons with appropriate feedback
- Design status indicators for pending/resolved requests

### 4. Real-time Notifications (Moderate)

**File**: `apps/desks/components/KnockRequestNotification.tsx`

**Purpose**: Display real-time notifications for knock requests

**Technical Specifications**:

- Subscribe to knock request GraphQL subscriptions
- Show toast notifications for new requests
- Play sound notifications (optional)
- Support desktop notifications (when possible)

## Integration Points

- **Database Layer**: New models for knock requests integrated with existing
  desk models
- **GraphQL API**: Extended schema with new types and operations
- **UI Components**: Knock request components integrated with desk UI
- **Notification System**: Integration with existing notification architecture

## Testing Strategy

### Unit Tests

- Test database model methods for knock request lifecycle
- Verify GraphQL resolver functionality
- Test UI component rendering and interactions

### Integration Tests

- Test complete knock request flow through GraphQL
- Verify notifications are properly triggered
- Test error cases and edge conditions

### End-to-End Tests

- Test the complete user experience for sending/receiving knock requests
- Verify real-time updates across different users
- Test all request status transitions and UI states

## Risk Assessment

| Risk                     | Severity | Likelihood | Mitigation                                   |
| ------------------------ | -------- | ---------- | -------------------------------------------- |
| Notification reliability | High     | Medium     | Add retry logic and pending state management |
| User experience clarity  | Medium   | Medium     | User testing and iterative improvements      |
| Request spam potential   | Medium   | Low        | Implement rate limiting for knock requests   |

## Next Steps for Version 0.4

- Add desk templates and presets
- Implement desk history and analytics
- Add more granular permission controls
- Enhance mobile experience for desk participation
