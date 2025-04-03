# Desks: Phase 3 Implementation Plan - Door Knock Feature

## Reasoning First

The "Door Knock" feature is the key differentiator for the Desks application,
enabling natural conversation initiation within a persistent video space. This
phase builds upon the foundational video connection and state management
established in Phase 2, adding a permission-based conversation request system
that respects participants' focus while enabling spontaneous communication.

Traditional video conferencing experiences lack elegant ways to request
conversation in a shared space. This implementation solves that problem with a
touch-friendly request system optimized for iPad that mimics the social dynamics
of knocking on someone's office door - maintaining social boundaries while
enabling connection.

## Technical Goal

Implement the "Door Knock" conversation request feature with notification
system, allowing participants to request and manage audio/video conversations
with specific individuals in the shared space.

## Dependencies

- Phase 1 (Foundation) - Basic route structure and layout
- Phase 2 (Video Connection) - Core video functionality with Isograph state
  management

## Components

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

### 3. Knock Request UI Component (Challenging)

**File**: `apps/desks/components/KnockRequestButton.tsx`

**Purpose**: Provide interface for sending knock requests to other participants

**Technical Specifications**:

- Implement touch-friendly UI for initiating requests
- Create dialog for optional message input
- Show status indicators during request lifecycle
- Handle request cancellation
- Optimize for iPad touch interactions

**Component API**:

```typescript
interface KnockRequestButtonProps {
  targetParticipantId: string;
  targetParticipantName: string;
  onRequestSent: (requestId: string) => void;
  onRequestCanceled: (requestId: string) => void;
  onRequestResolved: (requestId: string, status: KnockRequestStatus) => void;
}
```

### 4. Notification Component (Challenging)

**File**: `apps/desks/components/KnockRequestNotification.tsx`

**Purpose**: Display incoming knock requests and allow response actions

**Technical Specifications**:

- Create non-intrusive but noticeable notification UI
- Implement accept/decline actions
- Include participant details and optional message
- Optimize layout for iPad landscape orientation
- Support multiple simultaneous notifications

**Component API**:

```typescript
interface KnockRequestNotificationProps {
  request: KnockRequest;
  onAccept: (requestId: string) => void;
  onDecline: (requestId: string) => void;
}

interface KnockRequest {
  id: string;
  fromParticipant: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  message?: string;
  createdAt: Date;
}
```

### 5. Notification Manager (Moderate)

**File**: `apps/desks/components/KnockRequestManager.tsx`

**Purpose**: Manage the queue of incoming and outgoing knock requests

**Technical Specifications**:

- Track all active knock requests
- Manage notification display order and priority
- Handle request timeouts and expirations
- Implement sound notifications (with mute option)
- Integrate with Isograph for state management

**Component API**:

```typescript
interface KnockRequestManagerProps {
  currentParticipantId: string;
  soundEnabled?: boolean;
  onRequestStatusChange: (
    requestId: string,
    status: KnockRequestStatus,
  ) => void;
}
```

### 6. Audio Permission Management (Challenging)

**File**: `apps/desks/components/AudioPermissionHandler.tsx`

**Purpose**: Manage audio permissions based on accepted knock requests

**Technical Specifications**:

- Handle state transitions when requests are accepted
- Toggle audio tracks for specific participant pairs
- Create permission groups for multi-person conversations
- Maintain default state for non-conversing participants
- Handle browser permission requests gracefully

**Component API**:

```typescript
interface AudioPermissionHandlerProps {
  participantId: string;
  activeConversations: ActiveConversation[];
  onPermissionChange: (enabled: boolean) => void;
  onPermissionError: (error: Error) => void;
}

interface ActiveConversation {
  participants: string[];
  startedAt: Date;
}
```

### 7. Isograph Fragments for Knock Requests (Moderate)

**File**: `apps/desks/entrypoints/KnockRequestFragments.ts`

**Purpose**: Define Isograph fragments for knock request data

**Technical Specifications**:

- Create fragments for knock request data
- Implement mutations for request CRUD operations
- Set up subscriptions for real-time updates
- Integrate with existing participant fragments

**Isograph Implementation**:

```typescript
// KnockRequestFragments.ts
export const KnockRequestFragment = isograph`
  fragment KnockRequestFragment on KnockRequest {
    id
    fromParticipant {
      id
      person {
        id
        name
        avatarUrl
      }
    }
    toParticipant {
      id
      person {
        id
        name
        avatarUrl
      }
    }
    status
    message
    createdAt
    updatedAt
  }
