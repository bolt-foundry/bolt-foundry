# Desks: Persistent Video Conferencing App for iPad

## Start With the User (Not Your Code)

### User Goals

- Join persistent conference spaces with colleagues on iPad (video on, audio off
  by default)
- See all participants in the conference space on a dedicated iPad screen
- Request direct conversations with specific participants via "knock" feature
- Receive and respond to conversation requests from others
- Maintain ambient presence while working on other devices

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
  - Persistent video room powered by Daily.co optimized for iPad
  - Default video-on, audio-off state for all participants
  - User list with online status
  - Touch-optimized tap-to-request conversation feature
  - iPad-friendly notification and accept/decline UI for requests
  - Design optimized for iPad landscape orientation

### Out of Scope (for initial release)

- Screen sharing capabilities
- Recording functionality
- Multiple rooms or spaces
- Custom room appearance/branding
- Native iOS app (web app approach for iPad)
- Phone-sized mobile support (iPad-focused)

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
- Build minimal UI layout with iPad-optimized participant grid using BfDs
  components
- Implement responsive design for iPad screen dimensions and orientations

### Phase 2: Core Functionality (Moderate)

- Implement default state (video on, audio off)
- Create touch-friendly participant list with status indicators using BfDsPill
  and BfDsPillStatus
- Build room persistence with GraphQL integration
- Add new model in `apps/bfDb/models`
- Write tests for connection states and video/audio defaults
- Test and optimize for iPad Safari browser

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
- **Styling**: Existing BfDs design system with iPad landscape-specific
  adjustments
- **State Management**: React Context API + Hooks
- **API Layer**: GraphQL with existing schema extension
- **Deployment**: Replit
- **Target Platform**: iPad web browsers (primarily Safari) in landscape
  orientation
- **Responsive Framework**: Custom media queries for iPad landscape dimensions

## Test Plan

Our tests define behavior, not implementation:

1. **Video Connection Test**:
   - Red: Write tests for user appearance with correct default settings on iPad
   - Green: Implement basic video connection optimized for iPad
   - Refactor: Improve connection reliability and bandwidth management

2. **"Knock" Feature Test**:
   - Red: Write tests for notification delivery and permission changes
   - Green: Implement touch-friendly notification system with BfDsToast
   - Refactor: Improve UX and response time for iPad touchscreen

3. **iPad-Specific Tests**:
   - Red: Write tests for layout in landscape orientation
   - Green: Implement design optimized for iPad landscape
   - Refactor: Optimize touch targets and interactions for iPad landscape usage

4. **Performance Test**:
   - Red: Write tests for system with 10+ simultaneous users
   - Green: Implement basic multi-user support
   - Refactor: Optimize for larger groups

5. **Cross-Browser Testing**:
   - Red: Write tests for functionality in major browsers
   - Green: Fix critical browser compatibility issues
   - Refactor: Standardize cross-browser behavior

## Risk Assessment

1. **Technical Risk**: Daily.co API limitations or changes
   - _Test First_: Build test suite for API dependencies on iPad Safari
   - _Start Simple_: Begin with minimal API usage optimized for mobile bandwidth
   - _Iterate Quickly_: Adapt as we learn API constraints on iPad

2. **User Adoption Risk**: Users might find iPad interface confusing
   - _Test First_: User testing with iPad prototypes
   - _Start Simple_: Begin with minimal touch-friendly UI
   - _Iterate Quickly_: Refine based on iPad user feedback

3. **Privacy Concerns**: Always-on video might make some users uncomfortable
   - _Test First_: Interview potential iPad users about privacy concerns
   - _Start Simple_: Include basic privacy controls with easy touch access
   - _Iterate Quickly_: Add more granular controls as needed

4. **Performance Issues**: Video quality with many participants on iPad
   - _Test First_: Load testing with simulated connections on iPad
   - _Start Simple_: Optimize for small teams first
   - _Iterate Quickly_: Scale up as we solve iPad-specific performance
     challenges

5. **iPad-Specific Risks**: Battery life and heat generation during extended
   video calls
   - _Test First_: Measure battery drain during extended usage
   - _Start Simple_: Implement power-saving features
   - _Iterate Quickly_: Optimize video processing for iPad efficiency

Remember: Failure counts as done. This plan prioritizes building a simple but
effective solution focused on real user needs, testing at each step, and getting
working code into users' hands quickly rather than perfect code in development.
