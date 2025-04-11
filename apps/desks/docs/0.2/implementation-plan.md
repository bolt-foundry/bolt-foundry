# Desks: Implementation Plan - Version 0.2

**Version:** 0.2 **Date:** 2023-09-15

## Version Summary

This implementation phase focuses on establishing the core data models and UI
components for desk-based video collaboration. It builds the foundation for
persistent video spaces where team members can maintain ambient presence.

## Changes From Previous Version

This version builds upon the initial research and design phase (0.1) by
implementing the core data models and UI components.

## Technical Goals

- Create database models for desks and participants
- Build UI components for participant video display
- Implement initial participant status management
- Create GraphQL schema extensions for desk-related operations

## Components and Implementation

### 1. Database Models (Moderate)

**File**: `apps/desks/bfdb/DeskModels.ts`

**Purpose**: Define database models for storing desk and participant data

**Technical Specifications**:

- Create BfNode class for Desk and DeskParticipant
- Implement methods for creating, joining, and leaving desks
- Add participant status management (available, busy, etc.)
- Add methods for updating desk settings

**Model Implementation Structure**:

```typescript
class Desk extends BfNodeBase {
  static readonly TYPE = "Desk";

  name: string;
  createdBy: string; // Person ID
  settings: DeskSettings;

  static async createDesk(context: GraphQLContext, params): Promise<Desk> {
    // Implementation
  }

  async addParticipant(
    context: GraphQLContext,
    personId: string,
  ): Promise<DeskParticipant> {
    // Implementation
  }
}

class DeskParticipant extends BfNodeBase {
  static readonly TYPE = "DeskParticipant";

  deskId: string;
  personId: string;
  status: ParticipantStatus;
  videoEnabled: boolean;
  audioEnabled: boolean;

  async updateStatus(
    context: GraphQLContext,
    status: ParticipantStatus,
  ): Promise<void> {
    // Implementation
  }
}
```

### 2. Video Component Base (Challenging)

**File**: `apps/desks/components/DeskVideo.tsx`

**Purpose**: Create the core video streaming component for desk participants

**Technical Specifications**:

- Build WebRTC-based video streaming component
- Implement video mute/unmute controls
- Create participant status indicator
- Add visual cues for speaking participants

**Component Features**:

- Video grid layout with adaptive sizing
- Audio level visualization
- Status badge (Available, Busy, Away, Do Not Disturb)
- Controls for camera and microphone toggle

### 3. Desk Management UI (Moderate)

**File**: `apps/desks/components/DeskManager.tsx`

**Purpose**: Create the UI for managing desk participation

**Technical Specifications**:

- Build desk creation interface
- Implement participant list display
- Create status management controls
- Add desk settings configuration panel

**UI Components**:

- Create desk form
- Participant list with status indicators
- Settings panel for video/audio defaults
- Status selector dropdown

### 4. Isograph Schema Extensions (Challenging)

**File**: `apps/graphql/types/graphqlDesks.ts`

**Purpose**: Extend GraphQL schema with Desks-specific types and queries

**Technical Specifications**:

- Define GraphQL types for Desk, DeskParticipant, and DeskSettings
- Create queries for fetching desk data and participant information
- Define mutations for updating participant settings
- Integrate with existing GraphQL schema

**Schema Extensions**:

```graphql
type Desk {
  id: ID!
  name: String!
  participants: [DeskParticipant!]!
  createdAt: DateTime!
}

type DeskParticipant {
  id: ID!
  person: BfPerson!
  videoEnabled: Boolean!
  audioEnabled: Boolean!
  status: ParticipantStatus!
  joinedAt: DateTime!
}

enum ParticipantStatus {
  AVAILABLE
  BUSY
  AWAY
  DO_NOT_DISTURB
}
```

## Integration Points

- Interface with the BfPerson model for participant identity
- Connect with WebRTC signaling for video communication
- Integrate with existing GraphQL schema for API exposure

## Testing Strategy

- Unit tests for database models
- Component tests for UI elements
- Integration tests for GraphQL schema
- End-to-end tests for desk creation and joining flow
