# ThanksBot: Discord Bot for Tracking Thank-You Messages

## Start With the User (Not Your Code)

ThanksBot provides a simple way for teams to acknowledge each other's
contributions and build a culture of gratitude. It captures thank-you messages
in Discord and stores them in a Notion database for later reference and
reporting.

## Current Features

- Recognition via "#thanks @user for [reason]" syntax
- Automatic storage in Notion database
- Friendly response confirmations
- Helpful format guidance

## Key User Scenarios

1. **Acknowledging Team Contributions**:
   - User types "#thanks @teammate for helping with the code review"
   - ThanksBot captures the message and stores in Notion
   - ThanksBot confirms the thank-you was recorded

2. **Format Guidance**:
   - User types "#thanks" without proper format
   - ThanksBot responds with format guidance
   - User can retry with correct format

## Implementation Phases

### Phase 0.1: Foundation (Simple)

- Set up Discord.js integration with message listening
- Implement Notion API integration for data storage
- Create message parsing and validation
- Implement friendly responses

### Phase 0.2: Enhanced Features (Moderate)

- Add reporting capabilities
- Implement statistics and leaderboards
- Create admin commands for customization
- Improve error handling and logging

### Phase 0.3: Advanced Integration (Challenging)

- Implement web dashboard for viewing thank-you history
- Add notification scheduling and summaries
- Create integration with other team tools
- Implement custom response templates