`;

export const CreateKnockRequestMutation = isograph`
  mutation CreateKnockRequest($input: CreateKnockRequestInput!) {
    createKnockRequest(input: $input) {
      knockRequest {
        ...KnockRequestFragment
      }
    }
  }
`;
```

## Integration Points

### Participant Status Integration

- **State Flow**: Knock requests affect participant status indicators
- **UI Updates**: Video grid highlights active conversations
- **Permission Logic**: Status changes trigger audio/video permission updates

### Notification System Integration

- **Toast Notifications**: Use BfDsToast for non-intrusive notifications
- **Sound Alerts**: Optional audio cues for incoming requests
- **Badge Indicators**: Show pending request counts on participant tiles

### Video Component Integration

- **Connection Points**: Audio tracks enabled/disabled based on active
  conversations
- **Layout Changes**: Video tiles reflect conversation groupings
- **Visual Feedback**: Status indicators show who is in conversation with whom

### Mobile-Specific Considerations

- **Touch Optimization**: All elements properly sized for touch interaction
- **Audio Control**: Clear indicators for audio state changes
- **Permission Requests**: Graceful handling of iOS permission dialogs
- **Orientation Awareness**: Proper layout in landscape mode

## Testing Strategy

### Unit Tests

- Test knock request model creation and state transitions
- Verify notification component rendering
- Test permission handler logic with mock participants
- Validate Isograph fragments and mutations

### Integration Tests

- Test end-to-end request flow from initiation to acceptance
- Verify audio track enabling/disabling
- Test notification delivery and UI updates
- Validate error handling in request flows

### User Experience Tests

- Test notification visibility and clarity
- Validate touch interaction on iPad devices
- Test audio feedback for request events
- Measure response time for request actions

### Edge Case Testing

- Multiple simultaneous requests
- Request cancellation mid-flow
- Network interruptions during request negotiation
- Browser permission denial scenarios

## Technical Risks & Mitigation

### Browser Permission Management

- **Risk**: Audio permission requests may be blocked by browsers
- **Mitigation**: Clear permission request UI with fallback options
- **Testing**: Test across different permission states and browsers

### Notification Reliability

- **Risk**: Request notifications may be missed by users
- **Mitigation**: Multiple notification channels (visual, optional audio)
- **Testing**: Verify notification delivery under various conditions

### Conversation State Management

- **Risk**: Complex state transitions may lead to inconsistent UI
- **Mitigation**: Robust state machine with clear transitions
- **Testing**: Test all possible state combinations and transitions

### Network Resilience

- **Risk**: Request management during intermittent connectivity
- **Mitigation**: Offline status handling and request queueing
- **Testing**: Validate behavior under network interruptions

## Browser Compatibility

- **Primary Target**: Safari for iPad (iOS 14+)
- **Secondary Targets**: Chrome for iPadOS, Firefox for iPadOS
- **Testing Plan**:
  - Safari on iPad Pro and iPad Air
  - Chrome on iPad with various iOS/iPadOS versions
  - Test with and without other peripherals connected

## Appendix: Technical Specifications

### State Machine for Knock Requests

```
Request States:
1. INITIAL: Request being composed
2. PENDING: Request sent, awaiting response
3. ACCEPTED: Request accepted, conversation starting
4. DECLINED: Request declined, no conversation
5. CANCELED: Request canceled by sender
6. EXPIRED: Request timed out without response

State Transitions:
INITIAL → PENDING: User sends request
PENDING → ACCEPTED: Recipient accepts
PENDING → DECLINED: Recipient declines
PENDING → CANCELED: Sender cancels
PENDING → EXPIRED: Request timeout period elapsed
```

### Data Flow Diagram

```
Participant A → KnockRequestButton → Isograph Mutation → GraphQL API
                                                      ↓
                                            Database (KnockRequest)
                                                      ↓
Participant B ← KnockRequestNotification ← Isograph Subscription
                       ↓
                  User Action
                       ↓
               Isograph Mutation
                       ↓
             Audio Permission Update
                       ↓
          Video/Audio Stream Connection
```

### Security Considerations

- Validate all request permissions at the database level
- Ensure participants can only see and interact with requests relevant to them
- Include rate limiting for request creation to prevent spam
- Implement request expiration to clean up stale requests
- Log all request events for audit and debugging purposes

Remember: This implementation plan provides technical guidance without actual
implementation code. The focus is on the architecture, component relationships,
and integration points to guide the development of Phase 3.
