# Desks Application Implementation Plan

**Date**: 2025-06-23\
**Status**: Planning\
**Target**: internalbf

## Overview

Desks is an ambient virtual presence application for the internalbf team,
designed to recreate the feeling of working together in an office. Team members
can see who's available and tap someone on the shoulder for a quick chat.

## Core Concept

- **Platform**: Web app (with potential iOS app in future) optimized for iPad
- **Purpose**: Enable spontaneous, low-friction team interactions
- **Key Innovation**: Always-on muted video presence with tap-to-chat
  functionality

## Key Features

### 1. Presence Display

- Grid view of all team members who have the app open
- Each person's video feed is displayed (muted by default)
- Visual status indicators:
  - Available (green border/indicator)
  - Not available (red/gray indicator)
  - In conversation (yellow/different visual cue)

### 2. Status Management

- Simple toggle between "Available" and "Not Available"
- Status persists until manually changed
- No complex scheduling or calendar integration (for v1)

### 3. Tap-to-Chat

- Click/tap on any available team member to request a chat
- Sends notification to the tapped person
- Recipient can accept or decline the chat request
- If accepted, both users' audio unmutes and they enter conversation mode

### 4. Video Chat

- Powered by Daily.co integration
- Happens within the same interface (no external app launch)
- During conversations:
  - Audio is enabled for both participants
  - Video feeds might enlarge or get special treatment in UI
  - Other team members can still see both people (with "in conversation"
    indicator)

## Technical Architecture

### Frontend

- React-based web application using BfDs component library
- Isograph for routing and data fetching
- Real-time state management via GraphQL subscriptions
- WebRTC via Daily.co SDK

### Backend Requirements

- GraphQL schema integrated with internalbf
- User authentication (integrate with existing internalbf auth)
- Presence state management in internalbf database
- WebSocket or Server-Sent Events for real-time updates
- Notification system for tap requests

### Integration with InternalBF

- Lives within the internalbf application structure
- Uses same patterns as other internalbf tools (commits viewer, dashboard)
- Route: `/desks` in the internalbf routing system
- Leverages existing authentication/authorization

### Daily.co Integration

- Use Daily.co Prebuilt or custom UI with their API
- Handle room creation/destruction for conversations
- Manage participant permissions (mute/unmute controls)
- Store Daily.co room IDs in GraphQL/database

## User Flow

1. **Entry**: Team member opens Desks on their iPad via internalbf
2. **Setup**: Grants camera permissions, appears in grid
3. **Idle State**: Video streams (muted), shows as "Available"
4. **Initiate Chat**: Taps on available colleague
5. **Receive Request**: Colleague gets notification
6. **Accept/Decline**: If accepted, both unmute and chat begins
7. **End Chat**: Either party can end, returning to muted state

## MVP Scope

- Grid view with live video feeds
- Available/Not Available toggle
- Tap-to-request chat
- Accept/decline flow
- Daily.co powered conversations
- Integration with internalbf authentication
- BfDs UI components

## Implementation Phases

### Phase 1: Proof of Concept

- Basic React component using BfDs
- Integrate into internalbf routing
- Hardcoded user list
- Simple grid layout
- Test video quality and performance on iPad

### Phase 2: Core Features

- GraphQL schema for desks data
- Real-time presence system
- Tap-to-chat flow
- Notification system

### Phase 3: Polish & Deploy

- UI/UX refinements using BfDs patterns
- Performance optimization
- Error handling
- Deploy as part of internalbf

## Open Questions

1. **Privacy**: Should we add "Do Not Disturb" beyond just "Not Available"?
2. **Persistence**: How long should the app keep someone "online" if they
   navigate away?
3. **Mobile**: Should we support phones, or iPad-only for v1?
4. **Recordings**: Should conversations be recordable?
5. **Group Chats**: Should we support multi-person conversations?

## Next Steps

1. Review plan with team
2. Create Daily.co integration spike
3. Begin Phase 1 implementation within internalbf structure
