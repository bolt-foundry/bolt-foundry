# Desks: Implementation Plan

## Reasoning First

### Why This Project Matters

Remote teams currently lack a persistent, ambient presence solution that
simulates "being in the same room." Current video conferencing tools require
scheduled meetings or sharing links for each conversation, causing friction in
collaboration. People working remotely miss the spontaneous interactions that
happen naturally in an office environment.

The Desks project solves this by creating persistent video spaces where team
members can maintain visual presence without audio disruption, simulating a
shared office environment. This increases team connection, reduces isolation,
and enables more natural conversation initiation with a permission-based "knock"
system. The primary target platform is iPad, offering an optimal form factor for
maintaining an ambient video presence while working on other devices.

### Core Problems to Solve

1. **Disconnection**: Remote team members feel isolated without visual cues of
   colleagues working nearby
2. **Meeting Friction**: Starting conversations requires scheduling or sending
   links for each interaction
3. **Audio Disruption**: Traditional video calls create noise when many
   participants join
4. **Conversation Initiation**: No elegant way to request private conversation
   within a group setting
5. **Presence Awareness**: Difficulty knowing who's available for collaboration
   at any moment

## Conceptual Design

The solution will be built on our existing Deno infrastructure, utilizing
Daily.co for video connections. The application will feature a persistent video
space where participants join with video on but audio off by default, a
participant list with status indicators, and a "knock" feature for requesting
conversations. The application is specifically designed as a web app optimized
for iPad usage.

### Architecture Overview

1. **Frontend**: React with BfDs components for UI consistency, with
   iPad-optimized layout and touch interactions
2. **Backend**: Existing GraphQL schema with new API endpoints
3. **Video API**: Daily.co integration for video/audio management optimized for
   mobile bandwidth
4. **State Management**: isograph
5. **Deployment**: Replit's private deployment infrastructure
6. **auth**: private deployments
7. **Responsive Design**: iPad-first approach with support for landscape
   orientations

## Implementation Phases

### Phase 1: Foundation (Simple)

**Technical Goal**: Establish project infrastructure and basic layout

**Dependencies**: None (initial phase)

**Components**:

- New route in `apps/internalbf/routes` for the Desks application
- Basic page layout with BfDs components optimized for iPad
- Configuration for deployment settings

**Integration Points**:

- Route registration with existing app router

**Testing Strategy**:

- Verify route registration and navigation
- Validate basic iPad layout rendering in landscape orientation
- Test touch interactions specific to iPad landscape usage

### Phase 2: Video Connection with Isograph Integration (Challenging)

**Technical Goal**: Implement core video functionality with default audio/video
states using Isograph

**Dependencies**: Phase 1 (Foundation)

**Components**:

- Create new directory structure at `apps/desks/components`
- Daily.co SDK integration in new `apps/desks/components/VideoConnection.tsx`
- Video grid layout component in `apps/desks/components/VideoGrid.tsx`
- Isograph entrypoint and fragment definitions in
  `apps/desks/entrypoints/EntrypointDesks.ts`
- GraphQL schema extensions for Desks in `apps/graphql/types/graphqlDesks.ts`
- Audio/video default settings controller integrated with Isograph

**File Naming Conventions**:

- Following project standards for lexically sortable naming (base class or
  interface name first)
- Main module files named after parent directories
- Direct imports used instead of barrel files (index.ts)
- Root-relative import paths

**Integration Points**:

- Daily.co API for video connections optimized for iPad
- Isograph fragments for managing connection state
- Integration with user preferences for persistent settings for iPad users

**Testing Strategy**:

- Test default video-on, audio-off state on join
- Verify reconnection behavior on network issues
- Test permission handling and state changes
- Validate video grid layout with multiple participants

### Phase 3: Participant Management (Moderate)

**Technical Goal**: Create participant presence system with status indicators

**Dependencies**: Phase 2 (Video Connection)

**Components**:

- Participant list UI in `apps/desks/components/ParticipantList.tsx`
- Status selector component in `apps/desks/components/StatusSelector.tsx`
- GraphQL schema extensions for status updates
- Status persistence implementation

**Integration Points**:

- Isograph entrypoints and mutations for status updates
- Connection with Daily.co participant events
- Integration with existing user profiles through Isograph fragments

**Testing Strategy**:

- Verify correct status display and updates
- Test status persistence across page refreshes
- Validate status update propagation to other participants
- Test participant list UI with varying numbers of users

### Phase 4: "Knock" Feature (Challenging)

**Technical Goal**: Implement conversation request system with notifications

**Dependencies**: Phase 3 (Participant Management)

**Components**:

- Knock request component in `apps/desks/components/KnockRequest.tsx`
- Notification handler in `apps/desks/components/NotificationHandler.tsx`
- Accept/decline interaction modal
- Isograph mutations for request management

**Integration Points**:

- BfDsToast component for notifications
- BfDsModal for accept/decline interactions
- Daily.co permissions API for audio enabling

