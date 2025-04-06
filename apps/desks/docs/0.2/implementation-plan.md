
# Desks Implementation Plan - Version 0.2

**Version:** 0.2

## Version Summary

This initial implementation establishes the foundation for the Desks
application, focusing on the basic infrastructure and minimal viable video
conferencing capability optimized for iPad.

## Technical Goals

- Set up project structure within the Bolt Foundry ecosystem
- Implement basic Daily.co API integration for video conferencing
- Create responsive UI layout optimized for iPad
- Configure persistence for video connection state
- Establish default video-on, audio-off behavior

## Components and Implementation

### 1. Project Structure (Simple)

**File**: `apps/desks/`

**Purpose**: Establish the core directory structure and configuration for the
project

**Technical Specifications**:

- Set up directory structure following Bolt Foundry standards
- Create necessary configuration files
- Implement basic routing for the application
- Document component patterns and guidelines

**Implementation Details**:

```typescript
// Directory structure
// apps/desks/
//   ├── components/  - React components
//   ├── bfdb/        - Database models
//   ├── graphql/     - GraphQL schema
//   └── docs/        - Project documentation
```

### 2. Daily.co API Integration (Moderate)

**File**: `apps/desks/components/VideoRoom.tsx`

**Purpose**: Integrate with Daily.co API for video conferencing capabilities

**Technical Specifications**:

- Create a wrapper component for Daily.co's video call interface
- Implement API client for Daily.co
- Configure default settings for video-on, audio-off
- Handle connection lifecycle events
- Optimize for iPad Safari browser

**Implementation Details**:

```typescript
// Key component functionality
interface VideoRoomProps {
  roomName: string;
  participantId: string;
  defaultVideoOn: boolean; // true by default
  defaultAudioOn: boolean; // false by default
}

// Component will handle:
// - Room creation/joining via Daily.co API
// - Default settings for audio/video
// - Connection state management
// - Error handling for network issues
```

### 3. Participant UI (Moderate)

**File**: `apps/desks/components/ParticipantGrid.tsx`

**Purpose**: Display video feeds of all participants in an iPad-optimized grid

**Technical Specifications**:

- Create responsive grid layout for participant videos
- Implement touch-friendly participant controls
- Design status indicators for participants
- Optimize layout for iPad landscape orientation
- Utilize BfDs components for consistent UI

**Implementation Details**:

```typescript
// Key components
// - ParticipantGrid: Container for all participants
// - ParticipantTile: Individual video tile with status
// - ParticipantControls: Touch controls for participant interaction

// Will utilize:
// - BfDsPill for participant names
// - BfDsPillStatus for availability indicators
// - BfDsTooltip for control hints
```

### 4. Database Models (Simple)

**File**: `apps/desks/bfdb/DeskParticipant.ts`

**Purpose**: Define data models for persistent desk spaces and participants

**Technical Specifications**:

- Implement DeskSpace model for persistent room data
- Create DeskParticipant model for user state
- Define relationships between models
- Implement methods for updating participant status

**Model Implementation**:

```typescript
// Basic structure (not actual implementation)
class DeskSpace extends BfNodeBase {
  static readonly TYPE = "DeskSpace";

  // Properties
  name: string;
  active: boolean;
  createdAt: Date;

  // Methods for space management
}

class DeskParticipant extends BfNodeBase {
  static readonly TYPE = "DeskParticipant";

  // Properties
  personId: string;
  spaceId: string;
  status: ParticipantStatus;
  videoEnabled: boolean;
  audioEnabled: boolean;
  lastActive: Date;

  // Methods for status updates
}

enum ParticipantStatus {
  AVAILABLE = "AVAILABLE",
  BUSY = "BUSY",
  AWAY = "AWAY",
  DO_NOT_DISTURB = "DO_NOT_DISTURB",
}
```

### 5. GraphQL Schema Extensions (Simple)

**File**: `apps/desks/graphql/DeskTypes.ts`

**Purpose**: Define GraphQL schema extensions for desk functionality

**Technical Specifications**:

- Define types for Desk and DeskParticipant
- Create queries for fetching desk data
- Implement mutations for updating participant state
- Define subscription for real-time updates

**Schema Implementation**:

```graphql
type DeskSpace {
  id: ID!
  name: String!
  participants: [DeskParticipant!]!
  createdAt: DateTime!
}

type DeskParticipant {
  id: ID!
  person: BfPerson!
  deskSpace: DeskSpace!
  status: ParticipantStatus!
  videoEnabled: Boolean!
  audioEnabled: Boolean!
  lastActive: DateTime!
}

enum ParticipantStatus {
  AVAILABLE
  BUSY
  AWAY
  DO_NOT_DISTURB
}

type Query {
  deskSpace(id: ID!): DeskSpace
  myCurrentDeskParticipant: DeskParticipant
}

type Mutation {
  updateParticipantStatus(
    participantId: ID!, 
    status: ParticipantStatus!
  ): DeskParticipant!
  
  updateMediaSettings(
    participantId: ID!,
    videoEnabled: Boolean,
    audioEnabled: Boolean
  ): DeskParticipant!
}

type Subscription {
  participantUpdated(deskSpaceId: ID!): DeskParticipant!
}
```

## Integration Points

- **BfDs Design System**: UI components will utilize the existing design system
- **GraphQL Integration**: Extend existing GraphQL schema with desk-specific
  types
- **BfDb Models**: New models will follow existing patterns in `apps/bfDb`
- **Authentication**: Leverage existing authentication from Bolt Foundry core

## Testing Strategy

1. **Video Connection Tests**:
   - Unit tests for connection management logic
   - Integration tests for Daily.co API interactions
   - Browser compatibility tests focusing on iPad Safari

2. **UI Tests**:
   - Component tests for responsive layout
   - Touch interaction tests for iPad
   - Visual regression tests for participant grid

3. **Data Model Tests**:
   - Unit tests for model methods
   - Integration tests for GraphQL resolvers
   - Performance tests for real-time updates

4. **End-to-End Tests**:
   - Multi-user connection scenario tests
   - Default audio/video state tests
   - Network disruption resilience tests

## Technical Risks & Mitigation

1. **Daily.co API Limitations**
   - Risk: API rate limits or feature constraints
   - Mitigation: Implement request throttling and fallback options
   - Testing: Load testing with simulated participants

2. **iPad Safari Compatibility**
   - Risk: WebRTC implementation differences in Safari
   - Mitigation: Targeted testing and browser-specific optimizations
   - Testing: Regular testing on actual iPad devices

3. **Performance with Multiple Participants**
   - Risk: Video quality degradation with many participants
   - Mitigation: Implement dynamic quality scaling
   - Testing: Performance testing with various participant counts

4. **Battery Usage on iPad**
   - Risk: High battery consumption during extended use
   - Mitigation: Implement power-saving optimizations
   - Testing: Battery consumption measurements during extended testing
