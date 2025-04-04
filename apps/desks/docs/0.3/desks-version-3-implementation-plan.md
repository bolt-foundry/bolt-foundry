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
