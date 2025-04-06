# ThanksBot Implementation Plan - Version 0.1

**Version:** 0.1

## Version Summary

This initial implementation establishes the foundation for the ThanksBot
application, creating a Discord bot that listens for thank-you messages and
stores them in Notion. It includes the basic functionality needed for message
parsing, data storage, and user interactions.

## Technical Goals

- Set up Discord.js integration with message listening
- Implement Notion API integration for data storage
- Create message parsing and validation
- Implement friendly responses

## Components and Implementation

### 1. Discord Integration (Moderate)

**File**: `apps/thanksbot/thanksbot.ts`

**Purpose**: Set up Discord bot and handle messages

**Technical Specifications**:

- Initialize Discord client with appropriate permissions
- Set up message event listener
- Parse messages for "#thanks" mentions
- Respond to users with confirmation or format guidance

**Implementation Details**:

```typescript
// Set up Discord integration
async function setupDiscordBot(token: string) {
  // Set up Discord intents for reading message content
  const intents = new discord.IntentsBitField();
  intents.add(
    discord.IntentsBitField.Flags.Guilds,
    discord.IntentsBitField.Flags.GuildMessages,
    discord.IntentsBitField.Flags.MessageContent,
  );

  // Create Discord client
  const client = new discord.Client({ intents });

  client.once("ready", () => {
    logger.info(`We have logged in as ${client.user?.tag}`);
  });

  // Handle messages
  client.on("messageCreate", handleMessage);

  // Login to Discord
  await client.login(token);
  logger.info("ThanksBot initialized and connected to Discord");
}
```

### 2. Notion Integration (Moderate)

**File**: `apps/thanksbot/thanksbot.ts`

**Purpose**: Store thank-you messages in Notion

**Technical Specifications**:

- Initialize Notion client
- Create new entries in Notion database
- Handle API errors gracefully

**Implementation Details**:

```typescript
// Store thank-you in Notion
async function storeThankYou(
  from: string,
  to: string,
  reason: string,
  notionClient,
  databaseId,
) {
  try {
    await notionClient.pages.create({
      parent: { database_id: databaseId },
      properties: {
        "From (discord)": {
          rich_text: [{
            text: {
              content: from,
            },
          }],
        },
        "To (discord)": {
          rich_text: [{
            text: {
              content: to,
            },
          }],
        },
        "Message": {
          title: [{
            text: {
              content: reason,
            },
          }],
        },
      },
    });
    return true;
  } catch (e) {
    logger.error(`Error storing in Notion: ${e}`);
    return false;
  }
}
```

### 3. Message Parsing (Simple)

**File**: `apps/thanksbot/thanksbot.ts`

**Purpose**: Parse Discord messages for thank-you mentions

**Technical Specifications**:

- Extract user mentions and reasons from messages
- Validate message format
- Provide guidance for incorrect formats

**Implementation Details**:

```typescript
// Parse thank-you message
function parseThankYouMessage(content: string) {
  const pattern = /#thanks\s*<@!?(\d+)>\s*for\s*(.*)/i;
  const match = content.match(pattern);

  if (!match) {
    return null;
  }

  return {
    userId: match[1],
    reason: match[2].trim(),
  };
}
```

## Testing Strategy

1. **Discord Integration**:
   - Test bot connection to Discord
   - Verify message event handling
   - Test response generation

2. **Notion Integration**:
   - Test database creation and entry adding
   - Verify correct data formatting
   - Test error handling

3. **Message Parsing**:
   - Test format validation
   - Verify user mention extraction
   - Test reason extraction
