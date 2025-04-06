# InternalBF: Internal Bolt Foundry Services

## Start With the User (Not Your Code)

InternalBF serves as a collection of internal services for Bolt Foundry,
providing a unified platform for miscellaneous backend tools and utilities
needed by the Bolt Foundry team. The primary users are internal team members who
need access to operational tools.

## Current Features

- **ThanksBot**: Discord integration for tracking thank-you messages
- **Desks App Integration**: Routing for the Desks video communication app

## Key User Scenarios

1. **Discord Thank-You Tracking**:
   - User sends "#thanks @someone for reason" in Discord
   - ThanksBot captures this information and stores it in Notion
   - ThanksBot responds with confirmation

2. **Desks Application Access**:
   - User navigates to `/desks` endpoint
   - System routes request to Desks application
   - Desks application handles the request

## Implementation Phases

### Phase 0.1: Foundation (Simple)

- Set up basic HTTP server with Deno
- Implement routing system for different applications
- Create environment variable handling
- Set up logging infrastructure
- Integrate initial ThanksBot Discord functionality

### Phase 0.2: Service Expansion (Moderate)

- Add additional internal tool integrations
- Implement improved error handling and monitoring
- Create usage analytics for internal services
- Improve documentation and setup guides

### Phase 0.3: Advanced Features (Challenging)

- Add authentication and authorization for sensitive endpoints
- Create dashboard for service health and metrics
- Implement rate limiting and security features
- Support for additional third-party integrations

## Success Metrics

- **Reliability**: >99.9% uptime for critical services
- **Integration**: Successfully routes requests to the correct applications
- **Extensibility**: New services can be added with minimal code changes
- **Maintainability**: Well-documented code and processes for troubleshooting

## Technical Considerations

- Built with Deno runtime for TypeScript
- Follows Bolt Foundry monorepo structure and coding standards
- Uses environment variables for configuration
- Implements structured logging for operational monitoring
