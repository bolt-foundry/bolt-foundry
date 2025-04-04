# Desks: Phase 2 Implementation Plan - Video Connection with Isograph Integration

## Reasoning First

This phase is the core technical foundation of the Desks application,
establishing the video connection capabilities with proper default audio/video
states. We're focusing on implementing the video functionality integrated with
our Isograph data layer to ensure proper state management for persistent video
spaces.

The primary challenge is creating a seamless video experience optimized for iPad
landscape orientation while ensuring proper integration with our existing
Isograph architecture. This requires careful consideration of mobile bandwidth
optimization and state persistence.

## Technical Goal

Implement core video functionality with default audio/video states (video on,
audio off by default) using Isograph for state management and Daily.co for video
connections.

## Dependencies

- Phase 1 (Foundation) - Basic route structure and layout in place

## Components

### 1. Directory Structure Setup (Simple)

- Create necessary directory structure:
  - `apps/desks/components/` - For reusable UI components
  - `apps/desks/entrypoints/` - For Isograph entrypoints
  - `apps/desks/bfdb/` - For database models

### 2. Video Connection Component (Challenging)

**File**: `apps/desks/components/VideoConnection.tsx`

**Purpose**: Manages the connection to the Daily.co API and handles video/audio
streams

**Technical Specifications**:

- Interface with Daily.co SDK for video connections
- Implement default state management (video on, audio off)
- Handle reconnection scenarios for mobile networks
- Optimize for iPad bandwidth and display capabilities
- Integrate with Isograph fragments for state persistence

**Component API**:

```typescript
interface VideoConnectionProps {
  roomName: string;
  participantId: string;
  defaultVideoEnabled: boolean;
  defaultAudioEnabled: boolean;
  onParticipantJoined: (participant: Participant) => void;
  onParticipantLeft: (participant: Participant) => void;
  onConnectionStateChange: (state: ConnectionState) => void;
}
```

### 3. Video Grid Layout (Moderate)

**File**: `apps/desks/components/VideoGrid.tsx`

**Purpose**: Arranges video feeds in an optimal grid for iPad landscape
orientation

**Technical Specifications**:

- Implement responsive grid layout optimized for iPad landscape dimensions
- Support dynamic participant counts with graceful layout adjustments
- Handle different participant video states (on/off/loading)
- Optimize touch targets for iPad interaction

**Component API**:

```typescript
interface VideoGridProps {
  participants: Participant[];
  localParticipantId: string;
  onParticipantSelect: (participantId: string) => void;
}

interface Participant {
  id: string;
  name: string;
  videoEnabled: boolean;
  audioEnabled: boolean;
  isLocal: boolean;
  videoTrack?: MediaStreamTrack;
}
```

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

### 5. Isograph Entrypoint and Fragments (Challenging)

**File**: `apps/desks/entrypoints/EntrypointDesks.ts`

**Purpose**: Define Isograph entrypoint and fragments for Desks application

**Technical Specifications**:

- Create main entrypoint for the Desks application
- Define fragments for desk participant data
- Implement mutations for status updates
- Connect with existing Isograph architecture

**Isograph Implementation**:

```typescript
// EntrypointDesks.ts
export const EntrypointDesks = isograph`
  entrypoint {
    desk {
      id
      name
      participants {
        ...DeskParticipantFragment
      }
    }
  }
`;

// DeskParticipant.ts
export const DeskParticipantFragment = isograph`
  fragment DeskParticipantFragment on DeskParticipant {
    id
    person {
      id
      name
      avatarUrl
    }
    videoEnabled
    audioEnabled
    status
    joinedAt
  }
`;
```

### 6. Database Models (Moderate)

**File**: `apps/desks/bfdb/DeskParticipant.ts`

**Purpose**: Define database models for storing desk and participant data

**Technical Specifications**:

- Create BfNode classes for Desk, DeskParticipant, and DeskSettings
- Implement methods for fetching and updating participant status
- Integrate with existing database architecture
- Ensure proper persistence of participant preferences

**Model Implementation**:

```typescript
// Basic structure, not actual implementation code
class DeskParticipant extends BfNodeBase {
  static readonly TYPE = "DeskParticipant";

  // Node properties and methods
  static async createDeskParticipant(
    context: GraphQLContext,
    personId: string,
    deskId: string,
    videoEnabled: boolean = true,
    audioEnabled: boolean = false,
  ): Promise<DeskParticipant> {
    // Implementation details
  }

  async updateStatus(
    context: GraphQLContext,
    status: ParticipantStatus,
  ): Promise<void> {
    // Implementation details
  }
}
```

### 7. Audio/Video Default Settings Controller (Moderate)

