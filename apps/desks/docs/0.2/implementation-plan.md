
# Desks Implementation Plan - Version 0.2

**Version:** 0.2 **Date:** 2023-08-15

## Version Summary

This version builds upon the foundation established in Version 0.1, focusing on enhancing the Desks feature with improved user experience, extended GraphQL schema, and additional functionality.

## Changes From Previous Version

Version 0.1 established the basic infrastructure for Desks. Version 0.2 enhances this with:

1. Extended GraphQL schema for Desks-specific operations
2. Improved UI components for desk management
3. Real-time presence indicators for desk participants

## Technical Goals

- Build out the GraphQL schema for Desks
- Implement real-time participant status updates
- Create UI components for desk management

## Components and Implementation

### 1. Database Models Enhancement (Simple)

**File**: `apps/desks/bfdb/DeskModels.ts`

**Purpose**: Extend existing database models for desk functionality

**Technical Specifications**:

- Add fields for participant status tracking
- Implement methods for status updates
- Add schema validation for new fields

### 2. UI Components for Desk Management (Moderate)

**File**: `apps/desks/components/DeskManagement.tsx`

**Purpose**: Create UI for managing desk participants and settings

**Technical Specifications**:

- Component for displaying current desk participants
- Interface for managing participant permissions
- Status indicators for participant presence

### 3. Real-time Status Updates (Challenging)

**File**: `apps/desks/components/StatusIndicator.tsx`

**Purpose**: Show real-time status of desk participants

**Technical Specifications**:

- Subscribe to status change events
- Visual indicators for different statuses (Available, Busy, Away, etc.)
- Automatic status updates based on user activity

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

- **GraphQL API**: Extend the existing schema with Desks-specific types
- **Database Layer**: Add new models and relationships for desk data
- **UI Components**: Create and integrate desk management components
- **Realtime Infrastructure**: Use existing websocket infrastructure for status updates

## Testing Strategy

### Unit Tests

- Test database model methods for participant management
- Verify GraphQL resolver functionality
- Test UI component rendering and interactions

### Integration Tests

- Test GraphQL queries and mutations through the API
- Verify real-time updates are properly propagated
- Test database operations with the enhanced schema

### End-to-End Tests

- Test the complete flow of desk creation and management
- Verify real-time status updates across different users
- Test permissions and access controls

## Risk Assessment

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Real-time update performance | Medium | Medium | Implement efficient update batching |
| GraphQL schema conflicts | Medium | Low | Thorough schema design reviews |
| UI performance with many participants | Medium | Medium | Implement pagination and lazy loading |

## Next Steps for Version 0.3

- Implement knock requests for desk access
- Add desk permission management
- Create desk templates for quick setup
- Add analytics for desk usage
