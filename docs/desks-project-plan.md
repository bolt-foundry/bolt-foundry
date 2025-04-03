# Desks: Persistent Video Conferencing App

## Start With the User (Not Your Code)

### User Goals

- Join persistent conference spaces with colleagues (video on, audio off by
  default)
- See all participants in the conference space
- Request direct conversations with specific participants via "knock" feature
- Receive and respond to conversation requests from others

### User Journeys

1. **Starting Work Day**: A team member joins the persistent space, sees
   colleagues with video on but audio off, and can focus on work while
   maintaining visual presence.
2. **Initiating Conversation**: User taps on a colleague to "knock on their
   door" and waits for permission to speak.
3. **Responding to Requests**: User receives notification when someone wants to
   talk, can see who is waiting, and accepts or declines the request.

## Define Problems (Not Solutions)

### Current State

- Traditional video calls require scheduling or sending links for each
  conversation
- Audio disruption when many participants join a single call
- No elegant way to request private conversation within a group setting
- Lack of persistent "shared space" feeling in remote work

### Desired State

- Persistent video spaces that simulate "being in the same room"
- Visual presence without audio disruption by default
- Simple, intuitive permission-based conversation initiation
- Sense of connection with teammates throughout workday

## Scope It, Test It, Ship It

### Minimum Lovable Product (MLP)

- **Core Features**:
  - Persistent video room powered by Daily.co
  - Default video-on, audio-off state for all participants
  - User list with online status
  - Tap-to-request conversation feature
  - Notification and accept/decline UI for requests

### Out of Scope (for initial release)

- Screen sharing capabilities
- Recording functionality
- Multiple rooms or spaces
- Custom room appearance/branding
- Mobile app (web-first approach)

### Success Metrics

- **User Adoption**: % of team members who join daily
- **Engagement**: Average time spent connected to space
- **Conversation Initiation**: Number of "knocks" sent and accepted
- **User Satisfaction**: Survey feedback on connection and team awareness

## Implementation Phases

### Phase 1: Foundation (Simple)

- Set up Deno project structure using existing infrastructure
- Create new route in `apps/internalbf/routes`
- Use Replit's private deployment infrastructure for authentication
- Daily.co API integration for video connection
- Build minimal UI layout with participant grid using BfDs components

### Phase 2: Core Functionality (Moderate)

- Implement default state (video on, audio off)
- Create participant list with status indicators using BfDsPill and
  BfDsPillStatus
- Build room persistence with GraphQL integration
- Add new model in `apps/bfDb/models`
- Write tests for connection states and video/audio defaults

### Phase 3: "Door Knock" Feature (Challenging)

- Develop request notification system using BfDsToast
- Create UI for sending/receiving requests with BfDsModal
- Implement audio/video permissions management
- Add GraphQL mutations for notification delivery
- Test notification delivery and permission changes

### Phase 4: Testing & Refinement (Simple)

- Internal team testing for user experience
- Gather feedback and implement critical fixes
- Performance optimization
- Verify behavior across different network conditions

### Phase 5: Ship It (Simple)

- Deploy to production environment using Replit's private deployment feature
- Configure private access for team members only
- Monitor for issues
- Gather initial user feedback
- Start planning iteration based on real-world usage

## Technical Stack

- **Frontend**: React with Isograph integration
- **Backend**: Deno (existing app infrastructure)
- **Video API**: Daily.co
- **Styling**: Existing BfDs design system
- **State Management**: React Context API + Hooks
- **API Layer**: GraphQL with existing schema extension
- **Deployment**: Replit

## Test Plan

Our tests define behavior, not implementation:

1. **Video Connection Test**:
   - Red: Write tests for user appearance with correct default settings
   - Green: Implement basic video connection
   - Refactor: Improve connection reliability

2. **"Knock" Feature Test**:
   - Red: Write tests for notification delivery and permission changes
   - Green: Implement basic notification system with BfDsToast
   - Refactor: Improve UX and response time

3. **Performance Test**:
   - Red: Write tests for system with 10+ simultaneous users
   - Green: Implement basic multi-user support
   - Refactor: Optimize for larger groups

4. **Cross-Browser Testing**:
   - Red: Write tests for functionality in major browsers
   - Green: Fix critical browser compatibility issues
   - Refactor: Standardize cross-browser behavior

## Risk Assessment

1. **Technical Risk**: Daily.co API limitations or changes
   - _Test First_: Build test suite for API dependencies
   - _Start Simple_: Begin with minimal API usage
   - _Iterate Quickly_: Adapt as we learn API constraints

2. **User Adoption Risk**: Users might find interface confusing
   - _Test First_: User testing with paper prototypes
   - _Start Simple_: Begin with minimal UI
   - _Iterate Quickly_: Refine based on user feedback

3. **Privacy Concerns**: Always-on video might make some users uncomfortable
   - _Test First_: Interview potential users about privacy concerns
   - _Start Simple_: Include basic privacy controls
   - _Iterate Quickly_: Add more granular controls as needed

4. **Performance Issues**: Video quality with many participants
   - _Test First_: Load testing with simulated connections
   - _Start Simple_: Optimize for small teams first
   - _Iterate Quickly_: Scale up as we solve performance challenges

Remember: Failure counts as done. This plan prioritizes building a simple but
effective solution focused on real user needs, testing at each step, and getting
working code into users' hands quickly rather than perfect code in development.
