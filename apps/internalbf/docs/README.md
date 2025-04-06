# InternalBF Documentation

This directory contains documentation for the InternalBF application, which
serves as a platform for internal Bolt Foundry services and utilities.

## Documentation Structure

- `project-plan.md` - Overall project vision and goals
- `implementation-plan.md` - High-level implementation strategy across all
  versions
- Version-specific directories:
  - `0.1/` - Initial implementation (ThanksBot and Desks routing)
  - `0.2/` - Service expansion and operational improvements
  - `0.3/` - Advanced features and integrations

## Development Guide

1. **Local Setup**:
   ```
   deno run --allow-net --allow-env apps/internalbf/internalbf.ts
   ```

2. **Environment Variables**: Required for ThanksBot:
   - `THANKSBOT_TOKEN` - Discord bot token
   - `THANKSBOT_NOTION_TOKEN` - Notion API token
   - `THANKSBOT_NOTION_DATABASE_ID` - Notion database ID

3. **Adding New Services**: Create a new service handler in the `services/`
   directory and add routing in the main request handler.

## Service Catalog

1. **ThanksBot** - Discord bot for tracking thank-you messages
   - Listens for "#thanks @user for reason" messages
   - Stores records in Notion database
   - Responds with confirmation

2. **Desks** - Routing for the Desks video communication app
   - Routes requests to `/desks` to the Desks application
   - Preserves request context and headers
