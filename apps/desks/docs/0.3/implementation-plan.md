# Desks: Implementation Plan - Version 0.3

**Version:** 0.3 **Date:** 2023-10-20

## Version Summary

This implementation phase adds "knock" request functionality to desks, allowing
participants to request private conversations with other desk members in a
non-disruptive way.

## Changes From Previous Version

Version 0.3 builds on the core desk functionality established in 0.2 by adding
mechanisms for initiating private conversations through a permission-based
"knock" system.

## Technical Goals

- Create "knock" request system for initiating private conversations
- Implement UI for sending and responding to knock requests
- Build notification system for knock requests
- Add privacy controls for knock permissions

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

### 3. Knock Request UI Components (Moderate)

**File**: `apps/desks/components/KnockRequest.tsx`

**Purpose**: Create UI components for sending and responding to knock requests

**Technical Specifications**:

- Build interface for initiating knock requests
- Create notification component for incoming requests
- Implement response controls (accept/decline)
- Add visual feedback for request status

**UI Components**:

- Knock button with participant selector
- Request message composer
- Incoming request notification
- Request status display

### 4. Private Conversation Handling (Challenging)

**File**: `apps/desks/components/PrivateConversation.tsx`

**Purpose**: Implement the UI and logic for private conversations after knock
acceptance

**Technical Specifications**:

- Create separate video chat interface for private conversations
- Implement mechanism to transition from desk to private chat
- Add controls for ending private conversations
- Ensure smooth return to main desk

**Features**:

- Dedicated video stream for private conversation
- Visual indicator of private conversation status
- Easy way to return to main desk
- Screen sharing capability for private conversations

## Integration Points

- Connect with the core desk video system from Version 0.2
- Interface with notification system for real-time alerts
- Integrate with permission systems for knock request authorization

## Testing Strategy

- Unit tests for knock request model
- Component tests for UI elements
- Integration tests for the full knock flow
- User testing for UX validation
- Performance testing for real-time notification delivery
