# InternalBF Product Plan

**Author**: Claude\
**Status**: Planning

## Vision

Transform InternalBF from a simple Discord bot runner into a full-featured
internal tools platform using the same architecture as our production
applications (Isograph, GraphQL, BfDs).

## Goals

1. **Unified Internal Tools Platform**: Single place for all internal Bolt
   Foundry tools
2. **Production-Quality Architecture**: Use same patterns as customer-facing
   apps
3. **Secure Production Access**: Controlled access to production data via schema
   stitching
4. **Extensible Framework**: Easy to add new internal tools

## Core Features

### Phase 1: Foundation

- Isograph-based routing system
- GraphQL schema with production data stitching
- BfDs component integration
- Basic authentication/authorization

### Phase 2: Initial Tools

- **Dashboard**: Overview of all available tools
- **Commits Viewer**: Sapling PR stack viewer (inspired by ReviewStack)
- **ThanksBot Manager**: UI for viewing/managing Discord thanks
- **Desks**: TBD collaboration tool

### Phase 3: Enhanced Features

- User preferences and settings
- Activity logging and analytics
- Advanced PR review features
- API integration dashboard

## Technical Architecture

### Application Structure

```
apps/internalbf/
├── __generated__/          # Isograph generated files
├── components/             # React components using BfDs
├── entrypoints/           # Route entry points
├── graphql/               # Schema and resolvers
├── routes.ts              # Route definitions
├── isograph.config.json   # Isograph configuration
└── internalbf.ts          # Discord bot (remains separate)
```

### Database Design

- Same database instance as production
- Separate schema/tables with `internalbf_` prefix
- Production data access via GraphQL schema stitching
- Clear separation between internal and production data

### GraphQL Schema Strategy

```graphql
type Query {
  # Internal tools queries
  dashboard: Dashboard!
  githubPR(org: String!, repo: String!, number: Int!): PullRequest
  thanksbot: ThanksBotStats!
  
  # Stitched production data access
  prod: ProductionQuery!
}
```

### Security Model

1. **Authentication**: GitHub OAuth or existing Bolt Foundry auth
2. **Authorization**: Role-based access to different tools
3. **Audit Trail**: Log all production data access
4. **Token Management**: Secure storage of API tokens

## Implementation Roadmap

### Phase 1: Foundation

- [ ] Set up Isograph configuration
- [ ] Create basic routing structure
- [ ] Implement GraphQL schema
- [ ] Set up database tables

### Phase 2: Core Features

- [ ] Dashboard component
- [ ] Basic authentication
- [ ] Production data stitching
- [ ] Deployment configuration

### Phase 3: Commits Viewer

- [ ] Port ReviewStack-inspired functionality
- [ ] Sapling stack detection
- [ ] GitHub API integration
- [ ] BfDs-based UI

### Phase 4: Additional Tools

- [ ] ThanksBot UI
- [ ] Desks placeholder
- [ ] Navigation and layout
- [ ] Error handling

### Phase 5: Enhancements

- [ ] Advanced PR features
- [ ] User preferences
- [ ] Analytics dashboard
- [ ] Performance optimization

## Design Principles

1. **Consistency**: Use existing patterns from boltFoundry
2. **Simplicity**: Start simple, iterate based on usage
3. **Security**: Production data access is privileged
4. **Modularity**: Each tool is independent
5. **User-Centric**: Built for internal team efficiency

## Future Possibilities

- **AI Integration**: Claude API for code reviews
- **Monitoring Dashboard**: System health visualization
- **Deploy Manager**: One-click deployments
- **Customer Debug Tools**: Safe production debugging
- **Team Analytics**: Development velocity tracking

## Open Questions

1. Should we migrate the Discord bot to the same process?
2. What level of production data access is appropriate?
3. Should this be open-sourced eventually?
4. How do we handle authentication for external contributors?

## Next Steps

1. Review and approve this plan
2. Create detailed implementation plans for each component
3. Set up development environment
4. Begin Phase 1 implementation