**File**: `apps/desks/components/MediaSettingsController.tsx`

**Purpose**: Manage default media settings and provide controls for users

**Technical Specifications**:

- Implement toggle controls for audio/video
- Store user preferences with Isograph integration
- Optimize touch controls for iPad usage
- Handle device permissions gracefully

**Component API**:

```typescript
interface MediaSettingsControllerProps {
  initialVideoEnabled: boolean;
  initialAudioEnabled: boolean;
  onVideoToggle: (enabled: boolean) => void;
  onAudioToggle: (enabled: boolean) => void;
}
```

## Integration Points

### Daily.co API Integration

- **Connection Mechanism**: Establish video room connection using Daily.co
  JavaScript SDK
- **Permission Management**: Handle camera and microphone permissions with
  appropriate UI
- **Mobile Optimization**: Implement bandwidth usage optimization for iPad
- **Event Handling**: Setup event listeners for participant changes and
  connection events

### Isograph Data Layer Integration

- **State Management**: Track participant presence and settings via Isograph
- **Query Structure**: Define fragments for efficient component data fetching
- **Mutation Handlers**: Implement mutations for video/audio settings updates
- **Caching Strategy**: Utilize Isograph caching for optimal performance

### BfDs Component Integration

- **UI Components**: Utilize existing BfDs design system with iPad-specific
  adjustments
- **Status Indicators**: Use BfDsPillStatus for participant availability
  indicators
- **Touch Controls**: Optimize BfDs components for touch interactions
- **Layout Adjustments**: Ensure components render properly in iPad landscape
  orientation

## Testing Strategy

### Unit Tests

- Test video connection component with mocked Daily.co API
- Verify default video-on, audio-off state on join
- Test Isograph fragment data flow
- Validate media settings controller logic

### Integration Tests

- Test connection between Isograph and video components
- Verify data persistence across page refreshes
- Test reconnection behavior on network disruptions

### iPad-Specific Tests

- Test layout rendering on iPad Safari browser in landscape mode
- Verify touch interaction with video controls
- Test bandwidth adaptation in various network conditions
- Measure performance impact on iPad battery life

### Cross-Browser Testing

- Primary focus: Safari for iPadOS 14+
- Secondary: Chrome for iPadOS
- Validate graceful degradation for unsupported browsers

## Technical Risks & Mitigation

### Daily.co API Limitations

- **Risk**: API rate limits or feature constraints
- **Mitigation**: Create abstraction layer for potential provider changes
- **Testing**: Validate all critical API calls with error handling

### Mobile Performance

- **Risk**: Video processing may impact iPad battery life and performance
- **Mitigation**: Implement adaptive video quality and power-saving features
- **Testing**: Benchmark performance on target iPad models

### Video Connection Reliability

- **Risk**: Unstable connections in mobile environments
- **Mitigation**: Implement robust reconnection logic and offline state
  management
- **Testing**: Test connection recovery under various network conditions

### Permission Handling

- **Risk**: Camera/microphone permission issues on iPad browsers
- **Mitigation**: Clear UI for permission requests and error states
- **Testing**: Verify behavior with various permission scenarios

## Browser Compatibility Strategy

- **Primary Focus**: Safari for iOS/iPadOS (version 14+)
- **Secondary Support**: Chrome for iPadOS
- **Testing Matrix**:
  - Safari iOS/iPadOS 14+
  - Chrome for iPadOS
  - Firefox for iPadOS (lower priority)
- **Implementation Approach**:
  - Use feature detection instead of browser detection
  - Implement graceful degradation for unsupported features
  - Test on actual iPad devices to ensure proper functionality

## Appendix: Technical Specifications

### Data Flow Diagram

```
User Interaction → MediaSettingsController → Isograph Mutation
                                          ↓
Daily.co SDK ← VideoConnection ← Isograph Fragment ← GraphQL
      ↓
Video Grid Layout → User Display
```

### State Machine Definition

```
Connection States:
1. DISCONNECTED: Initial state or disconnected
2. CONNECTING: Attempting to connect to room
3. CONNECTED: Successfully connected to room
4. RECONNECTING: Lost connection, attempting to reconnect
5. FAILED: Connection failed, cannot reconnect

Video/Audio States:
1. VIDEO_ON_AUDIO_OFF: Default state
2. VIDEO_ON_AUDIO_ON: User enabled audio
3. VIDEO_OFF_AUDIO_OFF: User disabled video
4. VIDEO_OFF_AUDIO_ON: Video off but audio enabled
```

Remember: This implementation plan provides technical guidance without actual
implementation code. The focus is on the architecture, component relationships,
and integration points to guide the development of Phase 2.