**Testing Strategy**:

- Test notification delivery and display
- Verify permission changes on request acceptance
- Test multiple simultaneous requests
- Validate request cancellation and timeout handling

### Phase 5: Polish and Testing (Simple)

**Technical Goal**: Refine user experience and ensure cross-browser
compatibility

**Dependencies**: Phase 4 ("Knock" Feature)

**Components**:

- Landscape-optimized design improvements
- Loading state components
- Performance optimizations
- Cross-browser compatibility fixes

**Integration Points**:

- BfDs design system for consistent UI elements
- Performance monitoring integration

**Testing Strategy**:

- Test on multiple browsers with iPad in landscape orientation
- Performance testing with many participants
- User acceptance testing with team members
- Validate loading states and error handling

**Browser Compatibility Strategy**:

- Primary focus on Safari for iOS/iPadOS (version 14+)
- Secondary support for Chrome on iPadOS
- Testing matrix to include:
  - Safari iOS/iPadOS 14+
  - Chrome for iPadOS
  - Firefox for iPadOS (lower priority)
- Use feature detection instead of browser detection
- Implement graceful degradation for unsupported features

## Data Architecture

### State Management

- **Unified State Management**: Isograph exclusively for managing both local and
  remote state through GraphQL
- **Ephemeral UI State**: Use Isograph fragments for all UI state, including
  transient elements
- **State Design Pattern**: iPad-optimized state management with Isograph
  entrypoints for data fetching and mutations, fragments for component-level
  data access
- **State Synchronization**: Automatic state reconciliation through Isograph
  store
- **Caching Strategy**: Leveraging Isograph's built-in caching with appropriate
  invalidation policies optimized for iPad performance

### Logging and Debugging

- **Structured Logging**: Use logger methods with appropriate levels
  (logger.info, logger.debug) instead of console.log
- **Debug Information**: Pass values as trailing arguments to logger functions
  rather than using string concatenation
- **Error Handling**: Implement proper error handling with specific error types

### Database Schema Changes

- New BfNode classes extending the graph database for:
  - `DeskParticipant` nodes storing participant status data
  - `DeskPreference` nodes for user video settings on iPad
  - `DeskKnockRequest` nodes for conversation requests and history
- BfEdge relationships connecting:
  - Users to their participant status nodes
  - Users to their preference nodes
  - Participants to knock request nodes
- Schema will leverage the existing graph database pattern with `BfNode` and
  `BfEdge` classes
- All model definitions will be placed in `apps/desks/bfdb/` directory following
  project standards
- All GraphQL type definitions will be placed in `apps/desks/graphql/` directory
  following project standards

### Data Validation

- Input validation for status updates and knock requests
- Throttling mechanisms for frequent status changes
- Permission validation for conversation requests

## Security and Privacy Considerations

### Data Security

- **Video Stream Encryption**: Implement end-to-end encryption for all video
  streams
- **Authentication**: Utilize existing authentication infrastructure with
  session validation
- **Permission Model**: Implement role-based access control for desk spaces
- **Data Retention**: Define clear policies for temporary vs. persistent data

### User Privacy

- **Visual Indicators**: Provide clear visual indicators when video is active
- **Camera Controls**: Implement easy-to-access camera toggle controls
- **Privacy Settings**: Allow users to configure default privacy preferences
- **Compliance**: Ensure GDPR and other privacy regulation compliance

## Technical Risks & Mitigation

### Development Standards

- **Component Organization**:
  - All Desks-specific components will be placed in `apps/desks/components/`
  - Shared reusable components within the Desks app in
    `apps/desks/components/shared/`
  - Page-level components in `apps/desks/`
- **Testing Structure**: Test files will be placed in `__tests__` directories
  within the modules they are testing
- **Example Files**: Any example implementations will be placed in
  `__examples__` directories
- **Code Quality**: Following project standards for typed interfaces, error
  handling, and logger usage instead of console.log
- **iPad Testing**: Regular testing on iPad devices to ensure optimal
  performance and usability

### Video Connection Issues

- **Risk**: Daily.co API limitations or changes
- **Mitigation**: Create abstraction layer between our application and the
  Daily.co API to facilitate future provider changes if needed

### User Experience Concerns

- **Risk**: Users may find the always-on video uncomfortable
- **Mitigation**: Provide clear privacy controls and camera toggle options
- **UX Focus**: Conduct early user testing to refine privacy features

### Notification Reliability

- **Risk**: Missed conversation requests if user is away
- **Mitigation**: Implement persistent notifications and history
- **Recovery**: Allow for viewing missed requests when returning to desk

### iPad Performance Optimization

- **Risk**: Extended video usage may impact iPad battery life and performance
- **Mitigation**:
  - Implement adaptive video quality based on network conditions
  - Optimize render cycles for iPad hardware
  - Use efficient video encoding specific to iPad hardware capabilities
  - Implement power-saving mode when app is in background
- **Testing**: Create performance benchmarks specifically for iPad models
